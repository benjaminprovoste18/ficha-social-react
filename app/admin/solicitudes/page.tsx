import TablaSolicitudes from "@/components/admin/TablaSolicitudes";

export default function AdminSolicitudes() {
  return (
    <>
      <h1 className="h3">Solicitudes de cobro</h1>
      <p className="text-body-secondary">Solicitudes enviadas desde el sitio público.</p>
      <TablaSolicitudes />
    </>
  );
}
