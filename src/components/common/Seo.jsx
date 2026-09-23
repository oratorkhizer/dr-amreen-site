import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { routeMeta } from "../../data/routes";
import { SITE_URL } from "../../data/site";

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(
      selector.startsWith("link") ? "link" : "meta"
    );

    const match = selector.match(/\[(.+?)="(.+?)"\]/);

    if (match) {
      element.setAttribute(match[1], match[2]);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
};

const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta(pathname);
    const canonical =
      pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;

    document.title = meta.title;

    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", canonical);
  }, [pathname]);

  return null;
};

export default Seo;
