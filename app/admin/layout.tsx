import MenuAdmin, { type EnlaceAdmin } from "@/components/admin/MenuAdmin";

const enlaces: EnlaceAdmin[] = [
  { href: "/admin", texto: "Dashboard" },
  { href: "/admin/fichas", texto: "Fichas" },
  { href: "/admin/solicitudes", texto: "Solicitudes" },
  { href: "/admin/reportes", texto: "Reportes" },
];

// Layout del panel de administracion: menu lateral + contenido
export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  return (
    <div className="d-lg-flex flex-grow-1">
      <MenuAdmin enlaces={enlaces} />
      <main className="flex-grow-1 p-3 p-lg-4 min-w-0">{children}</main>
    </div>
  );
}
