import type { Errores } from "@/lib/tipos";
import type { FilaEditable } from "@/lib/fichaFormulario";
import BotonAccion from "../BotonAccion";
import Campo from "../Campo";

export type CampoLista = {
  clave: string;
  etiqueta: string;
  tipo?: "text" | "number";
  opciones?: string[];
  columnas: string; // clases de Bootstrap, ej: "col-12 col-md-6"
};

type Props = {
  nombre: string; // nombre de la lista: "familia", "bienes", etc.
  titulo: string;
  campos: CampoLista[];
  filas: FilaEditable[];
  onCambio: (filas: FilaEditable[]) => void;
  errores: Errores;
};

// Lista de filas que se pueden agregar, editar y quitar (formulario dinamico).
// Se usa para el grupo familiar, bienes, deudas, beneficios y documentos.
export default function ListaEditable({ nombre, titulo, campos, filas, onCambio, errores }: Props) {
  function agregar() {
    const nueva: FilaEditable = {};
    campos.forEach((campo) => (nueva[campo.clave] = ""));
    onCambio([...filas, nueva]);
  }

  function quitar(indice: number) {
    onCambio(filas.filter((_, i) => i !== indice));
  }

  function cambiar(indice: number, clave: string, valor: string) {
    onCambio(filas.map((fila, i) => (i === indice ? { ...fila, [clave]: valor } : fila)));
  }

  return (
    <fieldset className="border rounded-3 p-3 mb-3 bg-white" id={"lista-" + nombre}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <legend className="h6 mb-0 w-auto">
          {titulo} <span className="badge text-bg-light border">{filas.length}</span>
        </legend>
        <BotonAccion etiqueta="+ Agregar" variante="outline-primary" tamano="sm" onClick={agregar} />
      </div>

      {filas.length === 0 && <p className="small text-body-secondary mb-0">Sin registros.</p>}

      {filas.map((fila, i) => (
        <div className="row g-2 align-items-start border-top pt-2 mt-2 fila-editable" key={i}>
          {campos.map((campo) => (
            <div className={campo.columnas} key={campo.clave}>
              <Campo
                id={`${nombre}-${i}-${campo.clave}`}
                etiqueta={campo.etiqueta}
                tipo={campo.tipo}
                opciones={campo.opciones}
                valor={fila[campo.clave] ?? ""}
                error={errores[`${nombre}.${i}.${campo.clave}`]}
                onCambio={(valor) => cambiar(i, campo.clave, valor)}
              />
            </div>
          ))}
          <div className="col-12 col-md-auto align-self-md-end text-end">
            <BotonAccion etiqueta="Quitar" variante="outline-danger" tamano="sm" onClick={() => quitar(i)} />
          </div>
        </div>
      ))}
    </fieldset>
  );
}
