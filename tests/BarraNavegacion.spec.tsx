import BarraNavegacion, { type Enlace } from "@/components/BarraNavegacion";
import { navegacionFalsa } from "./mocks/next-navigation";
import { hacerClick, renderizar } from "./utils/renderizar";

const enlaces: Enlace[] = [
  { href: "/", texto: "Inicio" },
  { href: "/consultar", texto: "Consultar ficha" },
  {
    href: "/fichas",
    texto: "Fichas",
    subenlaces: [
      { href: "/fichas", texto: "Todas las fichas" },
      { href: "/fichas/con-deudas", texto: "Con deudas pendientes" },
    ],
  },
];

describe("BarraNavegacion", () => {
  beforeEach(() => {
    // mock de usePathname: simulamos que estamos en /consultar
    navegacionFalsa.rutaActual = "/consultar";
  });

  it("muestra el título y un enlace por cada elemento del menú", () => {
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha Social" enlaces={enlaces} />);

    expect(contenedor.querySelector(".navbar-brand")!.textContent).toBe("Ficha Social");
    expect(contenedor.querySelectorAll(".nav-link").length).toBe(3);
    expect(contenedor.querySelectorAll(".dropdown-item").length).toBe(2);
  });

  it("marca como activo el enlace de la ruta actual", () => {
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha Social" enlaces={enlaces} />);
    const activo = contenedor.querySelector(".nav-link.active")!;

    expect(activo.textContent).toBe("Consultar ficha");
    expect(activo.getAttribute("aria-current")).toBe("page");
  });

  it("el botón hamburguesa abre y cierra el menú en celular", () => {
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha Social" enlaces={enlaces} />);
    const boton = contenedor.querySelector(".navbar-toggler")!;
    const menu = contenedor.querySelector("#menu-principal")!;

    expect(menu.classList).not.toContain("show");

    hacerClick(boton);
    expect(menu.classList).toContain("show");
    expect(boton.getAttribute("aria-expanded")).toBe("true");

    hacerClick(boton);
    expect(menu.classList).not.toContain("show");
  });

  it("abre el submenú de Fichas y lo cierra al elegir una opción", () => {
    navegacionFalsa.rutaActual = "/fichas/con-deudas";
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha Social" enlaces={enlaces} />);
    const submenu = contenedor.querySelector(".dropdown-menu")!;

    hacerClick(contenedor.querySelector(".dropdown-toggle"));
    expect(submenu.classList).toContain("show");
    expect(contenedor.querySelector(".dropdown-toggle")!.classList).toContain("active");

    hacerClick(contenedor.querySelectorAll(".dropdown-item")[1]);
    expect(submenu.classList).not.toContain("show");
  });

  it("si el submenú está abierto, un segundo click lo cierra", () => {
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha Social" enlaces={enlaces} />);
    const toggle = contenedor.querySelector(".dropdown-toggle")!;

    hacerClick(toggle);
    hacerClick(toggle);

    expect(contenedor.querySelector(".dropdown-menu")!.classList).not.toContain("show");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});
