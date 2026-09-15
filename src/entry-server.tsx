import { renderToString } from "react-dom/server";
import App from "./app/App";
import { routeMetadata } from "./app/routeMetadata";

export { routeMetadata };

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} search="" />);
}
