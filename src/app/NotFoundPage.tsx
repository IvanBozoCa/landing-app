import { routes } from "./routes";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return <div className="not-found-page"><main><a className="not-found-brand" href={routes.home}><span aria-hidden="true">IB</span> Iván Bozo Catalán</a><div><p>404 · Página no encontrada</p><h1>Esta dirección no corresponde a una página del sitio.</h1><p>Puede que el enlace haya cambiado o que exista un error en la dirección.</p><nav aria-label="Opciones para continuar"><a href={routes.home}>Volver al portfolio <span aria-hidden="true">→</span></a><a href={routes.contact}>Ir a contacto</a></nav></div></main></div>;
}
