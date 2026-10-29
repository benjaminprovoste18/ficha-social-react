"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type EnlaceAdmin = {
  href: string;
  texto: string;
};

type Props = {
  enlaces: EnlaceAdmin[];
};

// Menu lateral del panel de administracion.
// En celular se muestra arriba y se abre/cierra con un boton (estado "abierto").
export default function MenuAdmin({ enlaces }: Props) {
  const [abierto, setAbierto] = useState(false);
  const rutaActual = usePathname();

  // "/admin" solo se marca en el dashboard; las demas tambien en sus subpaginas
  function estaActivo(href: string) {
    return href === "/admin" ? rutaActual === href : rutaActual === href || rutaActual.startsWith(href + "/");
  }

  return (
    <aside className="menu-admin bg-dark text-white">
      <div className="d-flex justify-content-between align-items-center p-3">
        <Link href="/admin" className="text-white text-decoration-none fw-bold">
          Ficha Social · Admin
        </Link>
        <button
          type="button"
          className="btn btn-sm btn-outline-light d-lg-none"
          aria-controls="menu-admin"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          Menú
        </button>
      </div>
      <nav id="menu-admin" className={"px-2 pb-3 d-lg-block" + (abierto ? "" : " d-none")}>
        <ul className="nav nav-pills flex-column gap-1">
          {enlaces.map((enlace) => {
            const activo = estaActivo(enlace.href);
            return (
              <li className="nav-item" key={enlace.href}>
                <Link
                  href={enlace.href}
                  className={"nav-link " + (activo ? "active" : "text-white-50")}
                  aria-current={activo ? "page" : undefined}
                  onClick={() => setAbierto(false)}
                >
                  {enlace.texto}
                </Link>
              </li>
            );
          })}
        </ul>
        <hr className="border-secondary" />
        <Link href="/" className="btn btn-sm btn-light w-100">
          Ver sitio público
        </Link>
      </nav>
    </aside>
  );
}
