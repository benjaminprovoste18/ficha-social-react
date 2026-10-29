"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { actualizarFicha, crearFicha, listarFichas } from "@/lib/baseDatos";
import { fechaLocalHoy } from "@/lib/fichas";
import {
  fichaAFormulario,
  formularioAFicha,
  formularioVacio,
  validarFicha,
  type FichaFormulario,
  type FilaEditable,
  type ListaFicha,
} from "@/lib/fichaFormulario";
import {
  ESTADOS_BENEFICIO,
  ESTADOS_CIVILES,
  ESTADOS_DEUDA,
  ESTADOS_DOCUMENTO,
  PARENTESCOS_FAMILIA,
  TIPOS_BIEN,
} from "@/lib/opciones";
import type { Errores, Ficha } from "@/lib/tipos";
import BotonAccion from "../BotonAccion";
import Campo from "../Campo";
import SelectorRegionComuna from "../SelectorRegionComuna";
import ListaEditable, { type CampoLista } from "./ListaEditable";

type Props = {
  fichaInicial?: Ficha; // si viene, el formulario es para editar
  hoy?: string; // fecha de hoy (AAAA-MM-DD), se puede fijar en las pruebas
};

// Configuracion de cada lista del formulario
const LISTAS: { nombre: ListaFicha; titulo: string; campos: CampoLista[] }[] = [
  {
    nombre: "familia",
    titulo: "Grupo familiar",
    campos: [
      { clave: "nombre", etiqueta: "Nombre", columnas: "col-12 col-md-7" },
      { clave: "parentesco", etiqueta: "Parentesco", opciones: PARENTESCOS_FAMILIA, columnas: "col-12 col-md-4" },
    ],
  },
  {
    nombre: "bienes",
    titulo: "Bienes",
    campos: [
      { clave: "tipo", etiqueta: "Tipo", opciones: TIPOS_BIEN, columnas: "col-12 col-md-3" },
      { clave: "descripcion", etiqueta: "Descripción", columnas: "col-12 col-md-5" },
      { clave: "avaluo", etiqueta: "Avalúo ($)", tipo: "number", columnas: "col-12 col-md-3" },
    ],
  },
  {
    nombre: "deudas",
    titulo: "Deudas",
    campos: [
      { clave: "institucion", etiqueta: "Institución", columnas: "col-12 col-md-5" },
      { clave: "monto", etiqueta: "Monto ($)", tipo: "number", columnas: "col-12 col-md-3" },
      { clave: "estado", etiqueta: "Estado", opciones: ESTADOS_DEUDA, columnas: "col-12 col-md-3" },
    ],
  },
  {
    nombre: "beneficios",
    titulo: "Beneficios",
    campos: [
      { clave: "nombre", etiqueta: "Beneficio", columnas: "col-12 col-md-5" },
      { clave: "monto", etiqueta: "Monto ($)", tipo: "number", columnas: "col-12 col-md-3" },
      { clave: "estado", etiqueta: "Estado", opciones: ESTADOS_BENEFICIO, columnas: "col-12 col-md-3" },
    ],
  },
  {
    nombre: "documentos",
    titulo: "Documentos",
    campos: [
      { clave: "nombre", etiqueta: "Documento", columnas: "col-12 col-md-7" },
      { clave: "estado", etiqueta: "Estado", opciones: ESTADOS_DOCUMENTO, columnas: "col-12 col-md-4" },
    ],
  },
];

// Formulario para crear o editar una ficha (el "C" y la "U" del CRUD)
export default function FormularioFicha({ fichaInicial, hoy }: Props) {
  const router = useRouter();
  const esNueva = !fichaInicial;
  const [formulario, setFormulario] = useState<FichaFormulario>(
    fichaInicial ? fichaAFormulario(fichaInicial) : formularioVacio()
  );
  const [errores, setErrores] = useState<Errores>({});

  function cambiar(campo: keyof FichaFormulario, valor: string) {
    setFormulario({ ...formulario, [campo]: valor });
  }

  function cambiarLista(lista: ListaFicha, filas: FilaEditable[]) {
    setFormulario({ ...formulario, [lista]: filas });
  }

  function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nuevosErrores = validarFicha(formulario, {
      esNueva,
      rutsExistentes: listarFichas().map((f) => f.id),
      hoy: hoy ?? fechaLocalHoy(),
    });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const ficha = formularioAFicha(formulario);
    if (esNueva) crearFicha(ficha);
    else actualizarFicha(fichaInicial.id, ficha);
    router.push("/admin/fichas/" + (esNueva ? ficha.id : fichaInicial.id));
  }

  const cantidadErrores = Object.keys(errores).length;

  return (
    <form noValidate onSubmit={guardar} id="formulario-ficha">
      {cantidadErrores > 0 && (
        <div className="alert alert-danger" role="alert" id="resumen-errores">
          {cantidadErrores === 1 ? "Revisa el campo marcado en rojo." : `Revisa los ${cantidadErrores} campos marcados en rojo.`}
        </div>
      )}

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h3 className="h6">Datos de la persona</h3>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <Campo
                id="ficha-rut"
                etiqueta="RUT"
                obligatorio
                placeholder="12345678-9"
                valor={formulario.id}
                deshabilitado={!esNueva}
                ayuda={esNueva ? "Debe ser ficticio y con dígito verificador válido." : "El RUT no se puede cambiar."}
                error={errores.id}
                onCambio={(v) => cambiar("id", v)}
              />
            </div>
            <div className="col-12 col-md-8">
              <Campo id="ficha-nombre" etiqueta="Nombre completo" obligatorio valor={formulario.nombre} error={errores.nombre} onCambio={(v) => cambiar("nombre", v)} />
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Campo id="ficha-nacimiento" etiqueta="Fecha de nacimiento" tipo="date" obligatorio valor={formulario.fechaNacimiento} error={errores.fechaNacimiento} onCambio={(v) => cambiar("fechaNacimiento", v)} />
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <Campo id="ficha-defuncion" etiqueta="Fecha de defunción" tipo="date" obligatorio valor={formulario.fechaDefuncion} error={errores.fechaDefuncion} onCambio={(v) => cambiar("fechaDefuncion", v)} />
            </div>
            <div className="col-12 col-md-4">
              <Campo id="ficha-estado-civil" etiqueta="Estado civil" obligatorio opciones={ESTADOS_CIVILES} valor={formulario.estadoCivil} error={errores.estadoCivil} onCambio={(v) => cambiar("estadoCivil", v)} />
            </div>
            <div className="col-12">
              <SelectorRegionComuna
                idPrefijo="ficha"
                region={formulario.region}
                comuna={formulario.comuna}
                errorRegion={errores.region}
                errorComuna={errores.comuna}
                onCambio={(region, comuna) => setFormulario({ ...formulario, region, comuna })}
              />
            </div>
          </div>
        </div>
      </div>

      {LISTAS.map((lista) => (
        <ListaEditable
          key={lista.nombre}
          nombre={lista.nombre}
          titulo={lista.titulo}
          campos={lista.campos}
          filas={formulario[lista.nombre]}
          errores={errores}
          onCambio={(filas) => cambiarLista(lista.nombre, filas)}
        />
      ))}

      <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
        <Link href="/admin/fichas" className="btn btn-outline-secondary">
          Cancelar
        </Link>
        <BotonAccion tipo="submit" etiqueta={esNueva ? "Crear ficha" : "Guardar cambios"} />
      </div>
    </form>
  );
}
