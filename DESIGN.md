# DESIGN.md — Empoderamiento Docente

Sistema de diseño para el sitio web institucional. Fuente: Manual de marca ED.
Este documento es la **fuente única de verdad** para tokens visuales: colores,
tipografías, jerarquía, espaciado e iconografía.

> Logo y reglas de aplicación de marca (cards, RRSS, papelería) **se definirán
> aparte** y pueden diferir del manual original. Este archivo cubre lo que el
> sitio web necesita.

---

## 1. Paleta cromática

### Tokens

| Token            | Hex       | RGB              | Rol                                              |
| ---------------- | --------- | ---------------- | ------------------------------------------------ |
| `azul-principal` | `#1F2A44` | 31, 42, 68       | Base, fondos oscuros, títulos sobre claro        |
| `azul-medio`     | `#4A6FA5` | 74, 111, 165     | Acentos en titulares, links, subtítulos          |
| `azul-claro`     | `#A9C5E8` | 169, 197, 232    | Fondos suaves, estados hover en superficies      |
| `verde-concepto` | `#3E7C6D` | 62, 124, 109     | Conceptos, palabras clave, highlights de texto   |
| `naranja-accion` | `#E07A2F` | 224, 122, 47     | **Solo CTAs**: botones primarios, links de acción|
| `gris-fondo`     | `#F2F4F7` | 242, 244, 247    | Fondo claro alternativo a blanco                 |
| `gris-texto`     | `#6B7280` | 107, 114, 128    | Texto secundario, metadatos, captions            |

### Reglas de uso (no negociables)

1. **Azul es la base.** Toda página parte de azul (oscuro o claro).
2. **Naranja solo para acciones.** Botones primarios, "Inscribite", "Descargar
   programa", "Sumate". Nunca como decoración o fondo de sección.
3. **Verde para conceptos.** Resaltar palabras clave dentro de un titular,
   highlights tipo marcador, íconos conceptuales. Nunca compitiendo con naranja
   en el mismo bloque visual.
4. **Verde y naranja no conviven en primer plano.** Si hay un CTA naranja, el
   verde se reserva para texto/íconos lejos del CTA.
5. **Contraste mínimo:** texto sobre fondo debe pasar WCAG AA (4.5:1 cuerpo,
   3:1 títulos grandes).

### Uso semántico (mapeo a la marca)

- **Pensamiento** → verde
- **Acción** → naranja
- **Identidad / institucional** → azul

---

## 2. Tipografía

| Uso        | Fuente            | Peso     |
| ---------- | ----------------- | -------- |
| Títulos    | **Manrope**       | 700 Bold |
| Subtítulos | **Manrope**       | 500 Medium |
| Cuerpo     | **Inter**         | 400 Regular |
| UI / botones | **Inter**       | 500 Medium |

Ambas son fuentes variables disponibles en Google Fonts → cargar via
`next/font/google` con `display: 'swap'` y subset `latin`.

### Escala tipográfica recomendada

Diseñada para móvil-primero. Usar `clamp()` o las utilidades fluidas de
Tailwind v4 para el rango fluido. Valores en rem, base 16px.

| Token          | Mobile      | Desktop     | Uso                          |
| -------------- | ----------- | ----------- | ---------------------------- |
| `text-display` | 2.5rem / 1.1| 4.5rem / 1.05 | Hero principal             |
| `text-h1`      | 2rem / 1.15 | 3rem / 1.1  | H1 de página                 |
| `text-h2`      | 1.5rem / 1.2| 2.25rem / 1.15 | Títulos de sección        |
| `text-h3`      | 1.25rem / 1.3 | 1.5rem / 1.25 | Subtítulos                |
| `text-body`    | 1rem / 1.6  | 1.125rem / 1.6 | Párrafos                  |
| `text-small`   | 0.875rem / 1.5 | 0.875rem / 1.5 | Captions, metadatos     |

**Reglas:**
- Títulos en Manrope Bold con `letter-spacing: -0.01em` (los displays más
  grandes con `-0.02em`).
- Cuerpo en Inter, `letter-spacing: 0`, `line-height: 1.6` mínimo.
- Evitar mayúsculas para textos largos. Mayúsculas con `tracking-wider` están
  ok para tags, eyebrows o etiquetas cortas.

---

## 3. Espaciado y layout

