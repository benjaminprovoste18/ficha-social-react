import BarraNavegacion, { type Enlace } from "@/components/BarraNavegacion";
import AvisoDatosFicticios from "@/components/AvisoDatosFicticios";
import EnlaceSolicitud from "@/components/EnlaceSolicitud";
import PiePagina from "@/components/PiePagina";

// Menu de la parte publica (la "tienda").
const enlaces: Enlace[] = [
  { href: "/", texto: "Inicio" },
  { href: "/consultar", texto: "Consultar ficha" },
  {
    href: "/fichas",
    texto: "Fichas",
    subenlaces: [
      { href: "/fichas", texto: "Todas las fichas" },
      { href: "/regiones", texto: "Por región" },
      { href: "/fichas/con-deudas", texto: "Con deudas pendientes" },
    ],
  },
  { href: "/beneficios", texto: "Beneficios" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/admin", texto: "Administración" },
];

export default function LayoutPublico({ children }: LayoutProps<"/">) {
  return (
    <>
      <BarraNavegacion titulo="Ficha Social" enlaces={enlaces} extra={<EnlaceSolicitud />} />
      <AvisoDatosFicticios />
      <main className="container my-4 flex-grow-1">{children}</main>
      <PiePagina texto="Proyecto académico DSY1104 Desarrollo Fullstack II - DuocUC" />
    </>
  );
}
