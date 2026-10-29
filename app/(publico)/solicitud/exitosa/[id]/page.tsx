export const instant = false;
import PasosSolicitud from "@/components/PasosSolicitud";
import ResultadoSolicitud from "@/components/ResultadoSolicitud";

// Paso 3 cuando todo sale bien (como "pago correcto")
export default async function SolicitudExitosa(props: PageProps<"/solicitud/exitosa/[id]">) {
  const { id } = await props.params;
  return (
    <>
      <PasosSolicitud paso={3} />
      <ResultadoSolicitud id={id} tipo="exitosa" />
    </>
  );
}
