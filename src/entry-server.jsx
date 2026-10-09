// Build-time renderer, used only by scripts/build-routes.mjs (never shipped to
// the browser). Renders one route of the app to an HTML string so each page's
// static file carries its real content, not an empty <div id="root">.
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./App.jsx";

export async function render(path) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(
    new Request(`https://babydocamreen.com${path}`)
  );
  if (context instanceof Response) throw new Error(`redirect for ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StaticRouterProvider router={router} context={context} hydrate={false} />
  );
}
