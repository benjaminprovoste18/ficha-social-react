export const instant = false;
import PasosSolicitud from "@/components/PasosSolicitud";
import ResultadoSolicitud from "@/components/ResultadoSolicitud";

// Paso 3 cuando la solicitud no se acepta (como "pago con error")
export default async function SolicitudRechazada(props: PageProps<"/solicitud/rechazada/[id]">) {
  const { id } = await props.params;
  return (
    <>
      <PasosSolicitud paso={3} />
      <ResultadoSolicitud id={id} tipo="rechazada" />
    </>
  );
}
