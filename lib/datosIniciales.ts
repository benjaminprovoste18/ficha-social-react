import type { Ficha } from "./tipos";

// Datos iniciales del sistema (la "base de datos" la primera vez que se abre la pagina).
// Todo es ficticio: los RUT son del tipo 11.111.111-1 y las instituciones son inventadas.
// Despues, los cambios que se hagan en el panel de administracion quedan guardados
// en el localStorage del navegador (ver lib/baseDatos.ts).

export const fichasIniciales: Ficha[] = [
  {
    id: "11111111-1",
    nombre: "Rosa Elena Fuentes Araya",
    fechaNacimiento: "1941-03-12",
    fechaDefuncion: "2024-07-02",
    comuna: "Valparaíso",
    region: "Valparaíso",
    estadoCivil: "Viuda",
    familia: [
      {
        nombre: "Carmen Gloria Soto Fuentes",
        parentesco: "Hija"
      },
      {
        nombre: "Luis Alberto Soto Fuentes",
        parentesco: "Hijo"
      }
    ],
    bienes: [
      {
        tipo: "Inmueble",
        descripcion: "Casa habitación en cerro",
        avaluo: 48500000
      }
    ],
    deudas: [
      {
        institucion: "Tienda Comercial Ficticia",
        monto: 320000,
        estado: "pendiente"
      }
    ],
    beneficios: [
      {
        nombre: "Cuota mortuoria",
        monto: 650000,
        estado: "pendiente"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "en trámite"
      }
    ]
  },
  {
    id: "22222222-2",
    nombre: "Jorge Manuel Riquelme Pardo",
    fechaNacimiento: "1950-11-28",
    fechaDefuncion: "2023-12-15",
    comuna: "Temuco",
    region: "La Araucanía",
    estadoCivil: "Casado",
    familia: [
      {
        nombre: "Ana María Toro Vidal",
        parentesco: "Cónyuge"
      }
    ],
    bienes: [
      {
        tipo: "Vehículo",
        descripcion: "Camioneta año 2012",
        avaluo: 6200000
      },
      {
        tipo: "Cuenta de ahorro",
        descripcion: "Banco Ficticio del Sur",
        avaluo: 2300000
      }
    ],
    deudas: [],
    beneficios: [
      {
        nombre: "Cuota mortuoria",
        monto: 650000,
        estado: "cobrado"
      },
      {
        nombre: "Pensión de sobrevivencia",
        monto: 210000,
        estado: "cobrado"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "emitido"
      }
    ]
  },
  {
    id: "33333333-3",
    nombre: "Marta Isabel Contreras Leiva",
    fechaNacimiento: "1938-06-04",
    fechaDefuncion: "2025-02-20",
    comuna: "Santiago",
    region: "Metropolitana",
    estadoCivil: "Soltera",
    familia: [
      {
        nombre: "Pedro Pablo Contreras Leiva",
        parentesco: "Hermano"
      }
    ],
    bienes: [],
    deudas: [
      {
        institucion: "Banco Ficticio Central",
        monto: 1250000,
        estado: "pendiente"
      },
      {
        institucion: "Farmacia Ficticia",
        monto: 85000,
        estado: "pagada"
      }
    ],
    beneficios: [],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      }
    ]
  },
  {
    id: "44444444-4",
    nombre: "Héctor Andrés Valenzuela Rojas",
    fechaNacimiento: "1962-01-17",
    fechaDefuncion: "2025-08-09",
    comuna: "Concepción",
    region: "Biobío",
    estadoCivil: "Divorciado",
    familia: [
      {
        nombre: "Camila Valenzuela Muñoz",
        parentesco: "Hija"
      },
      {
        nombre: "Tomás Valenzuela Muñoz",
        parentesco: "Hijo"
      },
      {
        nombre: "Elena Rojas Sepúlveda",
        parentesco: "Madre"
      }
    ],
    bienes: [
      {
        tipo: "Inmueble",
        descripcion: "Departamento",
        avaluo: 62000000
      }
    ],
    deudas: [
      {
        institucion: "Crédito Hipotecario Ficticio",
        monto: 18400000,
        estado: "pendiente"
      }
    ],
    beneficios: [
      {
        nombre: "Seguro de desgravamen",
        monto: 18400000,
        estado: "pendiente"
      },
      {
        nombre: "Cuota mortuoria",
        monto: 650000,
        estado: "cobrado"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "pendiente"
      }
    ]
  },
  {
    id: "55555555-5",
    nombre: "Gladys del Carmen Aravena Núñez",
    fechaNacimiento: "1945-09-30",
    fechaDefuncion: "2022-05-11",
    comuna: "La Serena",
    region: "Coquimbo",
    estadoCivil: "Viuda",
    familia: [
      {
        nombre: "Ricardo Aravena Núñez",
        parentesco: "Hijo"
      }
    ],
    bienes: [
      {
        tipo: "Terreno",
        descripcion: "Parcela agrícola",
        avaluo: 31000000
      }
    ],
    deudas: [],
    beneficios: [
      {
        nombre: "Cuota mortuoria",
        monto: 650000,
        estado: "cobrado"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "emitido"
      }
    ]
  },
  {
    id: "66666666-6",
    nombre: "Raúl Esteban Mardones Silva",
    fechaNacimiento: "1958-04-22",
    fechaDefuncion: "2024-10-03",
    comuna: "Antofagasta",
    region: "Antofagasta",
    estadoCivil: "Casado",
    familia: [
      {
        nombre: "Patricia Olivares Díaz",
        parentesco: "Cónyuge"
      },
      {
        nombre: "Ignacio Mardones Olivares",
        parentesco: "Hijo"
      }
    ],
    bienes: [
      {
        tipo: "Vehículo",
        descripcion: "Automóvil año 2018",
        avaluo: 7900000
      }
    ],
    deudas: [
      {
        institucion: "Tarjeta de Crédito Ficticia",
        monto: 940000,
        estado: "pendiente"
      }
    ],
    beneficios: [
      {
        nombre: "Pensión de sobrevivencia",
        monto: 280000,
        estado: "pendiente"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "en trámite"
      }
    ]
  },
  {
    id: "77777777-7",
    nombre: "Juana Teresa Pizarro Campos",
    fechaNacimiento: "1933-12-01",
    fechaDefuncion: "2021-03-27",
    comuna: "Puerto Montt",
    region: "Los Lagos",
    estadoCivil: "Viuda",
    familia: [
      {
        nombre: "Sergio Campos Pizarro",
        parentesco: "Hijo"
      },
      {
        nombre: "Valentina Campos Ruiz",
        parentesco: "Nieta"
      }
    ],
    bienes: [
      {
        tipo: "Inmueble",
        descripcion: "Casa de madera",
        avaluo: 27500000
      },
      {
        tipo: "Cuenta de ahorro",
        descripcion: "Caja de Ahorro Ficticia",
        avaluo: 900000
      }
    ],
    deudas: [],
    beneficios: [],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "emitido"
      },
      {
        nombre: "Posesión efectiva",
        estado: "emitido"
      }
    ]
  },
  {
    id: "88888888-8",
    nombre: "Óscar Alejandro Bustos Herrera",
    fechaNacimiento: "1970-08-14",
    fechaDefuncion: "2026-01-05",
    comuna: "Rancagua",
    region: "O'Higgins",
    estadoCivil: "Soltero",
    familia: [
      {
        nombre: "Mirta Herrera Lagos",
        parentesco: "Madre"
      }
    ],
    bienes: [],
    deudas: [
      {
        institucion: "Crédito de Consumo Ficticio",
        monto: 2100000,
        estado: "pendiente"
      }
    ],
    beneficios: [
      {
        nombre: "Cuota mortuoria",
        monto: 650000,
        estado: "pendiente"
      }
    ],
    documentos: [
      {
        nombre: "Certificado de defunción",
        estado: "en trámite"
      }
    ]
  }
];
