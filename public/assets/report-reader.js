/*
  REPORT READER for the calculators under /tools.

  A patient or doctor picks a lab report (the lab's PDF, or a photo of each
  page). This file reads it ON THE DEVICE and fills the calculator's boxes.
  Nothing is uploaded: the PDF reader (pdf.js) and the photo text reader
  (tesseract.js, OCR) are served from /vendor on this site and run in the
  browser. The pages promise "nothing you enter leaves this page", and this
  keeps that promise.

  HOW A VALUE IS FOUND
  The report is turned into lines of text. For each test the calculator wants,
  the first line naming that test (and not a look-alike, for example
  haemoglobin but not HbA1c or HbA2) is taken, reference ranges and "x10^3"
  style unit tokens are removed, and the first number in a plausible range,
  after unit conversion, is used. Footnote-style lines ("may", "indicates",
  "if") are skipped. Yes or no tests (NS1, IgM, malaria, culture) read the
  words after the test name. Every filled box is highlighted and the source
  line is shown, so the person checks each one against the report.

  USE
    ReportReader.attach({ mount: element, fields: { key: target, ... },
                          labels: { key: 'Name shown', ... }, note: 'html' })
  target is an element id (number box or select), or
    { radio: 'name' }   for a radio group (sex),
    { check: 'id' }     for a checkbox ticked only when a finding is present.
*/
(function () {
  'use strict';
  var V = '/vendor/';

  /* ---------- text helpers ---------- */
  function norm(s) {
    return String(s || '')
      .replace(/[‐-―−]/g, '-')
      .replace(/[µμ]/g, 'u')
      .replace(/×/g, 'x')
      .replace(/[|¦]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  var PROSE = /\bmay\b|\bcan\b|indicat|suggests?\b|interpret|\bif\b|should|recommend|levels? (?:of|below|above)|associated with|such as|e\.g\.|seen in\b|reference|note\s*:|method\s*:\s*\w+\s+\w+\s+\w+/;

  // Numbers after a test name, with ranges and exponent tokens removed.
  function nums(t) {
    var ref = null;
    t = ' ' + t + ' ';
    t = t.replace(/(\d),(?=\d{2,3}\b)/g, '$1');                         // 2,50,000 and 250,000
    t = t.replace(/[x*]\s*10\s*(?:\^|\*|e)?\s*[0-9³⁶⁹]?\b/gi, ' ');  // x10^3, x 10 3
    t = t.replace(/\b10\s*(?:\^|\*)\s*\d+/g, ' ').replace(/\b10[³⁶⁹]/g, ' ');
    t = t.replace(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/g, function (m, a, b) { if (!ref) ref = [+a, +b]; return ' '; });
    var out = [], lt = null, gt = null, re = /(?:^|[^\d.a-z])([<>]?)\s*(\d+(?:\.\d+)?)/gi, m;
    while ((m = re.exec(t))) { out.push(+m[2]); if (m[1] === '<' && lt == null) lt = +m[2]; if (m[1] === '>' && gt == null) gt = +m[2]; }
    return { list: out, ref: ref, lt: lt, gt: gt };
  }

  // Yes or no reading of a stretch of text: the earliest word wins, so a
  // result followed by its interpretation line reads correctly.
  function qual(s) {
    var neg = /non[\s-]*reactive|negative|not\s*detected|not\s*seen|\babsent\b|\bnil\b|no\s+(?:growth|parasites?|antigen|antibod)|\bneg\b/.exec(s);
    var pos = /(?:^|[^n])\breactive\b|positive|\bdetected\b|\bpresent\b|\bseen\b|\bpos\b/.exec(s);
    if (neg && (!pos || neg.index <= pos.index + 4)) return 'n';
    if (pos) return 'p';
    return null;
  }

  /* ---------- what each test looks like on an Indian lab report ---------- */
  var DEF = {
    hb: { re: /\b(?:ha?emoglobin|hgb|hb)\b/, not: /a1c|glycated|glycosylated|\bhb\s*a\s*[12c]\b|\bhba[12c]?\b|ha?emoglobin\s*a\s*[12]|electrophoresis|hplc|variant|\bmchc?\b|corpuscular|cell ha?emoglobin|urine|plasma free|fetal|\bhb\s*[fes]\b|estimated average|ret-?he/, min: 2, max: 25,
      conv: function (v, l) { return (v > 25 && v < 250 && /g\s*\/\s*l\b/.test(l)) ? v / 10 : v; } },
    hct: { re: /ha?ematocrit|\bhct\b|\bpcv\b|packed cell volume/, min: 5, max: 75, conv: function (v) { return v < 1 ? v * 100 : v; } },
    mcv: { re: /\bmcv\b|mean (?:corpuscular|cell) volume/, min: 40, max: 150 },
    rdw: { re: /\brdw\b|red (?:blood )?cell distribution/, not: /\brdw\s*-?\s*sd\b|\bsd\b/, min: 8, max: 40,
      conv: function (v, l) { return (/\bfl\b/.test(l) && v > 25) ? null : v; } },
    rbc: { re: /\brbc\b|red blood cells?\b|r\.b\.c|red cell count|erythrocytes?(?: count)?\b|total rbc/, not: /distribution|morpholog|\/\s*hpf|per hpf|urine|folate|\brdw|\bmcv|indices|nucleated|nrbc|sedimentation|\besr\b|rbcs?\s*:/, min: 1, max: 8.5,
      conv: function (v) { return v > 1e5 ? v / 1e6 : v; } },
    retic: { re: /reticulocyte/, not: /index|production|absolute|\babs\b|\brpi\b|ha?emoglobin|ret-?he|\bchr\b|maturity|\birf\b/, min: 0, max: 40 },
    wbc: { re: /\btlc\b|total (?:leu[ck]ocyte|wbc|white|count)|\bwbc\b|white (?:blood )?cells?|leu[ck]ocytes?\b|\btc\b/, not: /differential|\bdlc\b|neutro|lympho|mono|eosino|baso|\/\s*hpf|per hpf|urine|esterase|morpholog|series|wbcs?\s*:|abnormal/, min: 0.3, max: 200000,
      conv: function (v) { return (v > 100 && v < 300) ? null : v; } },
    anc: { re: /absolute neutrophils?(?: count)?|neutrophils?\s*(?:\(\s*)?(?:abs(?:olute)?\.?|count\s*\(?abs)|\banc\b/, not: /%|ratio|\bnlr\b/, min: 0, max: 100000,
      conv: function (v) { return v < 60 ? v * 1000 : v; } },
    plt: { re: /platelets?(?: count)?|\bplt\b|thrombocytes?/, not: /\bmpv\b|\bpdw\b|\bpct\b|plateletcrit|large cell|p-?lcr|distribution|volume|clump|aggregat|adequate|morpholog|on smear|platelets?\s*:\s*[a-z]/, min: 1, max: 1500000,
      conv: function (v, l) { if (/lakh|\blacs?\b|\blac\b/.test(l) && v < 50) return v; if (v > 1500 && v < 10000) return null; return v; } },
    fer: { re: /ferritin/, min: 0.5, max: 50000 },
    tsat: { re: /transferrin saturation|(?:%|percent(?:age)?)\s*(?:transferrin\s*)?saturation|\btsat\b|iron saturation|saturation\s*(?:%|of transferrin)/, not: /oxygen|spo2|\bo2\b|uibc/, min: 1, max: 100 },
    sfe: { re: /\b(?:serum\s*)?iron\b/, not: /binding|tibc|uibc|saturation|ferritin|deficien|profile|studies|transferrin|panel/, min: 5, max: 500,
      conv: function (v, l) { return /umol/.test(l) ? v * 5.585 : v; } },
    tibc: { re: /\btibc\b|total iron binding/, min: 80, max: 800, conv: function (v, l) { return /umol/.test(l) ? v * 5.585 : v; } },
    crp: { re: /c[\s-]?reactive protein|\b(?:hs[\s-]?)?crp\b/, min: 0, max: 600, conv: function (v, l) { return /mg\s*\/\s*dl/.test(l) ? v * 10 : v; } },
    egfr: { re: /\begfr\b|e-gfr|estimated gfr|estimated glomerular/, min: 2, max: 200 },
    b12: { re: /(?:vitamin|vit\.?)\s*b\s*-?\s*12|\bb\s*-?\s*12\b|cyano-?cobalamin|cobalamin/, not: /active|holo|ratio/, min: 30, max: 5000,
      unit: function (l) { return /pmol/.test(l) ? 'pmol' : 'pg'; } },
    fol: { re: /folate|folic acid/, not: /rbc folate|red cell folate|erythrocyte folate/, min: 0.3, max: 60,
      conv: function (v, l) { return /nmol/.test(l) ? v / 2.266 : v; } },
    a2: { re: /ha?emoglobin\s*-?\s*a\s*2\b|\bhb\s*-?\s*a\s*2\b|\bhba2\b/, min: 0.5, max: 15 },
    ibil: { re: /indirect\s*bilirubin|bilirubin\s*[,(\-]?\s*\(?\s*(?:indirect|unconjugated)|unconjugated\s*bilirubin/, min: 0, max: 30 },
    bil: { re: /total\s*bilirubin|bilirubin\s*[,(\-]?\s*\(?\s*total|(?:s\.|serum)\s*bilirubin\b|^bilirubin\s*(?:\(?\s*total|\d|[:=-]\s*\d)/, not: /^(?:in)?direct|urine|conjugated\s*bilirubin\s*\d/, min: 0, max: 40 },
    alt: { re: /\balt\b|\bsgpt\b|alanine\s*(?:amino)?transaminase|alanine aminotransferase/, min: 1, max: 20000 },
    na: { re: /\bsodium\b|\bna\s*\+|^na\b/, not: /urine|urinary|valproate|bicarbonate/, min: 90, max: 190 },
    cr: { re: /creatinine/, not: /clearance|ratio|urine|urinary|\bacr\b|\bgfr\b|egfr|kinase|\bcpk\b/, min: 0.1, max: 25,
      conv: function (v, l) { return (/umol/.test(l) || v > 30) ? v / 88.4 : v; } },
    glu: { re: /glucose|blood sugar|\brbs\b|\bfbs\b|\bgrbs\b|\bcbg\b|\bppbs\b|\bsugar\b/, not: /urine|urinary|\beag\b|average|hba1c|tolerance|phosphate|g6pd|\bcsf\b|\bnil\b|variability|management|indicator|metrics|sensor|in\s*range|target\s*range|cgm|\bagp\b|6\s*-?\s*phosphate/, min: 20, max: 1000,
      conv: function (v, l) { return /mmol/.test(l) ? v * 18 : v; } },
    ldh: { re: /\bldh\b|lactate dehydrogenase|\bl\.?d\.?h\b/, min: 30, max: 20000, level: 250 },
    // kidney
    cys: { re: /cystatin/, min: 0.2, max: 12, conv: function (v, l) { return /nmol/.test(l) ? null : v; } },
    acr: { re: /albumin\s*(?:\/|:|-|to)\s*creatinine|\buacr\b|\bacr\b|microalbumin\s*(?:\/|:|-|to)\s*creat|albumin\s*creatinine\s*ratio/, not: /protein|\bpcr\b|\bupcr\b/, min: 0, max: 30000,
      unit: function (l) { return /mg\s*\/\s*mmol/.test(l) ? 'mgmmol' : 'mgg'; } },
    pcr: { re: /protein\s*(?:\/|:|-|to)\s*creatinine|\bupcr\b|protein\s*creatinine\s*ratio/, not: /albumin/, min: 0, max: 30000,
      unit: function (l) { return /mg\s*\/\s*mmol/.test(l) ? 'mgmmol' : 'mgg'; } },
    k: { re: /\bpotassium\b|\bk\s*\+|^k\b/, not: /urine|urinary|chloride|vitamin|\bk\s*2\b/, min: 1.5, max: 9 },
    urea: { re: /\burea\b/, not: /\bbun\b|nitrogen|urine|urinary|uric|breath/, min: 3, max: 500, conv: function (v, l) { return /mmol/.test(l) ? v * 6.006 : v; } },
    bun: { re: /\bbun\b|urea\s*nitrogen/, not: /urine/, min: 1, max: 250, conv: function (v, l) { return /mmol/.test(l) ? v * 2.8 : v; } },
    uric: { re: /uric\s*acid|\burate\b/, not: /urine|urinary|24\s*h/, min: 0.5, max: 25, conv: function (v, l) { return /umol/.test(l) ? v / 59.48 : v; } },
    // liver and bone
    ast: { re: /\bast\b|\bsgot\b|aspartate/, min: 1, max: 30000 },
    alp: { re: /\balp\b|alkaline\s*phosphatase|\bsap\b/, not: /bone|placental|leu[ck]ocyte/, min: 5, max: 5000 },
    ggt: { re: /\bggt\b|\bggtp\b|gamma\s*-?\s*gl|gamma\s*gt/, min: 1, max: 10000 },
    alb: { re: /\balbumin\b/, not: /urine|urinary|micro|creatinine|ratio|globulin|\ba\s*\/\s*g\b|24\s*h|excretion/, min: 0.8, max: 6.5, conv: function (v, l) { return (/g\s*\/\s*l\b/.test(l) || v > 8) ? v / 10 : v; } },
    ca: { re: /\bcalcium\b/, not: /ionized|ionised|urine|urinary|score|agatston|coronary|channel|corrected|24\s*h|blocker/, min: 4, max: 16, conv: function (v, l) { return /mmol/.test(l) ? v * 4.008 : v; } },
    vitd: { re: /25\s*-?\s*(?:oh|hydroxy)|vitamin\s*-?\s*d\b|vit\.?\s*d\b|cholecalciferol|calcidiol/, not: /1\s*,\s*25|dihydroxy|binding|d\s*2\s*\/|supplement|dose|tablet|sachet/, min: 1, max: 250,
      pre: function (t) { return t.replace(/25\s*-?\s*\(?\s*oh\s*\)?|25\s*-?\s*hydroxy\w*|\bd\s*3\b|\bd\s*2\b/g, ' '); },
      conv: function (v, l) { return /nmol/.test(l) ? v / 2.496 : v; } },
    // thyroid
    tsh: { re: /\btsh\b|thyroid\s*stimulating|thyrotropin/, not: /receptor|antibod|\btrab\b/, min: 0.001, max: 600 },
    ft4: { re: /free\s*t\s*-?\s*4|\bft4\b|free\s*thyroxine/, min: 0.05, max: 12, conv: function (v, l) { return (/pmol/.test(l) || v > 12) ? v / 12.87 : v; } },
    ft3: { re: /free\s*t\s*-?\s*3|\bft3\b|free\s*tri-?iodo/, min: 0.3, max: 40, conv: function (v, l) { return /pmol/.test(l) ? v / 1.536 : v; } },
    // sugar
    hba1c: { re: /hb\s*a\s*-?\s*1\s*c|glycated\s*h|glycosylated\s*h|\ba1c\b|glyco\s*-?\s*h(?:a?e)?moglobin/, not: /\beag\b|estimated\s*average|average\s*glucose|target|goal|aim/, min: 3, max: 20,
      conv: function (v, l) { if (v > 20 && v < 200 && /mmol\s*\/\s*mol/.test(l)) return Math.round((v * 0.09148 + 2.152) * 10) / 10; return v; } },
    fpg: { re: /fasting[^.]{0,30}?(?:glucose|sugar|plasma|blood)|(?:glucose|sugar)[^.]{0,25}?fasting|\bfbs\b|\bfpg\b|\bfbg\b|\bf\.?\s*b\.?\s*s\.?\b/, not: /urine|urinary|insulin|c\s*-?\s*peptide|tolerance|\bgtt\b|\bogtt\b|post|\bpp\b|lipid|hours\s*required|eag/, min: 20, max: 900,
      conv: function (v, l) { return (/mmol/.test(l) && v < 60) ? v * 18 : v; } },
    ppg: { re: /post\s*-?\s*prandial|\bppbs\b|\bppg\b|\bpp\s*(?:blood\s*)?(?:sugar|glucose)|(?:2|two)\s*-?\s*h(?:ou)?rs?\s*(?:post|after)|after\s*(?:food|meal|breakfast|lunch)/, not: /urine|urinary|insulin|c\s*-?\s*peptide|tolerance|\bgtt\b/, min: 20, max: 900,
      conv: function (v, l) { return (/mmol/.test(l) && v < 60) ? v * 18 : v; } },
    // lipids
    tc: { re: /total\s*cholesterol|cholesterol\s*,?\s*total|serum\s*cholesterol|^cholesterol\b|\bt\.?\s*chol/, not: /hdl|ldl|vldl|ratio|\bnon\b|non\s*-?\s*hdl|esterified/, min: 40, max: 800, conv: function (v, l) { return (/mmol/.test(l) && v < 20) ? v * 38.67 : v; } },
    ldl: { re: /\bldl\b|low\s*density/, not: /vldl|ratio|oxidi|particle|size|non\s*-?\s*hdl|small\s*dense|sdldl/, min: 5, max: 600, conv: function (v, l) { return (/mmol/.test(l) && v < 20) ? v * 38.67 : v; } },
    hdl: { re: /\bhdl\b|high\s*density/, not: /non\s*-?\s*hdl|ratio|vldl|ldl\s*\/|\/\s*hdl/, min: 5, max: 250, conv: function (v, l) { return (/mmol/.test(l) && v < 10) ? v * 38.67 : v; } },
    tg: { re: /triglycerides?|\btgl?\b/, not: /ratio|\/\s*hdl/, min: 15, max: 8000, conv: function (v, l) { return (/mmol/.test(l) && v < 60) ? v * 88.57 : v; } },
    nonhdl: { re: /non\s*-?\s*hdl/, not: /ratio/, min: 20, max: 700, conv: function (v, l) { return (/mmol/.test(l) && v < 20) ? v * 38.67 : v; } },
    apob: { re: /apo\s*-?\s*(?:lipoprotein\s*)?b\b|apolipoprotein\s*-?\s*b/, not: /a1|ratio|\/|apo\s*-?\s*a/, min: 10, max: 400, conv: function (v, l) { return (/g\s*\/\s*l\b/.test(l) && v < 5) ? v * 100 : v; } },
    lpa: { re: /lipoprotein\s*\(?\s*a\s*\)?(?!\s*\d)|\blp\s*\(?\s*a\s*\)?|\blp\s*-?\s*a\b/, not: /apo|apolipoprotein|\blp\s*\(?\s*a\s*\)?\s*-?\s*i\b|lipase|lipoprotein\s*lipase/, min: 0.5, max: 900,
      unit: function (l) { return /nmol/.test(l) ? 'nmol' : 'mgdl'; } },
    // heart
    ntprobnp: { re: /nt\s*-?\s*pro\s*-?\s*bnp|n\s*-?\s*terminal/, min: 5, max: 90000, conv: function (v, l) { return /pmol/.test(l) ? v * 8.457 : v; } },
    bnp: { re: /\bbnp\b|brain\s*natriuretic|b\s*-?\s*type\s*natriuretic/, not: /\bnt\b|pro\s*-?\s*bnp|terminal/, min: 2, max: 20000, conv: function (v, l) { return /pmol/.test(l) ? v * 3.46 : v; } },
    lvef: { re: /\blvef\b|ejection\s*fraction|\bef\b\s*[:=(]|\bef\s*\(|\blv\s*ef\b|\bef\s*\d/, not: /\brvef\b|right\s*vent|rv\s*ef|teicholz\s*only|def\b/, min: 5, max: 85 },
    ee: { re: /\be\s*\/\s*e\s*['\u2019`]|\be\s*\/\s*e\s*prime|e\s*\/\s*e\s*avg|e\/e'/, min: 2, max: 45 },
    pasp: { re: /\bpasp\b|\brvsp\b|pulmonary\s*artery\s*(?:systolic\s*)?pressure|pa\s*systolic|\bspap\b|\bpa\s*pressure/, min: 8, max: 160 },
    qrs: { re: /\bqrs\b/, not: /axis|voltage|amplitude|morpholog/, min: 40, max: 260, conv: function (v) { return v < 1 ? v * 1000 : v; } },
    // diabetes type
    cpep: { re: /c\s*-?\s*peptide/, not: /stimulated\s*only|urine/, min: 0.005, max: 9000,
      unit: function (l) { return /nmol/.test(l) ? 'nmoll' : /pmol/.test(l) ? 'pmoll' : 'ngml'; } },
    gad: { qnum: true, re: /gad\s*-?\s*65|\bgad\b|glutamic\s*acid\s*decarboxylase|glutamate\s*decarboxylase/, cut: 5 },
    ia2: { qnum: true, re: /\bia\s*-?\s*2\b|islet\s*antigen\s*2|tyrosine\s*phosphatase|\bica\s*-?\s*512/, cut: 7.5 },
    znt8: { qnum: true, re: /znt\s*-?\s*8|zinc\s*transporter/, cut: 15 },
    bket: { re: /beta\s*-?\s*hydroxy|\bbhb\b|\bb\s*-?\s*ohb\b|blood\s*ketones?|ketones?\s*\(?\s*blood|3\s*-?\s*hydroxybutyrate/, not: /urine|urinary|dipstick/, min: 0, max: 20 },
    // vessels and heart scans
    abi: { re: /\babi\b|ankle\s*-?\s*brachial/, not: /\btbi\b|toe/, min: 0.1, max: 2.2, pickMin: true },
    tbi: { re: /\btbi\b|toe\s*-?\s*brachial/, min: 0.05, max: 1.6, pickMin: true },
    cac: { re: /agatston|calcium\s*score|\bcac\s*score|\bcacs\b|coronary\s*(?:artery\s*)?calcium/, not: /percentile|volume|mass/, min: 0, max: 20000, zeroOk: true },
    // body
    ht: { re: /\bheight\b|\bht\.?\s*[:=]|\blength\b|\bstature\b/, not: /sitting|knee|fundal|\bcm\s*\/|percentile|arm\s*span|foot\s*length|crown[\s-]*rump|segment|cycle|\bqt\b|penile|femur|cervical|\bbpd\b|\bcrl\b|wave|pulse|time/, min: 35, max: 250, conv: function (v, l) { if (v < 3) return v * 100; if (/\bft\b|feet|inch|\bin\b|'/.test(l) && v < 10) return null; return v; } },
    wt: { re: /\bweight\b|\bwt\.?\s*[:=]/, not: /birth|dry\s*weight|molecular|target|ideal|loss|gain|change|\blbs?\b|pounds/, min: 2, max: 400 },
    bmi: { re: /\bbmi\b|body\s*mass\s*index/, not: /percentile|z\s*-?\s*score|target/, min: 8, max: 95 },
    hc: { re: /head\s*circumference|\bhc\b\s*[:=]?\s*\d|\bofc\b|occipito/, not: /chest|mid\s*-?\s*arm|\bmuac\b|waist|hip/, min: 25, max: 62 },
    // blood gas (only read when the report is a blood gas)
    ph: { re: /\bph\b/, not: /urine|urinary|phos|\bph\s*of/, min: 6.6, max: 7.9, ctx: /pco2|paco2|\bpo2\b|pao2|hco3|bicarb|blood\s*gas|\babg\b|\bvbg\b/ },
    pco2: { re: /pa?co2|pco\s*2/, min: 8, max: 160, conv: function (v, l) { return /kpa/.test(l) ? v * 7.5 : v; } },
    po2: { re: /\bpa?o2\b|\bpo\s*2\b/, not: /pco2|paco2|spo2|sao2/, min: 15, max: 700, conv: function (v, l) { return /kpa/.test(l) ? v * 7.5 : v; } },
    hco3: { re: /hco3|bicarb/, not: /std\s*bicarb|standard/, min: 3, max: 65 },
    lact: { re: /\blactate\b|lactic\s*acid/, not: /dehydrogenase|\bldh\b/, min: 0.1, max: 35, conv: function (v, l) { return /mg\s*\/\s*dl/.test(l) ? v / 9.01 : v; } },
    sao2: { re: /\bsa?o2\b|o2\s*sat|oxygen\s*saturation/, not: /spo2/, min: 20, max: 100 },
    // inflammation and others
    esr: { re: /\besr\b|erythrocyte\s*sedimentation/, min: 0, max: 200, zeroOk: true },
    psa: { re: /\bpsa\b|prostate\s*specific/, not: /free|ratio|%|percent/, min: 0.01, max: 20000 },
    // CGM report (AGP) metrics: percentages must carry a % sign; only read when the text is a CGM report
    tir: { pct: true, re: /target\s*range|time\s*in\s*(?:target\s*)?range|\bin\s*range\b|\btir\b/, not: /below|above|out\s*of|outside/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b|sensor|libre|dexcom|clarity|carelink/ },
    vhigh: { pct: true, re: /very\s*high/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    high: { pct: true, notVery: true, re: /(?:^|[^a-z])high\b/, not: /higher|highest|highly|high\s*risk|high\s*alert/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    low: { pct: true, notVery: true, re: /(?:^|[^a-z])low\b/, not: /lower|lowest|follow|yellow|flow|low\s*alert|low\s*risk|allow/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    vlow: { pct: true, re: /very\s*low/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    gmean: { re: /average\s*glucose|mean\s*glucose|avg\.?\s*glucose|glucose\s*average|average\s*sensor\s*glucose/, not: /estimated|\beag\b/, min: 2, max: 600, pre: function (t) { return t.replace(/(?:goal|target)[^0-9<>]{0,8}[<>]?=?\s*\d+(?:\.\d+)?\s*(?:%|mg\s*\/\s*dl|mmol\s*\/\s*l)?/g, ' '); }, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b|sensor/,
      unit: function (l, v) { return (/mmol/.test(l) || v < 30) ? 'mmol' : 'mgdl'; } },
    gmi: { re: /glucose\s*management\s*indicator|\bgmi\b/, min: 3, max: 20, pctFirst: true, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    gcv: { pct: true, re: /glucose\s*variability|coefficient\s*of\s*variation|\bcv\b|%\s*cv/, not: /cvd|cardio/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    gactive: { pct: true, re: /time\s*(?:cgm|sensor)\s*(?:is\s*)?active|sensor\s*(?:usage|wear|active)|cgm\s*active|%\s*time\s*cgm|data\s*sufficiency|time\s*active/, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    gdays: { re: /(\d+)\s*days?\b/, before: true, not: /ago|every|within|last\s*\d+\s*days\s*of|per\s*day|hours/, min: 1, max: 120, ctx: /time\s*in\s*range|target\s*range|glucose\s*management|\bgmi\b|ambulatory\s*glucose|\bagp\b/ },
    // yes or no tests
    tNS1: { q: true, re: /\bns\s*-?\s*1\b/ },
    tDIgM: { q: true, re: /dengue[^]{0,40}\bigm\b|\bigm\b[^]{0,25}dengue/, not: /igg/ },
    tScrub: { q: true, re: /scrub|tsutsugamushi|orientia/, not: /weil|felix|ox\s*-?\s*k/ },
    tLepto: { q: true, re: /leptospir/, not: /weil|felix/ },
    tChik: { q: true, re: /chikungunya|\bchik\b/ },
    dat: { q: true, re: /direct\s*(?:coombs|antiglobulin)|\bdat\b|coombs\s*(?:test\s*)?\(?\s*direct/, not: /indirect/ }
  };

  var SMEAR = {
    smHypo: /microcyt\w*|hypochrom\w*|pencil cells?/,
    smTarget: /target cells?|basophilic stippling|stippled/,
    smMacro: /macro-?ovalocytes?|oval macrocytes?|hypersegment\w*/,
    smFrag: /schistocytes?|fragmented (?:rbcs?|red cells|cells)|helmet cells?|fragmentocytes?/,
    smSph: /spherocytes?/,
    smSickle: /sickle cells?|drepanocytes?/,
    smBlast: /\bblasts?\b|atypical cells|abnormal cells/,
    smPara: /malari\w* parasites?|ha?emoparasites?|ring forms?|gametocytes?|plasmodium/
  };

  /* ---------- the parser (pure: tested outside the page) ---------- */
  function parse(rawLines, keys, popt) {
    popt = popt || {};
    var lines = rawLines.map(norm).filter(Boolean);
    var low = lines.map(function (l) { return l.toLowerCase(); });
    var all = low.join('\n');
    var found = {};
    function put(k, v, i, extra) { if (found[k] == null && v != null) found[k] = { v: v, src: lines[i], weak: !!(extra && extra.weak) }; }

    keys.forEach(function (k) {
      var d = DEF[k];
      if (!d) return;
      if (d.ctx && !d.ctx.test(all)) return;
      for (var i = 0; i < low.length && found[k] == null; i++) {
        var l = low[i], m = d.re.exec(l);
        if (!m) continue;
        if (d.not && d.not.test(l)) continue;
        if (l.length > 70 && PROSE.test(l)) continue;
        var rest = d.before ? l : l.slice(m.index + m[0].length);
        if (d.pct) {
          var g = new RegExp(d.re.source, 'g'), mm, got = null;
          while ((mm = g.exec(l)) && got == null) {
            if (d.notVery && /very\s*$/.test(l.slice(Math.max(0, mm.index - 8), mm.index))) continue;
            var seg = l.slice(mm.index + mm[0].length, mm.index + mm[0].length + 60).replace(/[<>]\s*\d+(?:\.\d+)?/g, ' ').replace(/\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?/g, ' ');
            var pm = /^[^%\d]*?(\d+(?:\.\d+)?)\s*%/.exec(seg);
            if (pm && +pm[1] >= 0 && +pm[1] <= 100) got = +pm[1];
          }
          if (got != null) put(k, got, i);
          continue;
        }
        if (d.qnum) {
          if (PROSE.test(l) && l.length > 70) continue;
          var qn = nums(rest), cut = qn.lt != null ? qn.lt : (qn.ref ? qn.ref[1] : d.cut);
          var numeric = qn.list.filter(function (z) { return z !== qn.lt && z !== qn.gt; });
          if (numeric.length) { var qv = numeric[0]; put(k, qv > cut ? 'pos' : 'neg', i, { weak: qn.lt == null && !qn.ref }); found[k].num = qv; found[k].cut = cut; continue; }
          var qq = qual(rest);
          if (qq) put(k, qq === 'p' ? 'pos' : 'neg', i);
          continue;
        }
        if (d.q) {
          if (PROSE.test(l)) continue;
          var r = qual(rest), j = i;
          if (r == null && low[i + 1] && !DEF[k].re.test(low[i + 1])) { r = qual(low[i + 1]); j = i + 1; }
          if (r) put(k, r, i, { weak: j !== i });
          continue;
        }
        var tryLine = function (text, line, weak) {
          if (d.pre) text = d.pre(text);
          var n = nums(text);
          if (d.pctFirst) { var pf = /(\d+(?:\.\d+)?)\s*%/.exec(text); if (pf) n.list.unshift(+pf[1]); }
          if (d.pickMin) { var cands = n.list.filter(function (z) { return z >= d.min && z <= d.max; }); if (cands.length) n.list = [Math.min.apply(null, cands)]; }
          for (var a = 0; a < n.list.length; a++) {
            var v = d.conv ? d.conv(n.list[a], line) : n.list[a];
            if (v == null || v < d.min || v > d.max) continue;
            if (v === 0 && !d.zeroOk) continue;
            if (d.level) { put(k, v > (n.ref && n.ref[1] > v * 0.2 ? n.ref[1] : d.level) ? 'h' : 'n', i, { weak: weak }); found[k].num = v; return true; }
            put(k, Math.round(v * 100) / 100, i, { weak: weak });
            if (n.ref && found[k] && found[k].ref == null) found[k].ref = n.ref; else if (n.lt != null && n.lt !== v && found[k] && found[k].ref == null) found[k].ref = [null, n.lt];
            if (n.ref && n.ref[1] > 0 && Math.round(v) === v && (v > n.ref[1] * 3 || v < n.ref[0] / 3) && v / 10 >= n.ref[0] * 0.5 && v / 10 <= n.ref[1] * 2) found[k].ocrOdd = true;
            if (d.unit) found[k + 'U'] = { v: d.unit(line, v), src: lines[i] };
            return true;
          }
          // A photo can drop the decimal point (4.20 read as 420). When the
          // first number is impossible but /10 or /100 is plausible, use that
          // and mark it less certain.
          if (popt.ocr && n.list.length && !d.level && Math.round(n.list[0]) === n.list[0]) {
            for (var dv = 10; dv <= 100; dv *= 10) {
              var v2 = d.conv ? d.conv(n.list[0] / dv, line) : n.list[0] / dv;
              if (v2 != null && v2 >= d.min && v2 <= d.max) { put(k, Math.round(v2 * 100) / 100, i, { weak: true }); found[k].fixed = n.list[0]; return true; }
            }
          }
          return n.list.length > 0;
        };
        if (!tryLine(rest, l, false) && !d.before && low[i + 1] && !/[a-z]{4,}/.test(low[i + 1].replace(/(mg|g|dl|ul|cumm|lakhs?|cells|mill|fl|pg|ng|ml|iu|mmol|umol|per|hpf)/g, ''))) {
          tryLine(low[i + 1], low[i + 1], true);
        }
      }
    });

    if (keys.indexOf('age') >= 0 || keys.indexOf('sex') >= 0) ageSex(low, lines, found);
    if (keys.indexOf('dob') >= 0) {
      for (var di = 0; di < low.length && !found.dob; di++) {
        var dm = /\bdob\b|d\.o\.b|date\s*of\s*birth|\bborn\s*(?:on)?\b|birth\s*date/.exec(low[di]);
        if (!dm) continue;
        var dd = dateIn(low[di].slice(dm.index), true, popt.now) || dateIn(low[di], true, popt.now);
        if (dd) found.dob = { v: dayKey(dd), src: lines[di] };
      }
    }
    if (keys.indexOf('tMal') >= 0) malaria(low, lines, found);
    if (keys.indexOf('tBC') >= 0) culture(low, lines, found);
    if (keys.indexOf('pus') >= 0) pus(low, lines, found);
    Object.keys(SMEAR).forEach(function (k) { if (keys.indexOf(k) >= 0) smear(k, low, lines, found); });
    return found;
  }

  function ageSex(low, lines, found) {
    for (var i = 0; i < low.length; i++) {
      var l = low[i];
      if (found.age == null) {
        var m = /\bage\b[^0-9\n]{0,25}?(\d{1,3}(?:\.\d+)?)\s*(y|yrs?|years?|mons?|months?|days?)?\b/.exec(l);
        if (m) {
          var a = +m[1], u = m[2] || 'y';
          if (/^mon/.test(u)) a = Math.round(a / 12 * 100) / 100; else if (/^day/.test(u)) a = Math.round(a / 365 * 100) / 100;
          if (a > 0 && a <= 110) found.age = { v: a, src: lines[i] };
        }
      }
      if (found.sex == null) {
        var s = /\b(?:sex|gender)\b[^a-z0-9]{0,6}(?:\d+(?:\.\d+)?\s*(?:y|yrs?|years?)?\s*[\/,-]?\s*)?(male|female|m|f)\b/.exec(l) ||
                /\bage\b.{0,30}?\d+\s*(?:y|yrs?|years?)\s*[\/,-]\s*(male|female|m|f)\b/.exec(l);
        if (s) found.sex = { v: s[1].charAt(0) === 'f' ? 'f' : 'm', src: lines[i] };
      }
    }
    if (found.sex == null) {
      for (var j = 0; j < low.length; j++) {
        if (!/name|patient/.test(low[j])) continue;
        var t = /\b(mrs|ms|miss|smt|mr|master)\b\.?/.exec(low[j]);
        if (t) { found.sex = { v: /^(mrs|ms|miss|smt)$/.test(t[1]) ? 'f' : 'm', src: lines[j], weak: true }; break; }
      }
    }
  }

  function malaria(low, lines, found) {
    for (var i = 0; i < low.length && found.tMal == null; i++) {
      var l = low[i];
      if (!/malaria|plasmodium|\bmp\b|ha?emoparasite|\bparasites?\b|falciparum|vivax|\bqbc\b|\bpf\b|\bpv\b/.test(l)) continue;
      if (/weil|widal|typh/.test(l) || (l.length > 70 && PROSE.test(l))) continue;
      var r = species(l);
      if (r == null && low[i + 1] && !/malaria|plasmodium|parasite/.test(low[i + 1])) r = species(l + ' ' + low[i + 1]);
      if (r) found.tMal = { v: r, src: lines[i] };
    }
  }
  function species(s) {
    var sp = [], re = /(falciparum|vivax|\bp\.?\s*f\b|\bp\.?\s*v\b|\bpf\b|\bpv\b)/g, m;
    while ((m = re.exec(s))) sp.push({ i: m.index, k: (m[1].indexOf('falc') >= 0 || /f$/.test(m[1].replace(/\W/g, ''))) ? 'pf' : 'pv' });
    if (sp.length) {
      var pos = [];
      sp.forEach(function (o, j) { var end = j + 1 < sp.length ? sp[j + 1].i : s.length; if (qual(s.slice(o.i, end)) === 'p') pos.push(o.k); });
      if (pos.indexOf('pf') >= 0) return 'pf';
      if (pos.indexOf('pv') >= 0) return 'pv';
      return qual(s) === 'n' ? 'n' : null;
    }
    return qual(s) === 'n' ? 'n' : null;
  }

  function culture(low, lines, found) {
    for (var i = 0; i < low.length; i++) {
      var l = low[i];
      if (!/blood\s*culture|blood\s*c\s*\/\s*s|bact\s*\/?\s*alert/.test(l) || /urine|stool|sputum|\bpus\b|swab|\bcsf\b|fluid/.test(l)) continue;
      var seg = [l, low[i + 1] || '', low[i + 2] || '', low[i + 3] || ''].join(' ');
      var v = /typhi|paratyphi|salmonella/.test(seg) ? 'st' : /no\s*growth|sterile|no\s*organism/.test(seg) ? 'n' :
              /awaited|pending|in\s*process|under\s*process|incubat/.test(seg) ? 'w' : /growth of|isolated|grown|organism\s*(?:isolated)?\s*:\s*[a-z]/.test(seg) ? 'o' : null;
      if (v) { found.tBC = { v: v, src: lines[i] }; return; }
    }
  }

  function pus(low, lines, found) {
    for (var i = 0; i < low.length; i++) {
      var m = /pus\s*cells?|\bwbcs?\s*\/\s*hpf|leu[ck]ocytes?\s*\/\s*hpf/.exec(low[i]);
      if (!m) continue;
      var r = low[i].slice(m.index + m[0].length), v = null;
      if (/plenty|numerous|loaded|full\s*field|packed|\bmany\b|tntc|too numerous/.test(r)) v = 50;
      else if (/\bnil\b|absent|not seen|\bnone\b/.test(r)) v = 0;
      else if (/occasional|\bocc\b|\brare\b/.test(r)) v = 1;
      else { var a = /(\d+)\s*(?:-|to)\s*(\d+)/.exec(r); if (a) v = +a[2]; else { a = /(\d+)/.exec(r); if (a && +a[1] <= 200) v = +a[1]; } }
      if (v != null) { found.pus = { v: v, src: lines[i] }; return; }
    }
  }

  function smear(k, low, lines, found) {
    for (var i = 0; i < low.length; i++) {
      var sents = low[i].split(/[.;]/);
      for (var s = 0; s < sents.length; s++) {
        var t = sents[s];
        if (!SMEAR[k].test(t)) continue;
        if (t.length > 140 || /\bmay\b|\bcan\b|seen in\b|associated with|\bif\b|such as|e\.g\./.test(t)) continue;
        if (/\bno\b|not seen|not detected|absent|\bnil\b|negative|none seen|without/.test(t)) continue;
        if (k === 'smHypo' && /normocyt|normochrom/.test(t) && !/microcyt|hypochrom/.test(t)) continue;
        found[k] = { v: true, src: lines[i] };
        return;
      }
    }
  }

  /* ---------- report dates ---------- */
  var MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
  // First date in a line. Indian order (day first). Two-digit years only when
  // the line names a date, so "11.6-14.0" in a result row is never a date.
  function dateIn(s, shortOk, now) {
    var re = /(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4}|\d{2})(?!\d)|(\d{1,2})(?:st|nd|rd|th)?[\s\-\/]*(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*[\s\-\/,']*(\d{4}|\d{2})(?!\d)|(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})(?!\d)/g, m;
    while ((m = re.exec(s))) {
      var d, mo, y, yl;
      if (m[1]) { d = +m[1]; mo = +m[2]; y = +m[3]; yl = m[3].length; if (mo > 12 && d <= 12) { var t = d; d = mo; mo = t; } }
      else if (m[4]) { d = +m[4]; mo = MON[m[5]]; y = +m[6]; yl = m[6].length; }
      else { y = +m[7]; mo = +m[8]; d = +m[9]; yl = 4; }
      if (yl === 2) { if (!shortOk) continue; y += 2000; }
      if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 2010) continue;
      var dt = new Date(y, mo - 1, d);
      if (dt.getTime() > (now || Date.now()) + 2 * 864e5) continue;
      return dt;
    }
    return null;
  }
  // The date the sample was taken, else registered, else reported.
  function findDate(rawLines, now) {
    var best = null, rank = 9;
    rawLines.forEach(function (raw) {
      var l = norm(raw).toLowerCase();
      if (/birth|\bdob\b|d\.o\.b|expir|valid till|\bexp\b/.test(l)) return;
      var K = [/collect|sample\s*(?:date|drawn|taken|coll)|\bdrawn\b|specimen\s*date/, /regist|receiv|booking|\bbill|visit date|\bvisit\b/, /report(?:ed)?\s*(?:date|on|:)|authori[sz]|approved|released|printed/, /\bdate\b|\bdt\b|\bdated\b/];
      for (var r = 0; r < K.length; r++) {
        var m = K[r].exec(l);
        if (!m || r + 1 >= rank) continue;
        var d = dateIn(l.slice(m.index), true, now) || dateIn(l, true, now);
        if (d) { best = { d: d, src: norm(raw) }; rank = r + 1; }
        break;
      }
      if (rank === 9) { var d2 = dateIn(l, false, now); if (d2 && !best) best = { d: d2, src: norm(raw), loose: true }; }
    });
    return best;
  }
  function dayKey(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fmtDay(d) {
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + M[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
  }

  // Group the pages into one set per report date, read each set, and merge:
  // the newest report wins for each test, older reports fill what it lacks,
  // and undated pages only fill what no dated report has.
  function combine(chunks, keys, now) {
    var byFile = {};
    chunks.forEach(function (c) { (byFile[c.fid] = byFile[c.fid] || []).push(c); });
    Object.keys(byFile).forEach(function (fid) {
      var pages = byFile[fid], last = null, first = null;
      pages.forEach(function (c) { c.dt = findDate(c.lines, now); if (c.dt && !first) first = c.dt; });
      pages.forEach(function (c) { if (c.dt) last = c.dt; else if (last) c.dt = { d: last.d, src: last.src, carried: true }; else if (first) c.dt = { d: first.d, src: first.src, carried: true }; });
    });
    var sets = {}, order = [];
    chunks.forEach(function (c) {
      var key = c.dt ? dayKey(c.dt.d) : 'nodate:' + c.fid;
      if (!sets[key]) { sets[key] = { key: key, date: c.dt ? c.dt.d : null, dsrc: c.dt ? c.dt.src : null, lines: [], ocr: false, names: [] }; order.push(key); }
      var S = sets[key];
      S.lines.push.apply(S.lines, c.lines); S.ocr = S.ocr || c.ocr;
      if (S.names.indexOf(c.name) < 0) S.names.push(c.name);
    });
    var list = order.map(function (k) { return sets[k]; });
    list.sort(function (a, b) { if (a.date && b.date) return b.date - a.date; return a.date ? -1 : b.date ? 1 : 0; });
    var merged = {}, hist = {};
    list.forEach(function (S) {
      S.found = parse(S.lines, keys, { ocr: S.ocr });
      Object.keys(S.found).forEach(function (k) {
        var f = S.found[k];
        if (S.date) (hist[k] = hist[k] || []).push({ d: S.date, v: f.v, f: f });
        if (!merged[k]) { f.date = S.date; f.set = S; merged[k] = f; }
      });
    });
    Object.keys(hist).forEach(function (k) { hist[k].sort(function (a, b) { return a.d - b.d; }); });
    var dated = list.filter(function (S) { return S.date; }).sort(function (a, b) { return a.date - b.date; });
    return { found: merged, hist: hist, dated: dated, undated: list.filter(function (S) { return !S.date; }), any: list };
  }

  /* ---------- reading files ---------- */
  var pdfjsP = null, workerP = null, onProg = null;
  var OCR = { psm: '6', target: 3200, stretch: true };
  var lowConf = {};   // normalised line text -> true when a number on it was read with low confidence

  // Grey, stretch the contrast and enlarge, so small decimal points survive.
  function prep(src) {
    var w = src.width, h = src.height, big = Math.max(w, h);
    var sc = big < OCR.target ? OCR.target / big : (big > 3800 ? 3800 / big : 1);
    var c = document.createElement('canvas'); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
    var x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(src, 0, 0, c.width, c.height);
    if (!OCR.stretch) return c;
    var d = x.getImageData(0, 0, c.width, c.height), p = d.data, n = p.length / 4, hist = new Uint32Array(256), i, g;
    for (i = 0; i < n; i++) { g = (p[4 * i] * 0.299 + p[4 * i + 1] * 0.587 + p[4 * i + 2] * 0.114) | 0; p[4 * i] = g; hist[g]++; }
    var lo = 0, hi = 255, acc = 0;
    for (i = 0; i < 256; i++) { acc += hist[i]; if (acc > n * 0.01) { lo = i; break; } }
    acc = 0; for (i = 255; i >= 0; i--) { acc += hist[i]; if (acc > n * 0.02) { hi = i; break; } }
    var span = Math.max(1, hi - lo);
    for (i = 0; i < n; i++) { g = Math.max(0, Math.min(255, ((p[4 * i] - lo) * 255 / span) | 0)); p[4 * i] = p[4 * i + 1] = p[4 * i + 2] = g; }
    x.putImageData(d, 0, 0);
    return c;
  }
  function loadPdf() {
    if (!pdfjsP) pdfjsP = import(V + 'pdfjs/pdf.min.js').then(function (m) { m.GlobalWorkerOptions.workerSrc = V + 'pdfjs/pdf.worker.min.js'; return m; });
    return pdfjsP;
  }
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load ' + src)); }; document.head.appendChild(s); });
  }
  function getWorker() {
    if (!workerP) {
      workerP = (window.Tesseract ? Promise.resolve() : loadScript(V + 'tesseract/tesseract.min.js')).then(function () {
        return window.Tesseract.createWorker('eng', 1, {
          workerPath: V + 'tesseract/worker.min.js', corePath: V + 'tesseract/', langPath: V + 'tesseract/lang',
          gzip: false, workerBlobURL: false, cacheMethod: 'none',
          logger: function (m) { if (onProg && m.status === 'recognizing text') onProg(m.progress); }
        });
      }).then(function (w) { return w.setParameters({ tessedit_pageseg_mode: OCR.psm, preserve_interword_spaces: '1' }).then(function () { return w; }); });
      workerP.catch(function () { workerP = null; });
    }
    return workerP;
  }

  function pdfLines(page) {
    return page.getTextContent().then(function (tc) {
      var items = tc.items.filter(function (it) { return it.str && it.str.trim(); }).map(function (it) {
        return { x: it.transform[4], y: it.transform[5], h: Math.abs(it.transform[3]) || Math.abs(it.transform[0]) || 8, w: it.width || 0, s: it.str };
      });
      items.sort(function (a, b) { return b.y - a.y || a.x - b.x; });
      var rows = [];
      items.forEach(function (it) {
        var L = rows.length ? rows[rows.length - 1] : null;
        if (L && Math.abs(L.y - it.y) <= Math.max(2, Math.min(L.h, it.h) * 0.55)) L.items.push(it);
        else rows.push({ y: it.y, h: it.h, items: [it] });
      });
      return rows.map(function (L) {
        L.items.sort(function (a, b) { return a.x - b.x; });
        var out = '', end = null;
        L.items.forEach(function (it) {
          if (end != null) { var gap = it.x - end; out += gap > it.h * 1.2 ? '   ' : (gap > it.h * 0.12 ? ' ' : ''); }
          out += it.s; end = it.x + it.w;
        });
        return out;
      });
    });
  }

  function ocr(canvas, status, label) {
    status('Reading the picture of ' + label + '. On a phone this can take up to a minute.');
    onProg = function (p) { status('Reading the picture of ' + label + ': ' + Math.round(p * 100) + '%'); };
    var c = prep(canvas);
    return getWorker().then(function (w) { return w.recognize(c); }).then(function (r) {
      onProg = null;
      var d = r.data, out = [];
      if (d.lines && d.lines.length) {
        d.lines.forEach(function (L) {
          var t = (L.text || '').replace(/\n/g, ' ');
          out.push(t);
          var shaky = (L.words || []).some(function (w) { return /\d/.test(w.text) && w.confidence < 70; });
          if (shaky) lowConf[norm(t).toLowerCase()] = true;
        });
      } else out = d.text.split('\n');
      out.ocr = true;
      return out;
    });
  }

  function readPdf(file, status, password) {
    return loadPdf().then(function (pdfjs) {
      return file.arrayBuffer().then(function (buf) {
        return pdfjs.getDocument({ data: new Uint8Array(buf), password: password || undefined, isEvalSupported: false }).promise;
      });
    }).then(function (doc) {
      var n = Math.min(doc.numPages, 12), out = [], i = 0, scans = 0;
      function next() {
        if (++i > n) return out;
        status('Reading ' + file.name + ', page ' + i + ' of ' + n);
        return doc.getPage(i).then(function (pg) {
          return pdfLines(pg).then(function (lines) {
            if (lines.join('').replace(/\s/g, '').length >= 40 || scans >= 6) { out.push({ lines: lines, ocr: false }); return next(); }
            scans++;
            var v1 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: Math.min(5, OCR.target / Math.max(v1.width, v1.height)) }), c = document.createElement('canvas');
            c.width = Math.round(vp.width); c.height = Math.round(vp.height);
            return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise
              .then(function () { return ocr(c, status, 'page ' + i); })
              .then(function (l) { out.push({ lines: l, ocr: true }); return next(); });
          });
        });
      }
      return next();
    });
  }

  function readImage(file, status) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('This picture could not be opened. Try a JPG or PNG.')); };
      im.src = url;
    }).then(function (im) {
      var w = im.naturalWidth, h = im.naturalHeight, big = Math.max(w, h);
      var sc = big > 4000 ? 4000 / big : 1;
      var c = document.createElement('canvas'); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(im.src);
      return ocr(c, status, file.name).then(function (l) { return [{ lines: l, ocr: true }]; });
    });
  }

  /* ---------- the panel on the page ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // The panel carries its own styles, so it looks the same on every page and
  // site. Colours fall back to the Caspian blue when the page defines no tokens.
  var CSS = '.rr{--rrp:var(--primary,#0b6fc2);--rrn:var(--navy,#041e42);--rrm:var(--muted,#5b6b7c);--rrl:var(--line,#dbe3ec);--rrt:var(--tint,#f4f9ff);font-size:16px;line-height:1.55;color:var(--ink,#1b2b3a);border:2px dashed #9fc3e8;background:var(--rrt);border-radius:14px;padding:18px;margin:16px 0}' +
    '.rr *{box-sizing:border-box}.rr p{margin:0 0 8px}.rr h3{font-size:1.02rem;color:var(--rrn);margin:14px 0 6px}.rr .rr-t{font-weight:700;color:var(--rrn);margin:0 0 4px}.rr .rr-note{font-size:.88rem;color:var(--rrm)}' +
    '.rr .rr-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 20px;border-radius:8px;font-weight:600;background:var(--rrp);color:#fff;border:0;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}' +
    '.rr .rr-btn.rr-ghost{background:#fff;color:var(--rrp);border:1px solid var(--rrp)}.rr .rr-row{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}.rr label.rr-btn:focus-within{outline:3px solid rgba(11,111,194,.35);outline-offset:2px}' +
    '.rr .rr-vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;padding:0;margin:-1px}' +
    '.rr .rr-msg{border-radius:10px;padding:10px 14px;margin:8px 0;font-size:.95rem}.rr .rr-msg p{margin:0 0 4px}.rr .rr-msg p:last-child{margin:0}' +
    '.rr .rr-ok{background:#eaf7ef;color:#14532d;border-left:4px solid #1d7a46}.rr .rr-warn{background:#fff6e5;color:#6b3f00;border-left:4px solid #e0a100}.rr .rr-bad{background:#fdecea;color:#7f1d1d;border-left:4px solid #b3261e}.rr .rr-info{background:#fff;color:var(--rrn);border-left:4px solid var(--rrp)}' +
    '.rr .rr-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.rr .rr-chips span{background:#fff;border:1px solid var(--rrl);border-radius:999px;padding:3px 10px;font-size:.88rem}.rr .rr-chips span.rr-weak{border-color:#e0a100;border-style:dashed}.rr .rr-chips small{color:var(--rrm)}' +
    '.rr details{border:1px solid var(--rrl);border-radius:10px;padding:10px 14px;margin:10px 0;background:#fff}.rr details summary{cursor:pointer;font-weight:600;color:var(--rrn)}.rr ul{padding-left:20px;margin:6px 0}.rr li{margin-bottom:4px}' +
    '.rr .rr-in{width:100%;min-height:44px;padding:9px 11px;border:1px solid #b9c6d4;border-radius:8px;font:inherit;background:#fff}.rr .rr-inrow{display:flex;gap:8px}.rr .rr-inrow .rr-in{flex:1 1 auto;min-width:0}' +
    '.rr .rr-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.rr table{width:100%;border-collapse:collapse;margin-top:8px;font-size:.93rem;background:#fff}.rr th{text-align:left;background:var(--rrt);color:var(--rrn);font-size:.7rem;letter-spacing:1.1px;text-transform:uppercase;padding:9px 10px;border-bottom:1px solid var(--rrl)}.rr td{padding:9px 10px;border-bottom:1px solid #eef3f8;vertical-align:top}.rr td.rr-num{font-weight:700;color:var(--rrp);white-space:nowrap}' +
    '.rr .rr-hidden{display:none!important}' +
    'input.fromrep,select.fromrep,textarea.fromrep{background:#fff8d6!important;border-color:#e0a100!important}label.fromrep{background:#fff8d6;border-radius:6px;box-shadow:0 0 0 2px #f2c230}' +
    '@media(max-width:640px){.rr{padding:14px}.rr .rr-btn{width:100%}}@media print{.rr{display:none}}';
  function style() {
    if (document.getElementById('rr-style')) return;
    var st = document.createElement('style'); st.id = 'rr-style'; st.textContent = CSS; document.head.appendChild(st);
  }

  // Values handed over from another page (the labs site, for example) in the
  // URL hash: #rr=<base64 json>. The hash never reaches a server.
  function readHash() {
    var m = /(?:^|[#&])rr=([A-Za-z0-9+\/=_-]+)/.exec(location.hash || '');
    if (!m) return null;
    try {
      var j = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/')))));
      if (j && typeof j === 'object') return j;
    } catch (e) {}
    return null;
  }
  function encode(found, keys) {
    var o = {};
    (keys || Object.keys(found)).forEach(function (k) { var f = found[k]; if (f && f.v != null) o[k] = { v: f.v, s: (f.src || '').slice(0, 120), d: f.date ? dayKey(f.date) : undefined }; });
    return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function attach(opt) {
    var root = typeof opt.mount === 'string' ? document.querySelector(opt.mount) : opt.mount;
    if (!root) return;
    style();
    var fields = opt.fields || {};
    var keys = Object.keys(fields);
    (opt.keys || []).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
    var title = opt.title || 'Have the report? Let this page fill it in';
    var intro = opt.intro || 'Choose the lab’s PDF, or a clear photo of each page. You can pick more than one file. The report is read on this phone or computer and is <strong>not uploaded anywhere</strong>.';
    root.innerHTML =
      '<div class="rr">' +
      '<p class="rr-t">' + title + '</p>' +
      '<p class="rr-note" style="margin-bottom:10px">' + intro + '</p>' +
      '<div class="rr-row" style="margin-top:0"><label class="rr-btn"><input type="file" class="rr-vh rr-file" accept="application/pdf,image/*" multiple /> ' + (opt.button || 'Upload report (PDF or photo)') + '</label></div>' +
      '<div class="rr-pw rr-hidden" style="margin-top:12px"><p class="rr-t">This PDF has a password</p><p class="rr-note">Labs often use the patient’s date of birth or mobile number. Check the lab’s message.</p><div class="rr-inrow"><input type="text" class="rr-in rr-pwin" autocomplete="off" /><button class="rr-btn" type="button">Open</button></div></div>' +
      '<div class="rr-status rr-msg rr-info rr-hidden" aria-live="polite"></div>' +
      '<div class="rr-out"></div></div>';
    var fileIn = root.querySelector('.rr-file'), st = root.querySelector('.rr-status'), out = root.querySelector('.rr-out'), pwBox = root.querySelector('.rr-pw');
    function status(t) { st.classList.remove('rr-hidden'); st.innerHTML = '<p>' + esc(t) + '</p>'; }
    function label(k) { return (opt.labels && opt.labels[k]) || k; }
    function shown(k, v) { return v === true ? 'seen' : (opt.show && opt.show[k] && opt.show[k][v]) || v; }

    var chunks = [], fidSeq = 0;
    function run(files, pw) {
      var notes = [], i = 0, added = [];
      lowConf = {};
      out.innerHTML = ''; pwBox.classList.add('rr-hidden');
      function next() {
        if (i >= files.length) return Promise.resolve();
        var f = files[i++];
        var isPdf = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name);
        var isImg = /^image\//.test(f.type) || /\.(jpe?g|png|webp|bmp|gif|heic)$/i.test(f.name);
        if (!isPdf && !isImg) { notes.push(f.name + ' is not a PDF or a picture.'); return next(); }
        var fid = ++fidSeq;
        var p = isPdf ? readPdf(f, status, pw) : readImage(f, status);
        return p.then(function (pages) {
          pages.forEach(function (pg, n) { added.push({ fid: fid, name: f.name + (pages.length > 1 ? ' p' + (n + 1) : ''), lines: pg.lines, ocr: pg.ocr }); });
          return next();
        }, function (e) {
          if (e && e.name === 'PasswordException') {
            pwBox.classList.remove('rr-hidden');
            var b = pwBox.querySelector('button'), inp = pwBox.querySelector('input');
            if (e.code === 2) notes.push('That password did not open ' + f.name + '.');
            b.onclick = function () { run(files.slice(i - 1), inp.value.trim()); };
            inp.focus();
            chunks.push.apply(chunks, added); added = [];
            throw { stop: true };
          }
          notes.push('Could not read ' + f.name + (e && e.message ? ' (' + e.message + ')' : '') + '.');
          return next();
        });
      }
      status('Getting the reader ready');
      next().then(function () {
        st.classList.add('rr-hidden');
        chunks.push.apply(chunks, added);
        var C = combine(chunks, keys.concat(opt.extra || []));
        api.lastLines = chunks.reduce(function (a, c) { return a.concat(c.lines); }, []);
        api.lastCombine = C;
        var usedOcr = false;
        Object.keys(C.found).forEach(function (k) {
          var f = C.found[k]; if (!f || !f.src) return;
          if (f.set && f.set.ocr) { usedOcr = true; if (lowConf[norm(f.src).toLowerCase()] && typeof f.v === 'number') f.weak = true; if (f.ocrOdd) f.weak = true; }
        });
        fill(C.found, notes, api.lastLines.length, usedOcr, C);
      }, function (e) {
        if (e && e.stop) { st.classList.add('rr-hidden'); if (notes.length) out.innerHTML = '<div class="rr-msg rr-warn"><p>' + notes.map(esc).join(' ') + '</p></div>'; return; }
        status('Something went wrong while reading. Please type the numbers in.');
      });
    }

    var orig = [];   // each box as it was before the first upload, for Undo
    function remember(el, check) { if (el && !orig.some(function (o) { return o.el === el; })) orig.push({ el: el, check: check, val: check ? el.checked : el.value }); }
    function poke(el) { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
    // Put one read value into its target. Returns true when something was set.
    function setTarget(t, f) {
      if (!t || f == null) return false;
      var el, v = f.v;
      if (typeof t === 'string') t = { id: t };
      if (t.when && !f.whenOk) return false;
      if (t.map) { if (!(String(v) in t.map)) return false; v = t.map[String(v)]; }
      if (t['const'] != null) v = t['const'];
      if (t.radio) {
        el = document.querySelector('input[name="' + t.radio + '"][value="' + v + '"]');
        if (!el) return false;
        document.querySelectorAll('input[name="' + t.radio + '"]').forEach(function (r) { remember(r, true); });
        el.checked = true; mark(el.closest('label') || el); poke(el); return true;
      }
      if (t.check) {
        el = document.getElementById(t.check); if (!el || v !== true) return false;
        remember(el, true); el.checked = true; mark(el.closest('label') || el); poke(el); return true;
      }
      el = document.getElementById(t.id); if (!el) return false;
      if (t.transform) v = t.transform(v, f);
      if (v == null) return false;
      v = String(v);
      if (el.tagName === 'SELECT' && !el.querySelector('option[value="' + v.replace(/"/g, '') + '"]')) return false;
      remember(el, false); el.value = v; mark(el); poke(el); return true;
    }
    function fill(found, notes, nLines, usedOcr, C) {
      if (opt.derive) opt.derive(found);
      var done = [], missing = [];
      var multi = C && C.dated.length > 1, newest = multi ? C.dated[C.dated.length - 1].date : null;
      var dated = function (k) { return k !== 'age' && k !== 'sex' && !/U$/.test(k); };
      keys.forEach(function (k) {
        var t = fields[k], f = found[k];
        if (!f) { if (opt.labels && opt.labels[k] && !/^sm/.test(k) && !/U$/.test(k) && t && typeof t !== 'object') missing.push(label(k)); return; }
        var ok = t ? setTarget(t, f) : true;
        if (ok) done.push({ k: k, f: f });
      });
      // Units and other companions: {id, const|map, when:'key'} entries keyed by any name.
      Object.keys(fields).forEach(function (k) {
        var t = fields[k]; if (!t || typeof t !== 'object' || !t.when) return;
        var src = found[t.when]; if (!src) return;
        var f2 = found[k] || { v: src.v, src: src.src, whenOk: true }; f2.whenOk = true;
        setTarget(t, f2);
      });
      // Earlier value of a test into the tool's "previous" box (for example Previous Hb).
      var prevDone = [];
      if (opt.prev && C) Object.keys(opt.prev).forEach(function (k) {
        var f = found[k], H = C.hist[k], el = document.getElementById(opt.prev[k]);
        if (!f || !f.date || !H || !el) return;
        var older = H.filter(function (h) { return h.d < f.date && typeof h.v === 'number'; });
        if (!older.length) return;
        var o = older[older.length - 1];
        remember(el, false); el.value = String(o.v); mark(el); poke(el);
        prevDone.push({ k: k, v: o.v, d: o.d, src: o.f.src });
      });
      if (opt.onFound) { try { opt.onFound(found, C, done); } catch (e) {} }
      var h = '';
      if (!done.length) {
        h += '<div class="rr-msg rr-warn"><p><strong>No values could be read from this report.</strong> ' + (nLines < 5 ? 'Very little text was found. ' : '') + 'For a photo: one page per photo, taken straight on, in good light, with the whole page in view.' + (opt.keysOnly ? '' : ' Or type the numbers in below.') + '</p></div>';
      } else {
        h += '<div class="rr-msg rr-ok"><p><strong>' + (opt.keysOnly ? 'Read ' : 'Filled ') + done.length + ' value' + (done.length > 1 ? 's' : '') + ' from your report.</strong> ' + (opt.keysOnly ? 'Please check each one against the report.' : 'The boxes it filled are highlighted in yellow. Please check each one against the report before reading the result. Correct any box by typing over it.') + '</p></div>';
        var weak = done.filter(function (d) { return d.f.weak; });
        if (multi) {
          var older2 = done.filter(function (d) { return dated(d.k) && d.f.date && d.f.date < newest; });
          h += '<div class="rr-msg rr-info"><p><strong>Reports from ' + C.dated.map(function (S) { return fmtDay(S.date); }).join(', ') + '.</strong> Each value is the newest result for that test (' + fmtDay(newest) + ').' +
            (prevDone.length ? ' The earlier ' + prevDone.map(function (p) { return esc(label(p.k) + ' (' + p.v + ', ' + fmtDay(p.d) + ')'); }).join(' and ') + ' went into the box for the previous result.' : '') +
            (older2.length ? ' From an older report because the newest did not have it: ' + older2.map(function (d) { return esc(label(d.k) + ' (' + fmtDay(d.f.date) + ')'); }).join(', ') + '.' : '') + '</p></div>';
        } else if (C && C.dated.length === 1) {
          h += '<p class="rr-note">Report date: ' + fmtDay(C.dated[0].date) + '.</p>';
        }
        if (C && C.undated.length && C.dated.length) h += '<div class="rr-msg rr-warn"><p>No date found on ' + C.undated.map(function (S) { return esc(S.names.join(', ')); }).join('; ') + '. Its values were used only where the dated reports had none.</p></div>';
        if (multi && opt.trend) opt.trend(C.hist).forEach(function (t) { h += '<div class="rr-msg rr-' + t[0] + '"><p>' + t[1] + '</p></div>'; });
        if (usedOcr) h += '<div class="rr-msg rr-warn"><p><strong>Read from a picture.</strong> A photo can lose a decimal point (8.2 read as 82) or change a digit. Check every number against the report' + (weak.length ? ', starting with: ' + weak.map(function (d) { return esc(label(d.k) + ' ' + d.f.v); }).join(', ') : '') + '.</p></div>';
        else if (weak.length) h += '<div class="rr-msg rr-warn"><p>Less certain, check first: ' + weak.map(function (d) { return esc(label(d.k) + ' ' + d.f.v); }).join(', ') + '.</p></div>';
        h += '<p class="rr-chips">' + done.map(function (d) {
          return '<span' + (d.f.weak ? ' class="rr-weak" title="Less certain: check this one"' : '') + '>' + esc(label(d.k)) + ': <strong>' + esc(shown(d.k, d.f.v)) + '</strong>' + (multi && d.f.date && dated(d.k) ? ' <small>' + fmtDay(d.f.date) + '</small>' : '') + '</span>';
        }).join('') + prevDone.map(function (p) { return '<span>' + esc(label(p.k) + ', previous') + ': <strong>' + esc(p.v) + '</strong> <small>' + fmtDay(p.d) + '</small></span>'; }).join('') + '</p>';
        if (multi) {
          var tk = keys.filter(function (k) { return dated(k) && C.hist[k] && C.hist[k].length > 1; });
          if (tk.length) {
            var cols = C.dated.slice(-6);
            h += '<h3>Results by date</h3><div class="rr-scroll"><table><thead><tr><th>Test</th>' + cols.map(function (S) { return '<th>' + fmtDay(S.date) + '</th>'; }).join('') + '</tr></thead><tbody>' +
              tk.map(function (k) {
                return '<tr><td><strong>' + esc(label(k)) + '</strong></td>' + cols.map(function (S, ci) {
                  var e = C.hist[k].filter(function (x) { return x.d.getTime() === S.date.getTime(); })[0];
                  var v = e ? e.v : null, sh = v == null ? '–' : shown(k, v);
                  return '<td' + (ci === cols.length - 1 ? ' class="rr-num"' : '') + '>' + esc(sh) + '</td>';
                }).join('') + '</tr>';
              }).join('') + '</tbody></table></div>';
          }
        }
        h += '<details><summary>Where each value came from</summary><ul>' + done.map(function (d) {
          return '<li><strong>' + esc(label(d.k)) + '</strong>' + (d.f.date ? ' (' + fmtDay(d.f.date) + ')' : '') + ': “' + esc(d.f.src || '') + '”' + (d.f.fixed != null ? ' <em>(read as ' + esc(d.f.fixed) + '; the decimal point was probably missed)</em>' : (d.f.weak ? ' <em>(less certain)</em>' : '')) + (d.f.calc ? ' <em>(' + esc(d.f.calc) + ')</em>' : '') + '</li>';
        }).join('') + prevDone.map(function (p) { return '<li><strong>' + esc(label(p.k) + ', previous') + '</strong> (' + fmtDay(p.d) + '): “' + esc(p.src || '') + '”</li>'; }).join('') +
          (C ? C.dated.map(function (S) { return '<li><em>Date ' + fmtDay(S.date) + ' read from: “' + esc(S.dsrc || '') + '” (' + esc(S.names.join(', ')) + ')</em></li>'; }).join('') : '') + '</ul></details>';
        if (missing.length) h += '<p class="rr-note">Not found in the report: ' + missing.map(esc).join(', ') + '. Add them by hand if you have them.</p>';
        h += '<p class="rr-note">To add another report (an earlier or later date), upload it too: the reports are combined by date.</p>';
        if (!opt.keysOnly) h += '<div class="rr-row"><button class="rr-btn rr-ghost rr-undo" type="button">Undo what the reports filled</button></div>';
      }
      if (opt.note) h += '<p class="rr-note">' + opt.note + '</p>';
      if (notes.length) h += '<div class="rr-msg rr-warn"><p>' + notes.map(esc).join(' ') + '</p></div>';
      out.innerHTML = h;
      var u = out.querySelector('.rr-undo');
      if (u) u.onclick = function () {
        orig.forEach(function (x) { if (!x.el) return; if (x.check) x.el.checked = x.val; else x.el.value = x.val; unmark(x.el.closest && x.el.closest('label')); unmark(x.el); poke(x.el); });
        orig = []; chunks = [];
        document.querySelectorAll('.fromrep').forEach(unmark);
        out.innerHTML = '<div class="rr-msg rr-info"><p>Undone. The boxes are back as they were.</p></div>';
        if (opt.onUndo) opt.onUndo();
      };
      if (opt.scrollTo && done.length) { var tgt = document.querySelector(opt.scrollTo); if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    function mark(el) { if (el) el.classList.add('fromrep'); }
    function unmark(el) { if (el && el.classList) el.classList.remove('fromrep'); }
    document.addEventListener('input', function (e) { if (e.isTrusted && e.target) { unmark(e.target); unmark(e.target.closest && e.target.closest('label')); } }, true);

    fileIn.addEventListener('change', function () {
      var files = [].slice.call(fileIn.files || []);
      if (files.length) run(files);
      fileIn.value = '';
    });

    // Values handed over in the URL hash from another page.
    var hv = readHash();
    if (hv) {
      var found = {}, dates = {};
      Object.keys(hv).forEach(function (k) { var e = hv[k]; if (e && e.v != null) { found[k] = { v: e.v, src: e.s || '', date: e.d ? new Date(e.d) : null }; if (e.d) dates[e.d] = true; } });
      var dl = Object.keys(dates).sort().map(function (d) { return { date: new Date(d), names: ['handed over'], dsrc: 'the page you came from' }; });
      var C0 = { found: found, hist: {}, dated: dl, undated: [], any: dl };
      fill(found, [], 99, false, C0);
      var first = out.querySelector('.rr-ok'); if (first) first.innerHTML = '<p><strong>' + Object.keys(found).length + ' value' + (Object.keys(found).length > 1 ? 's' : '') + ' came across from the report you read on the previous page.</strong> They are highlighted in yellow. Check them, then add anything the report did not have.</p>';
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
    return { run: function (files) { run(files); } };
  }

  var api = { attach: attach, parse: parse, nums: nums, qual: qual, DEF: DEF, OCR: OCR, findDate: findDate, combine: combine, encode: encode, fmtDay: fmtDay, esc: esc, style: style };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else window.ReportReader = api;
})();
