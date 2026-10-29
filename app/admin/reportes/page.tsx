import ReportesAdmin from "@/components/admin/ReportesAdmin";

export default function Reportes() {
  return (
    <>
      <h1 className="h3">Reportes</h1>
      <p className="text-body-secondary">Totales calculados con los datos guardados en este navegador.</p>
      <ReportesAdmin />
    </>
  );
}
