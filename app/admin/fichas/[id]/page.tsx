export const instant = false;
import VistaAdminFicha from "@/components/admin/VistaAdminFicha";

export default async function VerFicha(props: PageProps<"/admin/fichas/[id]">) {
  const { id } = await props.params;
  return (
    <>
      <h1 className="h3">Ficha {decodeURIComponent(id)}</h1>
      <VistaAdminFicha rut={decodeURIComponent(id)} modo="ver" />
    </>
  );
}
