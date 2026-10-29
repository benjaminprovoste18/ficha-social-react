type Props = {
  etiqueta: string;
  onClick?: () => void;
  variante?: string; // primary, outline-danger, success, etc.
  tamano?: "sm" | "lg";
  tipo?: "button" | "submit";
  deshabilitado?: boolean;
  ancho?: boolean; // ocupa todo el ancho
  id?: string;
};

// Boton reutilizable. Recibe la etiqueta y la funcion onClick por props.
export default function BotonAccion({
  etiqueta,
  onClick,
  variante = "primary",
  tamano,
  tipo = "button",
  deshabilitado = false,
  ancho = false,
  id,
}: Props) {
  const clases = ["btn", "btn-" + variante];
  if (tamano) clases.push("btn-" + tamano);
  if (ancho) clases.push("w-100");

  return (
    <button id={id} type={tipo} className={clases.join(" ")} onClick={onClick} disabled={deshabilitado}>
      {etiqueta}
    </button>
  );
}
