import { comunasDe, REGIONES } from "@/lib/opciones";
import Campo from "./Campo";

type Props = {
  idPrefijo: string;
  region: string;
  comuna: string;
  onCambio: (region: string, comuna: string) => void;
  errorRegion?: string;
  errorComuna?: string;
};

// Dos selects encadenados: las comunas dependen de la region elegida.
// Al cambiar la region, la comuna se borra.
export default function SelectorRegionComuna({ idPrefijo, region, comuna, onCambio, errorRegion, errorComuna }: Props) {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <Campo
          id={idPrefijo + "-region"}
          etiqueta="Región"
          obligatorio
          valor={region}
          opciones={REGIONES.map((r) => r.nombre)}
          onCambio={(nueva) => onCambio(nueva, "")}
          error={errorRegion}
        />
      </div>
      <div className="col-12 col-md-6">
        <Campo
          id={idPrefijo + "-comuna"}
          etiqueta="Comuna"
          obligatorio
          valor={comuna}
          opciones={comunasDe(region)}
          deshabilitado={region === ""}
          onCambio={(nueva) => onCambio(region, nueva)}
          error={errorComuna}
        />
      </div>
    </div>
  );
}
