"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { limpiarRut, validarRut, validarVerificacion } from "@/lib/validaciones";

type Props = {
  numeroA?: number;
  numeroB?: number;
};

type Errores = {
  rut?: string;
  respuesta?: string;
};

function numeroAlAzar(): number {
  return Math.floor(Math.random() * 90) + 1;
}

// Formulario para consultar una ficha por RUT.
// Es la version React del formulario de ficha.html: cada campo
// esta en el estado del componente y se valida antes de consultar.
export default function FormularioConsulta({ numeroA = 64, numeroB = 3 }: Props) {
  const router = useRouter();

  const [rut, setRut] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [operacion, setOperacion] = useState({ a: numeroA, b: numeroB });
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");

  function cambiarOperacion() {
    setOperacion({ a: numeroAlAzar(), b: numeroAlAzar() });
    setRespuesta("");
    setErrores({ ...errores, respuesta: undefined });
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const resultadoRut = validarRut(rut);
    const resultadoVerificacion = validarVerificacion(respuesta, operacion.a, operacion.b);

    const nuevosErrores: Errores = {};
    if (!resultadoRut.valido) nuevosErrores.rut = resultadoRut.mensaje;
    if (!resultadoVerificacion.valido) nuevosErrores.respuesta = resultadoVerificacion.mensaje;
    setErrores(nuevosErrores);

    if (!resultadoRut.valido || !resultadoVerificacion.valido) {
      setMensaje("");
      return;
    }

    const rutLimpio = limpiarRut(rut);
    setMensaje("Verificación correcta. Buscando la ficha del RUT " + rutLimpio + "...");
    router.push("/fichas/" + rutLimpio);
  }

  return (
    <form id="formulario-ficha" noValidate onSubmit={manejarEnvio}>
      <div className="mb-3">
        <label htmlFor="rut" className="form-label fw-semibold">
          RUT
        </label>
        <input
          type="text"
          id="rut"
          name="rut"
          className={"form-control" + (errores.rut ? " is-invalid" : "")}
          placeholder="12345678-9"
          autoComplete="off"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          aria-describedby="ayuda-rut"
        />
        {errores.rut ? (
          <div className="invalid-feedback">{errores.rut}</div>
        ) : (
          <div id="ayuda-rut" className="form-text">
            Formato: 12345678-9 (puedes escribirlo con o sin puntos)
          </div>
        )}
      </div>

      <fieldset className="mb-3">
        <legend className="fs-6 fw-semibold mb-1">Verificación</legend>
        <p className="small text-body-secondary mb-2">Resuelve la siguiente operación:</p>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-7">
            <label htmlFor="respuesta" className="visually-hidden">
              Resultado de la operación
            </label>
            <div className="input-group has-validation">
              <span className="input-group-text" id="operacion">
                {operacion.a} + {operacion.b} =
              </span>
              <input
                type="text"
                inputMode="numeric"
                id="respuesta"
                name="respuesta"
                className={"form-control" + (errores.respuesta ? " is-invalid" : "")}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                aria-describedby="operacion"
              />
              {errores.respuesta && (
                <div className="invalid-feedback">{errores.respuesta}</div>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-5">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={cambiarOperacion}
            >
              Cambiar operación
            </button>
          </div>
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary w-100">
        Verificar y consultar
      </button>

      {mensaje && (
        <div className="alert alert-success mt-3 mb-0" role="status" id="mensaje">
          {mensaje}
        </div>
      )}
    </form>
  );
}