- Sistema base: **4px** (0.25rem). Usar la escala default de Tailwind.
- Contenedor máximo de contenido: `max-w-screen-xl` (1280px). Para texto largo,
  bajar a `max-w-prose` o `max-w-3xl`.
- Padding lateral en mobile: `px-5` (20px); desktop `px-8` o más.
- Separación entre secciones grandes: `py-20` desktop / `py-12` mobile.

---

## 4. Bordes y sombras

- Border radius por defecto: `rounded-xl` (12px) para tarjetas, `rounded-lg`
  para inputs, `rounded-full` para botones tipo pill (solo si la marca lo pide;
  default es `rounded-lg` para botones).
- Sombras: usar con moderación. Preferir borders sutiles (`border
  border-azul-claro/40`) sobre sombras pesadas. Sombra estándar para tarjetas
  elevadas: `shadow-md` con tinte azul (`shadow-azul-principal/10`).

---

## 5. Iconografía

- **Estilo:** línea (outline), trazo de 1.5–2px, esquinas redondeadas suaves.
- **Color por defecto:** `azul-principal`. Sobre fondos oscuros: blanco.
- **Tamaño:** 20px (inline en texto), 24px (UI), 48–64px (íconos de feature).
- **Librería sugerida:** [Lucide](https://lucide.dev/) (línea, consistente con
  el manual de marca, MIT, tree-shakeable). Si un ícono no existe en Lucide,
  vectorizar manualmente respetando el estilo.

Conceptos recurrentes en la marca (del manual): bombilla (ideas), libro
(formación), personas (comunidad), diana con flecha (objetivos), gráfico
(crecimiento). Mapearlos cuando aplique.

---

## 6. Patrón gráfico

La marca tiene un **patrón de puntos** (grid de dots grises) que aparece
combinado con formas circulares planas. Para web:

- Implementar como SVG inline o `background-image` con `radial-gradient`.
- Usar como fondo decorativo en hero, separadores y portadas de sección, sin
  saturar.
- Color de los puntos: `gris-texto` al 30–40% de opacidad sobre fondo claro,
  blanco al 10–15% sobre fondo azul.

---

## 7. Componentes guía

### Botón primario (CTA)

- Fondo: `naranja-accion`
- Texto: blanco, Inter Medium
- Hover: oscurecer 10%
- Padding: `px-6 py-3`, `rounded-lg`
- Solo uno por sección visible cuando se pueda; jamás dos botones naranjas
  compitiendo.

### Botón secundario

- Fondo: transparente
- Borde: `azul-principal`
- Texto: `azul-principal`
- Hover: fondo `azul-claro/30`

### Tarjeta de contenido

- Fondo: blanco o `gris-fondo`
- Borde sutil opcional
- Radius: `rounded-xl`
- Padding: `p-6` mobile, `p-8` desktop

### Highlight de palabra clave (estilo marca)

Marcador verde detrás de palabra clave en titulares — efecto característico
del manual:

```
<span class="bg-verde-concepto/30 px-1 -mx-1">palabra</span>
```

Reservar para una palabra por titular, no abusar.

---

## 8. Mapeo a Tailwind

Cuando se inicialice el proyecto, los tokens van a `tailwind.config` (v3) o al
bloque `@theme` de `globals.css` (v4). Snippet de referencia para v4:

```css
@theme {
  --color-azul-principal: #1F2A44;
  --color-azul-medio: #4A6FA5;
  --color-azul-claro: #A9C5E8;
  --color-verde-concepto: #3E7C6D;
  --color-naranja-accion: #E07A2F;
  --color-gris-fondo: #F2F4F7;
  --color-gris-texto: #6B7280;

  --font-display: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

---

## 9. Tono visual general

- **Sobrio, profesional, cálido.** ED dialoga con profesionales de la educación.
  Evitar estética infantil, ilustraciones de niños caricaturescos, o gradientes
  agresivos.
- **Minimalismo con propósito.** Espacio en blanco generoso. El faro y el haz
  de luz son la metáfora principal — la luz del faro puede inspirar elementos
  sutiles de gradiente azul claro, pero sin exagerar.
- **Movimiento contenido (GSAP + Lenis).** Animaciones suaves, transiciones
  largas (400–800ms), easing tipo `power2.out`. Nada de bounces ni efectos
  llamativos. La animación acompaña la lectura, no la interrumpe.
