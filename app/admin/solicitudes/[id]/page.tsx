export const instant = false;
import DetalleSolicitudAdmin from "@/components/admin/DetalleSolicitudAdmin";

export default async function VerSolicitud(props: PageProps<"/admin/solicitudes/[id]">) {
  const { id } = await props.params;
  return (
    <>
      <h1 className="h3">Solicitud {id}</h1>
      <DetalleSolicitudAdmin id={id} />
    </>
  );
}
