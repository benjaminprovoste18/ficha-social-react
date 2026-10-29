export const instant = false;
import VistaRegion from "@/components/vistas/VistaRegion";

export default async function FichasDeRegion(props: PageProps<"/regiones/[region]">) {
  const { region } = await props.params;
  return <VistaRegion slug={region} />;
}
