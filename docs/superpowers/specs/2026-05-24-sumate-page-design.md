# Spec — Página `/sumate` (hub institucional)

**Fecha:** 2026-05-24
**Branch:** `feat/page-sumate`
**Autor:** Gastón Costabella (con asistencia de Claude)

---

## Por qué existe esta página

Decisión de IA tomada con Gastón: el botón "Sumate" del header tiene un conflicto semántico cuando significa dos cosas distintas (sumate a la comunidad / sumate al equipo). Esas son audiencias diferentes:

- **Comunidad** = docentes, escuelas, investigadores. High volume, low commitment.
- **Equipo** = profesionales que quieren trabajar en ED. Low volume, high commitment.

Mezclarlos en un solo CTA confunde. La página `/sumate` resuelve esto como un **hub con 3 paths** desde el inicio.

Patrón inspirado en cómo orgs institucionales (Stripe, Notion, MIT Media Lab, Wikimedia Foundation) separan "Get started" de "Careers" sin sacrificar el CTA principal del header.

---

## Estructura de la página

```
/sumate
├── PageHeader        — eyebrow "Sumate" + h1 + bajada + patrón gráfico
├── PathSelector      — 3 cards con anchors (#comunidad, #equipo, #institucional)
├── SumateComunidad   #comunidad      — redes (placeholder hasta que lleguen URLs)
├── SumateEquipo      #equipo         — formulario de postulación (mailto MVP)
└── SumateInstitucional #institucional — CTA a /contacto
```

### Tono por sección

- **Comunidad:** cálido, masivo, conversacional. Foco en "encontranos donde la conversación está viva".
- **Equipo:** profesional, claro sobre qué busca ED. Form con validación + nota explícita sobre adjuntar CV.
- **Institucional:** sobrio, autoridad académica. NO pide datos acá — redirige a `/contacto` que tiene el form B2B.

---

## Decisiones de diseño

### Por qué un hub y no una sección en home

| Opción descartada | Por qué no |
|-------------------|------------|
| Sección "Carreras" en home | Inflaría el home con un use case secundario (5% de visitantes) |
| Tabs Comunidad/Equipo/Institución en home | Anti-pattern 2026: Google penaliza contenido en tabs ocultos |
| Página separada `/carreras` además de `/comunidad` | Fragmenta demasiado. El hub centraliza y deja al user elegir |

### Por qué mantener el label "Sumate"

El user (Gastón) eligió mantener "Sumate" como label ambiguo en el header y el hero, dejando que la página `/sumate` aclare los paths. Eso preserva la identidad del brand sin sacrificar UX (el hub adentro es 100% claro).

### Por qué mailto y no API + Resend

MVP. Permite que Daniela vea el form funcionando y reciba postulaciones ya, sin esperar setup de API keys ni decisiones sobre storage de CVs. Si más adelante el volumen lo justifica, se reemplaza el handler `onSubmit` por una API route con Resend (suma `resend` como dep + `RESEND_API_KEY` env var). El frontend del form queda igual.

### Limitación conocida del mailto

`mailto:` NO permite adjuntar archivos programáticamente. Por eso el form NO tiene field de upload de CV: hay una nota visible que indica al user adjuntar el CV manualmente al borrador de mail que se abre. Es estándar de la industria para forms institucionales sin backend (ej. la mayoría de las universidades públicas latinoamericanas usan este patrón).

---

## Archivos creados

```
src/app/sumate/page.tsx                                — ruta
src/features/sumate/
  ├── data/
  │   ├── paths.ts                                     — config de los 3 paths
  │   └── areas.ts                                     — opciones del dropdown área
  └── components/
      ├── PageHeader.tsx                               — hero institucional
      ├── PathSelector.tsx                             — 3 cards anchor
      ├── SumateComunidad.tsx                          — #comunidad
      ├── SumateEquipo.tsx                             — #equipo (wraps form)
      ├── SumateInstitucional.tsx                      — #institucional
      └── PostulacionForm.tsx                          — client component
```

## Archivos modificados (4 puntos de entrada)

| Archivo | Cambio |
|---------|--------|
| `src/config/site.ts` | Suma `contacto.emailPostulaciones` con email de Daniela |
| `src/components/layout/Header.tsx` | CTA "Sumate" ahora apunta a `/sumate` (antes `#comunidad`) |
| `src/features/home/components/Hero.tsx` | CTA primary ahora apunta a `/sumate` (label "Sumate" más corto) |
| `src/features/home/components/ComunidadRedes.tsx` | Suma CTA secondary "Conocé todas las formas de sumarte" → `/sumate` |
| `src/components/layout/Footer.tsx` | Suma 2 entries en navItems: "Sumate" y "Trabajá con nosotros" |

---

## Form de postulación — schema

| Campo | Tipo | Required | Notas |
|-------|------|----------|-------|
| Nombre y apellido | text | ✓ | minLength 2 |
| Email | email | ✓ | HTML5 validation |
| País | select | ✓ | Argentina, Chile, México (siteConfig.paises) + Colombia, Costa Rica, Otro |
| Área de interés | select | ✓ | 7 áreas en `data/areas.ts` |
| LinkedIn / portfolio | url | — | placeholder `https://` |
| Mensaje breve | textarea | — | max 500 chars con contador |

**Email destino:** `siteConfig.contacto.emailPostulaciones` = `daniela@empoderamientodocente.org`

**Subject del mail:** `Postulación — {nombre} — {area}`

**Body:** estructurado en bullets, profesional, con call-to-action explícito de "Adjunto mi CV a este correo".

**Estado post-submit:** muestra mensaje de éxito con instrucciones claras de adjuntar el CV + opción "Volver al formulario" si el mail no se abrió.

---

## Accesibilidad

- Labels asociados con `htmlFor`
- Validación HTML5 native (sin JS si reducedMotion)
- Focus rings con `outline-verde-concepto` 
- Mensaje de éxito anunciado por screen reader (`role="status"`)
- Required marcado con `*` naranja Y `required` HTML
- Required-fields contrast verificado

---

## Pendientes / decisiones abiertas

- [ ] **Daniela confirma** si quiere migrar a backend real (Resend + storage) o queda con mailto
- [ ] **Vacantes específicas:** por ahora "envío espontáneo". Si abrieran vacantes, sumamos lista filtrable arriba del form
- [ ] **Newsletter:** la sección Comunidad muestra solo redes + mailto. Cuando ED arme newsletter (Mailchimp/Resend Audiences), sumamos form de suscripción
- [ ] **Áreas de interés:** revisar con Daniela si la lista de `data/areas.ts` cubre bien lo que efectivamente buscan en RR.HH.

---

## Cómo retomar / qué testear

1. `pnpm dev` → http://localhost:3000/sumate
2. Probar el form: completar campos, submit → debe abrir el cliente de mail con body precargado
3. Probar los 4 puntos de entrada:
   - Header CTA "Sumate" desktop
   - Header mobile menu "Sumate"
   - Hero primary CTA "Sumate"
   - Home ComunidadRedes secondary CTA "Conocé todas las formas..."
4. Probar `prefers-reduced-motion` activado: animations desactivadas, form sigue funcional
5. Mobile responsive: PathSelector se apila vertical, form ocupa todo el ancho

Quality gates al cierre: typecheck ✓ · lint ✓ · runtime / · /sumate · /nosotros todos 200 OK.
