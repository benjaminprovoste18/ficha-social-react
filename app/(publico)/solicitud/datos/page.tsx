import FormularioSolicitud from "@/components/FormularioSolicitud";
import PasosSolicitud from "@/components/PasosSolicitud";

// Paso 2 (como el checkout)
export default function DatosSolicitud() {
  return (
    <div className="mx-auto" style={{ maxWidth: 860 }}>
      <h2 className="h3 text-primary">Completa tus datos</h2>
      <PasosSolicitud paso={2} />
      <FormularioSolicitud />
    </div>
  );
}
