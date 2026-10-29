"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type Enlace = {
  href: string;
  texto: string;
  subenlaces?: Enlace[];
};

type Props = {
  titulo: string;
  enlaces: Enlace[];
  extra?: ReactNode; // algo que va al final del menu (ej: el boton de la solicitud)
};

// Menu superior. Usa estado para abrir/cerrar el menu en celular
// (boton hamburguesa) y para el submenu desplegable.
export default function BarraNavegacion({ titulo, enlaces, extra }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState<string | null>(null);
  const rutaActual = usePathname();

  function cerrarTodo() {
    setMenuAbierto(false);
    setSubmenuAbierto(null);
  }

  function alternarSubmenu(href: string) {
    setSubmenuAbierto(submenuAbierto === href ? null : href);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-ficha shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/" onClick={cerrarTodo}>
          {titulo}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menu-principal"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          id="menu-principal"
          className={"collapse navbar-collapse" + (menuAbierto ? " show" : "")}
        >
          <ul className="navbar-nav ms-auto">
            {enlaces.map((enlace) => {
              if (enlace.subenlaces && enlace.subenlaces.length > 0) {
                const abierto = submenuAbierto === enlace.href;
                const activo = rutaActual.startsWith(enlace.href);
                return (
                  <li className="nav-item dropdown" key={enlace.href}>
                    <button
                      type="button"
                      className={"nav-link dropdown-toggle" + (activo ? " active" : "")}
                      aria-expanded={abierto}
                      onClick={() => alternarSubmenu(enlace.href)}
                    >
                      {enlace.texto}
                    </button>
                    <ul className={"dropdown-menu" + (abierto ? " show" : "")}>
                      {enlace.subenlaces.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={"dropdown-item" + (rutaActual === sub.href ? " active" : "")}
                            onClick={cerrarTodo}
                          >
                            {sub.texto}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              const activo = rutaActual === enlace.href;
              return (
                <li className="nav-item" key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className={"nav-link" + (activo ? " active" : "")}
                    aria-current={activo ? "page" : undefined}
                    onClick={cerrarTodo}
                  >
                    {enlace.texto}
                  </Link>
                </li>
              );
            })}
          </ul>
          {extra && <div className="ms-lg-3 my-2 my-lg-0">{extra}</div>}
        </div>
      </div>
    </nav>
  );
}
