// Configuracion de Karma para correr las pruebas unitarias con Jasmine.
// Karma abre un navegador (Chrome), carga las pruebas compiladas con webpack
// y muestra los resultados. Tambien genera el reporte de cobertura en /coverage.
const path = require("path");

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      { pattern: "tests/**/*.spec.ts", watched: false },
      { pattern: "tests/**/*.spec.tsx", watched: false },
    ],

    preprocessors: {
      "tests/**/*.spec.ts": ["webpack"],
      "tests/**/*.spec.tsx": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
          // mismo alias "@" que usa Next (tsconfig.json)
          "@": path.resolve(__dirname),
          // Mocks: en las pruebas no existe el router de Next, asi que
          // reemplazamos next/link y next/navigation por versiones falsas.
          "next/link$": path.resolve(__dirname, "tests/mocks/next-link.tsx"),
          "next/navigation$": path.resolve(__dirname, "tests/mocks/next-navigation.ts"),
        },
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                // la config de babel va aqui y no en un .babelrc,
                // asi Next sigue usando su propio compilador (SWC)
                babelrc: false,
                configFile: false,
                presets: [
                  ["@babel/preset-react", { runtime: "automatic" }],
                  "@babel/preset-typescript",
                ],
                plugins: [
                  // instrumenta solo el codigo de la app para medir la cobertura
                  ["istanbul", { include: ["components/**", "lib/**"] }],
                ],
              },
            },
          },
        ],
      },
    },

    client: {
      clearContext: false, // deja visible el reporte de Jasmine en el navegador
      jasmine: {
        random: false,
      },
    },

    reporters: ["spec", "kjhtml", "coverage"],

    specReporter: {
      suppressSkipped: true,
    },

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
        { type: "json-summary", subdir: ".", file: "coverage-summary.json" },
        { type: "text" },
        { type: "text-summary" },
      ],
    },

    browsers: ["Chrome"],
    customLaunchers: {
      // para correr sin ventana (npm run test:ci)
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
  });
};
