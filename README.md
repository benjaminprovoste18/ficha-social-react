# Sistema de Ficha Social

Proyecto de la asignatura DSY1104 Desarrollo Fullstack II (DuocUC), Evaluación Parcial 2.

Es la versión mejorada de nuestra página anterior de ficha social (HTML, CSS y JS), ahora hecha con
**Next.js + React**, **Bootstrap 5**, una **base de datos simulada en JavaScript con CRUD** que guarda
en el localStorage, un **panel de administración** y **pruebas unitarias con Jasmine y Karma**.
La estructura sigue el proyecto "mi tienda" visto en clases y el Anexo 1 de la evaluación (vistas de la
tienda adaptadas a la ficha social).

> Todos los datos son **ficticios**. No es legal usar datos reales de personas, así que los nombres,
> RUT, bienes y deudas son inventados (los RUT son del tipo 11.111.111-1).

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
```

No necesita API aparte: los datos iniciales están en `lib/datosIniciales.ts` y los cambios se guardan en
el localStorage del navegador. En el panel (`/admin`) hay un botón para volver a los datos iniciales.

## Pruebas unitarias (Jasmine + Karma)

```bash
npm test          # abre Chrome con el reporte de Jasmine y se queda escuchando cambios
npm run test:ci   # corre una sola vez sin abrir ventana (Chrome headless)
```

Resultado actual: **172 pruebas, 0 fallas**. El reporte de cobertura queda en `coverage/html/index.html`.

## Vistas

Equivalencia con las vistas que propone el Anexo 1 para la tienda:

| Anexo 1 (tienda) | Ficha social | Ruta |
|---|---|---|
| Home | Inicio | `/` |
| Productos / Detalle | Fichas / Detalle de la ficha | `/fichas`, `/fichas/[RUT]` |
| Categorías / Categoría | Fichas por región | `/regiones`, `/regiones/[region]` |
| Ofertas | Beneficios pendientes de cobro | `/beneficios` |
| Carrito | Mi solicitud de cobro (paso 1) | `/solicitud` |
| Checkout | Datos del solicitante y dirección (paso 2) | `/solicitud/datos` |
| Pago correcto | Solicitud ingresada | `/solicitud/exitosa/[id]` |
| Pago con error | Solicitud rechazada | `/solicitud/rechazada/[id]` |
| Nosotros | Nosotros | `/nosotros` |
| (de la entrega anterior) | Consultar ficha por RUT | `/consultar` |
| Admin: Dashboard | Dashboard | `/admin` |
| Admin: Productos (CRUD) | Fichas: listar, nueva, ver, editar, eliminar | `/admin/fichas`, `/admin/fichas/nueva`, `/admin/fichas/[id]`, `/admin/fichas/[id]/editar` |
| Admin: Órdenes / Boletas | Solicitudes: listar, ver, aprobar, rechazar, eliminar | `/admin/solicitudes`, `/admin/solicitudes/[id]` |
| Admin: Reportes | Reportes por región y por estado | `/admin/reportes` |

Regla de negocio de la solicitud: si quien la pide marca "Otro (sin parentesco)", la solicitud queda
**rechazada** (solo la familia puede cobrar). Si no, queda **ingresada**, los beneficios pasan a
"solicitado" y el administrador después la aprueba (pasan a "cobrado") o la rechaza (vuelven a "pendiente").

## Estructura

```
app/(publico)/     páginas públicas (con el menú superior)
app/admin/         panel de administración (con menú lateral)
components/        componentes React reutilizables
components/admin/  componentes del panel
components/vistas/ componentes que leen la base de datos para cada página
lib/baseDatos.ts   base de datos simulada: CRUD de fichas, solicitudes y la selección (carrito)
lib/hooks.ts       hooks que conectan la base de datos con React (useSyncExternalStore)
lib/               validaciones, cálculos, opciones (regiones y comunas) y datos iniciales
tests/             pruebas unitarias, mocks y datos de prueba
karma.conf.cjs     configuración de Karma
```

## Base de datos simulada (CRUD + persistencia)

`lib/baseDatos.ts` funciona como una base de datos:

- **Fichas:** `listarFichas`, `obtenerFicha`, `crearFicha`, `actualizarFicha`, `eliminarFicha`.
- **Solicitudes:** `listarSolicitudes`, `obtenerSolicitud`, `crearSolicitud`, `cambiarEstadoSolicitud`, `eliminarSolicitud`.
- **Selección (carrito):** `listarSeleccion`, `agregarASeleccion`, `quitarDeSeleccion`, `vaciarSeleccion`.

Todo se guarda en el localStorage. Cada cambio avisa a los componentes suscritos (con `suscribir`) y los
hooks de `lib/hooks.ts` hacen que la interfaz se actualice al tiro, por ejemplo el contador de "Mi
solicitud" en el menú o los números del dashboard. Si otra pestaña cambia los datos, también se actualiza.

## Componentes, props y estados (principales)

| Componente | Props | Estado (useState) |
|---|---|---|
| `BarraNavegacion` | `titulo`, `enlaces`, `extra` | `menuAbierto`, `submenuAbierto` |
| `FormularioConsulta` | `numeroA`, `numeroB` | `rut`, `respuesta`, `operacion`, `errores`, `mensaje` |
| `TablaFichasFiltrable` | `fichas` | `texto`, `soloPendientes` |
| `FormularioSolicitud` | `ahora` | `solicitante`, `direccion`, `errores` |
| `FormularioFicha` | `fichaInicial`, `hoy` | `formulario`, `errores` |
| `ListaEditable` | `nombre`, `titulo`, `campos`, `filas`, `onCambio`, `errores` | ninguno (controlado) |
| `TablaAdminFichas` | ninguna | `texto`, `soloPendientes`, `mensaje` |
| `DetalleSolicitudAdmin` | `id` | `motivo`, `error` |
| `MenuAdmin` | `enlaces` | `abierto` |
| `BotonConfirmar` | `etiqueta`, `pregunta`, `onConfirmar` | `confirmando` |
| `AvisoDatosFicticios`, `SeccionFicha` | `mensaje` / `titulo`, `cantidad` | `visible` / `abierta` |
| `BotonAccion`, `Campo`, `EstadoBadge`, `TablaSeleccion`, `SelectorRegionComuna`, etc. | lo que muestran | ninguno |

Siguiendo el principio de responsabilidad única, los componentes chicos (`BotonAccion`, `Campo`,
`BotonConfirmar`, `EstadoBadge`) se reutilizan en todos los formularios y tablas.

## Mocks usados en las pruebas

- **next/link** y **next/navigation**: se cambian en `karma.conf.cjs` por `tests/mocks/` porque en Karma
  no existe el router de Next. Con `spyOn(routerFalso, "push")` se revisa a qué ruta navega cada formulario.
- **localStorage**: `spyOn(Storage.prototype, "getItem" | "setItem" | "removeItem")` simula que el
  navegador bloquea o se llena, para probar que la app no se cae.
- **Math.random**: para que "Cambiar operación" dé números conocidos.
- **Callbacks** con `jasmine.createSpy` (por ejemplo `onClick`, `onCambio`, `onConfirmar`).
- **Render en el servidor** con `renderToString`, para probar los hooks cuando no existe localStorage.
