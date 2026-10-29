import PanelAdmin from "@/components/admin/PanelAdmin";

export default function Dashboard() {
  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-body-secondary">Resumen de las fichas y solicitudes del sistema.</p>
      <PanelAdmin />
    </>
  );
}
