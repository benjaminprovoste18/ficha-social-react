"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { crearSolicitud } from "@/lib/baseDatos";
import { formatearPesos } from "@/lib/fichas";
import { useSeleccion } from "@/lib/hooks";
import { PARENTESCOS_SOLICITANTE } from "@/lib/opciones";
import type { Direccion, Errores, Solicitante } from "@/lib/tipos";
import { limpiarRut, validarSolicitud } from "@/lib/validaciones";
import BotonAccion from "./BotonAccion";
import Campo from "./Campo";
import SelectorRegionComuna from "./SelectorRegionComuna";
import TablaSeleccion from "./TablaSeleccion";

type Props = {
  // para poder probarlo con una fecha fija
  ahora?: () => string;
};

const solicitanteVacio: Solicitante = { nombres: "", apellidos: "", rut: "", correo: "", parentesco: "" };
const direccionVacia: Direccion = { calle: "", depto: "", region: "", comuna: "", indicaciones: "" };

// Paso 2 de la solicitud (como el checkout): datos de quien pide el cobro
// y la direccion donde se le notifica.
export default function FormularioSolicitud({ ahora = () => new Date().toISOString() }: Props) {
  const router = useRouter();
  const seleccion = useSeleccion();
  const [solicitante, setSolicitante] = useState<Solicitante>(solicitanteVacio);
  const [direccion, setDireccion] = useState<Direccion>(direccionVacia);
  const [errores, setErrores] = useState<Errores>({});

  const total = seleccion.reduce((suma, item) => suma + item.monto, 0);

  function cambiarSolicitante(campo: keyof Solicitante, valor: string) {
    setSolicitante({ ...solicitante, [campo]: valor });
  }

  function cambiarDireccion(campo: keyof Direccion, valor: string) {
    setDireccion({ ...direccion, [campo]: valor });
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nuevosErrores = validarSolicitud(solicitante, direccion, seleccion.length);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const solicitud = crearSolicitud({
      solicitante: { ...solicitante, rut: limpiarRut(solicitante.rut), correo: solicitante.correo.trim() },
      direccion,
      items: seleccion,
      fecha: ahora(),
    });
    const destino = solicitud.estado === "rechazada" ? "rechazada" : "exitosa";
    router.push(`/solicitud/${destino}/${solicitud.id}`);
  }

  return (
    <form noValidate onSubmit={enviar} id="formulario-solicitud">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h3 className="h5 mb-0">Beneficios a cobrar</h3>
              <p className="small text-body-secondary mb-0">Revisa lo que vas a solicitar.</p>
            </div>
            <span className="badge text-bg-primary fs-6 align-self-start" id="total-solicitud">
              Total: {formatearPesos(total)}
            </span>
          </div>
          <TablaSeleccion items={seleccion} mensajeVacio="Tu solicitud está vacía." />
          {errores.beneficios && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {errores.beneficios} <Link href="/solicitud">Volver a elegir beneficios</Link>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5">Datos del solicitante</h3>
          <p className="small text-body-secondary">Persona que pide el cobro de los beneficios.</p>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Campo id="nombres" etiqueta="Nombres" obligatorio valor={solicitante.nombres} error={errores.nombres} onCambio={(v) => cambiarSolicitante("nombres", v)} />
            </div>
            <div className="col-12 col-md-6">
              <Campo id="apellidos" etiqueta="Apellidos" obligatorio valor={solicitante.apellidos} error={errores.apellidos} onCambio={(v) => cambiarSolicitante("apellidos", v)} />
            </div>
            <div className="col-12 col-md-4">
              <Campo id="rut-solicitante" etiqueta="RUT" obligatorio placeholder="12345678-9" valor={solicitante.rut} error={errores.rut} onCambio={(v) => cambiarSolicitante("rut", v)} />
            </div>
            <div className="col-12 col-md-4">
              <Campo id="correo" etiqueta="Correo" tipo="email" obligatorio placeholder="nombre@correo.cl" valor={solicitante.correo} error={errores.correo} onCambio={(v) => cambiarSolicitante("correo", v)} />
            </div>
            <div className="col-12 col-md-4">
              <Campo id="parentesco" etiqueta="Parentesco con la persona fallecida" obligatorio opciones={PARENTESCOS_SOLICITANTE} valor={solicitante.parentesco} error={errores.parentesco} onCambio={(v) => cambiarSolicitante("parentesco", v)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="h5">Dirección para notificaciones</h3>
          <p className="small text-body-secondary">Aquí te llegará la respuesta de la solicitud.</p>
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <Campo id="calle" etiqueta="Calle y número" obligatorio valor={direccion.calle} error={errores.calle} onCambio={(v) => cambiarDireccion("calle", v)} />
            </div>
            <div className="col-12 col-md-4">
              <Campo id="depto" etiqueta="Departamento (opcional)" placeholder="Ej: 603" valor={direccion.depto} onCambio={(v) => cambiarDireccion("depto", v)} />
            </div>
            <div className="col-12">
              <SelectorRegionComuna
                idPrefijo="direccion"
                region={direccion.region}
                comuna={direccion.comuna}
                errorRegion={errores.region}
                errorComuna={errores.comuna}
                onCambio={(region, comuna) => setDireccion({ ...direccion, region, comuna })}
              />
            </div>
            <div className="col-12">
              <Campo id="indicaciones" etiqueta="Indicaciones (opcional)" tipo="textarea" placeholder="Ej: horario en que se puede ubicar a la persona" valor={direccion.indicaciones} onCambio={(v) => cambiarDireccion("indicaciones", v)} />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
        <Link href="/solicitud" className="btn btn-outline-secondary">
          Volver
        </Link>
        <BotonAccion tipo="submit" variante="success" etiqueta={"Enviar solicitud " + formatearPesos(total)} />
      </div>
    </form>
  );
}
