type Props = {
  id: string;
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  error?: string;
  tipo?: "text" | "email" | "date" | "number" | "textarea";
  opciones?: string[]; // si viene, el campo es un select
  placeholder?: string;
  ayuda?: string;
  deshabilitado?: boolean;
  obligatorio?: boolean;
  etiquetaOculta?: boolean;
};

// Un campo de formulario con su etiqueta y su mensaje de error.
// Solo muestra el error cuando viene uno (renderizado condicional).
export default function Campo({
  id,
  etiqueta,
  valor,
  onCambio,
  error,
  tipo = "text",
  opciones,
  placeholder,
  ayuda,
  deshabilitado = false,
  obligatorio = false,
  etiquetaOculta = false,
}: Props) {
  const clase = (opciones ? "form-select" : "form-control") + (error ? " is-invalid" : "");
  const idAyuda = ayuda ? id + "-ayuda" : undefined;

  let control;
  if (opciones) {
    control = (
      <select id={id} className={clase} value={valor} disabled={deshabilitado} onChange={(e) => onCambio(e.target.value)}>
        <option value="">Selecciona...</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    );
  } else if (tipo === "textarea") {
    control = (
      <textarea
        id={id}
        className={clase}
        rows={3}
        value={valor}
        placeholder={placeholder}
        disabled={deshabilitado}
        onChange={(e) => onCambio(e.target.value)}
      />
    );
  } else {
    control = (
      <input
        id={id}
        type={tipo}
        className={clase}
        value={valor}
        placeholder={placeholder}
        disabled={deshabilitado}
        aria-describedby={idAyuda}
        onChange={(e) => onCambio(e.target.value)}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className={etiquetaOculta ? "visually-hidden" : "form-label small fw-semibold mb-1"}>
        {etiqueta}
        {obligatorio && <span className="text-danger"> *</span>}
      </label>
      {control}
      {error && <div className="invalid-feedback">{error}</div>}
      {!error && ayuda && (
        <div id={idAyuda} className="form-text">
          {ayuda}
        </div>
      )}
    </div>
  );
}
