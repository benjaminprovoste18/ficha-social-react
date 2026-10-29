import FormularioConsulta from "@/components/FormularioConsulta";

// Version React de ficha.html
export default function Consultar() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 text-primary">Consultar ficha social</h2>
            <p className="text-body-secondary small">
              Ingresa el RUT de la persona fallecida. Para probar puedes usar 11.111.111-1 o
              44.444.444-4 (datos ficticios).
            </p>
            <FormularioConsulta numeroA={64} numeroB={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
