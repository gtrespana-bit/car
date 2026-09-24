# 🚗 Coruña AutoImport - Plan de Negocio y Sistema de Gestión

Sistema integral de gestión, inteligencia de mercado, simulación fiscal y guía operativa para el negocio de **importación de vehículos desde Europa para su venta en A Coruña y Galicia (España)**.

---

## 📌 Contexto y Estrategia del Negocio

El proyecto se divide en dos fases bien diferenciadas para minimizar riesgos, validar el mercado y optimizar la rentabilidad:

### 🟡 Fase 1: Prueba de Concepto (MVP con 3 Vehículos)
- **Operación como particular**: Compra a nombre propio en Europa (Alemania, Bélgica, Francia, Países Bajos), matriculación en España (DGT A Coruña) y venta a compradores finales en Galicia.
- **Tributación limpia y legal**: Declaración de la ganancia patrimonial obtenida en el IRPF anual (base imponible del ahorro) y liquidación de los impuestos obligatorios previos a la venta (Modelo 576 AEAT, IVTM Concello de A Coruña, ITV de importación).
- **Objetivos de validación**:
  1. Conocer al céntimo los costes reales de importación (transporte, ITV, Hacienda, tasas, reacondicionamiento).
  2. Medir los tiempos reales de rotación (cuántos días tarda un coche desde que se compra en Alemania hasta que se transfiere en A Coruña).
  3. Comprobar qué segmentos, motorizaciones y etiquetas ambientales tienen mayor salida y rentabilidad en el mercado coruñés.
  4. Optimizar el embudo de captación de compradores locales (Coches.net, Wallapop, Milanuncios, contactos de confianza).

### 🟢 Fase 2: Escalamiento Profesional (Empresa y Local)
- **Constitución formal**: Alta en IAE (Comercio al por menor de vehículos) como Autónomo o Sociedad Limitada (S.L.).
- **Régimen REBU (Régimen Especial de Bienes Usados)**: Tributación de IVA únicamente sobre el margen de beneficio, no sobre el importe total de la venta.
- **Instalación de local / showroom**: Alquiler de nave o local de exposición en los principales polígonos del área metropolitana de A Coruña (PO.CO.MA.CO, Agrela, Espírito Santo, Bergondo, Morás).
- **Garantía comercial**: Cumplimiento del RDL 1/2007 (garantía legal de 1 año) respaldada por pólizas de garantía mecánica profesional (GarantiPLUS, Atlántica, etc.).

---

## 💻 Aplicación de Gestión Integrada

El repositorio incluye una aplicación web completa desarrollada en **React 19 + Vite + Tailwind CSS v4** diseñada para gestionar todo el ciclo de vida del negocio:

- **📊 Dashboard de Control**: KPIs de capital en circulación, margen bruto y neto, ROI medio y días medios en stock.
- **🧮 Simulador de Costes e Impuestos**: Desglose exacto de impuestos españoles (Modelo 576 según tramos CO2, ITP 620 en Galicia si aplica, IVTM A Coruña, DGT, ITV, transporte, reacondicionamiento y cálculo de IRPF). Presets cargados para Cupra Formentor, Golf 7.5, Tucson N-Line, Sportage GT-Line, RAV4 Hybrid, C-HR, Caddy 4, Mercedes A 200d AMG y BMW X1.
  - **🔎 Buscador con autocompletado** (`src/data/vehicleDatabase.js`): +100 motorizaciones (VAG, BMW, Mercedes, Toyota, Hyundai/Kia, Mazda, Renault/Dacia/Nissan, Stellantis, Ford, JLR, Jeep). Al seleccionar se rellenan automáticamente motor, cilindrada, CO₂ WLTP, CVF, etiqueta DGT, precio medio de tablas Hacienda y horquillas de precio Alemania/Galicia. Los campos Marca / Modelo / Versión también autocompletan mediante `datalist`.
  - **🚨 Alerta automática de motor problemático**: cada ficha lleva su estado de fiabilidad (`gold` / `ok` / `warn` / `banned`). Si eliges un PureTech, 1.5 BlueHDi, 1.2 TCe, N47, Ingenium, BiTDI, Powershift, CVT X-Tronic… salta el banner rojo de **MODELO PROHIBIDO**. Si escribes el coche a mano, `src/utils/engineGuardian.js` aplica heurísticas por texto y año.
  - **📚 Tablas oficiales de referencia** (`src/data/taxTables.js`): tramos del Impuesto de Matriculación (Mod. 576), tabla de depreciación y **valor venal de Hacienda** (Orden HFP de precios medios) con simulador, IVTM del Concello de A Coruña por CVF, tasas DGT / ITV / ficha reducida / COC / gestoría con botón «Aplicar» y calculadora oficial de **caballos fiscales**.
  - **⚖️ Base imponible del 576 elegible**: liquidar por *tablas Hacienda* (valor venal minorado de IVA + IEDMT, no comprobable) o por *precio de factura*, con aviso cuando el precio pagado queda por debajo de tablas. El ITP se calcula sobre el mayor entre precio y valor venal.
