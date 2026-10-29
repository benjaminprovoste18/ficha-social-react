type Props = {
  estado: string;
};

// Devuelve la clase de Bootstrap segun el estado.
export function claseEstado(estado: string): string {
  const texto = estado.toLowerCase();

  if (["pendiente", "en trámite", "con pendientes"].includes(texto)) {
    return "text-bg-warning";
  }
  if (["solicitado", "ingresada"].includes(texto)) {
    return "text-bg-info";
  }
  if (["emitido", "cobrado", "pagada", "al día", "aprobada"].includes(texto)) {
    return "text-bg-success";
  }
  if (texto === "rechazada") {
    return "text-bg-danger";
  }
  return "text-bg-secondary";
}

export default function EstadoBadge({ estado }: Props) {
  const texto = estado.charAt(0).toUpperCase() + estado.slice(1);
  return <span className={"badge " + claseEstado(estado)}>{texto}</span>;
}
