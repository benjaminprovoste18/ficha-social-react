export const instant = false;
import VistaAdminFicha from "@/components/admin/VistaAdminFicha";

export default async function EditarFicha(props: PageProps<"/admin/fichas/[id]/editar">) {
  const { id } = await props.params;
  return (
    <>
      <h1 className="h3">Editar ficha {decodeURIComponent(id)}</h1>
      <VistaAdminFicha rut={decodeURIComponent(id)} modo="editar" />
    </>
  );
}
