export const instant = false;
import VistaFicha from "@/components/vistas/VistaFicha";

// Equivale a /productos/[slug]: el slug es el RUT. Ej: /fichas/11111111-1
export default async function FichaPorRut(props: PageProps<"/fichas/[slug]">) {
  const { slug } = await props.params;
  return <VistaFicha rut={decodeURIComponent(slug)} />;
}
