type Props = {
  paso: 1 | 2 | 3;
};

const PASOS = ["Elegir beneficios", "Tus datos", "Resultado"];

// Indicador de en que paso va la solicitud
export default function PasosSolicitud({ paso }: Props) {
  return (
    <ol className="list-unstyled d-flex gap-2 flex-wrap small mb-4" aria-label="Pasos de la solicitud">
      {PASOS.map((nombre, i) => {
        const numero = i + 1;
        const actual = numero === paso;
        const listo = numero < paso;
        return (
          <li
            key={nombre}
            aria-current={actual ? "step" : undefined}
            className={"badge rounded-pill px-3 py-2 " + (actual ? "text-bg-primary" : listo ? "text-bg-success" : "text-bg-light border")}
          >
            {numero}. {nombre}
          </li>
        );
      })}
    </ol>
  );
}
