import ArmadorSolicitud from "@/components/ArmadorSolicitud";
import PasosSolicitud from "@/components/PasosSolicitud";

// Paso 1 (como el carrito de compras)
export default function MiSolicitud() {
  return (
    <>
      <h2 className="h3 text-primary">Solicitud de cobro de beneficios</h2>
      <PasosSolicitud paso={1} />
      <ArmadorSolicitud />
    </>
  );
}