- **🛡️ Guía de Fiabilidad y Matriz de Modelos**: Buscador y clasificador exhaustivo de **Modelos Ganadores vs Modelos Prohibidos** por segmentos (Compactos, C-SUVs, Furgonetas Combi/Camper, Todoterrenos 4x4 rurales, Familiares 7 plazas y Urbanos ECO).
- **🚗 Gestor de Flota / Pipeline**: Seguimiento paso a paso del estado de cada vehículo (Prospección, Comprado, En tránsito, En trámites en Coruña, En venta, Vendido).
- **📋 Guía Operativa Paso a Paso**: Instrucciones detalladas de los trámites específicos en A Coruña (ITV Espírito Santo/Sabón, Delegación de Hacienda de A Coruña, Atriga, Jefatura de Tráfico DGT en Calle Médico Rodríguez).
- **📄 Generador de Contratos y Documentos**: Generación lista para imprimir de Contratos de Compraventa entre particulares conforme al Código Civil y contratos de señal/reserva con cláusulas anti-vicios ocultos.
- **🏢 Simulador de Fase 2**: Calculadora REBU vs Régimen General, comparativa de costes fijos de nave en polígonos de A Coruña y viabilidad económica.

---

## 🚀 Despliegue en Vercel (Listo para Producción)

El proyecto está **100% preparado y optimizado para desplegarse en Vercel** en 1 minuto:

### Opción A: Conectando GitHub a Vercel (Recomendado)
1. Ve a [vercel.com](https://vercel.com) e inicia sesión.
2. Pulsa en **"Add New... -> Project"**.
3. Selecciona tu repositorio de GitHub `gtrespana-bit/car`.
4. Vercel detectará automáticamente la configuración:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Pulsa en **"Deploy"**. En menos de 40 segundos tu aplicación estará publicada en producción con HTTPS gratuito y CDN global.

### Opción B: Mediante Vercel CLI
```bash
# Instalar Vercel CLI globalmente (si no lo tienes)
npm i -g vercel

# Desplegar desde la raíz del proyecto
vercel

# Desplegar a producción
vercel --prod
```

### Configuración incluida en el repositorio:
- `vercel.json`: Incluye las reglas de reescritura (`rewrites`) para Single-Page Applications (SPA), garantizando que cualquier recarga de página o enlace directo funcione sin errores 404.
- `package.json`: Scripts estándar `dev`, `build` y `preview`.
- `dist`: Compilación limpia verificada sin errores de TypeScript ni dependencias faltantes.

---

## 💻 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Previsualizar la compilación de producción
npm run preview
```

---

## 📚 Documentación Operativa y Legal

En el directorio `/docs` dispones de la biblioteca estratégica completa:

1. [`docs/01_GUIA_PRACTICA_IMPORTACION_CORUNA.md`](docs/01_GUIA_PRACTICA_IMPORTACION_CORUNA.md): Manual paso a paso para traer un coche de Alemania a A Coruña (trámites, matrículas provisionales, ITV y DGT).
2. [`docs/02_FISCALIDAD_Y_LEGALIDAD_PARTICULAR_VS_EMPRESA.md`](docs/02_FISCALIDAD_Y_LEGALIDAD_PARTICULAR_VS_EMPRESA.md): Aspectos tributarios de la Fase 1 (particular) vs Fase 2 (REBU, SL, garantías).
3. [`docs/03_ESTUDIO_MERCADO_Y_MODELOS_TOP_GALICIA.md`](docs/03_ESTUDIO_MERCADO_Y_MODELOS_TOP_GALICIA.md): Análisis de demanda en A Coruña, etiqueta ambiental, climatología y modelos más rentables.
4. [`docs/04_MODELOS_DE_CONTRATOS_Y_PLANTILLAS.md`](docs/04_MODELOS_DE_CONTRATOS_Y_PLANTILLAS.md): Modelos redactados de compraventa, recibos de reserva y cláusulas de vicios ocultos.
5. [`docs/05_ROADMAP_FASE_2_LOCAL_Y_PROFESIONALIZACION.md`](docs/05_ROADMAP_FASE_2_LOCAL_Y_PROFESIONALIZACION.md): Plan de negocio para dar el salto a local comercial en polígonos de A Coruña.
6. [`docs/06_GUIA_MOTORES_FIABILIDAD_Y_ROTACION.md`](docs/06_GUIA_MOTORES_FIABILIDAD_Y_ROTACION.md): Guía de motores roca vs lista negra (PureTech, BlueHDi, 1.2 TCe, EcoBoost pre-2020, N47, Ingenium).
7. [`docs/07_MATRIZ_MODELOS_GANADORES_VS_PROHIBIDOS.md`](docs/07_MATRIZ_MODELOS_GANADORES_VS_PROHIBIDOS.md): Matriz maestra por segmentos (Cupra Formentor, C-HR, Tucson, RAV4, Caddy, T6 150 CV, Duster 4x4, Mercedes 200d OM654, BMW Serie 1 F20 LCI, etc.).
