# SECURITY.md — Política de seguridad

## Cómo reportar una vulnerabilidad

**No abras un issue público.** Los issues son visibles para cualquiera que
pase por el repo y eso convertiría un problema chico en uno grande.

Reportá vulnerabilidades por uno de estos canales privados:

1. **GitHub Private Vulnerability Reporting** — botón "Report a vulnerability"
   en la pestaña [Security](https://github.com/BriarDevv/Empoderamiento-Docente/security/advisories)
   del repo. Es la vía preferida porque queda registro y permite respuesta
   coordinada.
2. **Mail directo:** `contacto@empoderamientodocente.org` con asunto
   `[SECURITY] <resumen corto>`.

**Qué incluir:**

- Descripción del problema (qué se puede hacer que no debería poderse).
- Pasos para reproducir, o proof-of-concept.
- Impacto estimado (qué información o acción queda expuesta).
- Versión / commit en el que aparece.

**Tiempos esperados:**

- Acuse de recibo: dentro de 5 días hábiles.
- Triaging y plan: dentro de 14 días.
- Patch: depende de la severidad. Críticas y altas se priorizan.

---

## Alcance

Esta política cubre **el sitio público de Empoderamiento Docente y su
código fuente en este repo**. Incluye:

- El sitio Next.js (frontend, server components, route handlers).
- La capa de acceso a MongoDB.
- Configuración de build y deploy.
- Cualquier endpoint público que se publique desde este código.

**No cubre:**

- Sistemas o cuentas operados por el cliente fuera de este repositorio.
- Servicios de terceros (Vercel, Atlas, Google Fonts, etc.). Reportá esos
  problemas directamente a los proveedores correspondientes.

---

## Principios de seguridad del proyecto

Estos son los principios de fondo. Detalle operativo en
[`docs/AI_GUIDELINES.md`](docs/AI_GUIDELINES.md) §8 y §12 + en
[`AGENTS.md`](AGENTS.md) §5 / §7.

1. **Secrets nunca en el código.** Tokens, credenciales de Mongo, claves
   de API viven en variables de entorno (`.env.local` en dev, configuración
   de hosting en prod). El archivo `.env.example` documenta qué variables
   espera el código sin exponer valores reales.
2. **Validación en bordes.** Todo input externo (formularios, query params,
   body de API) se valida con Zod antes de tocar la DB o renderizar.
3. **Manejo de errores sin sobreexposición.** Loguear server-side el detalle,
   devolver un mensaje genérico al cliente. Nunca propagar stack traces ni
   shapes internos de la base.
4. **Dependencias auditables.** Cualquier `pnpm add` pasa por OK humano
   (`AGENTS.md` §5.6). El lockfile (`pnpm-lock.yaml`) se commitea y CI lo
   usa con `--frozen-lockfile`.
5. **Branch protection en `main`.** Linear history, sin force-push, sin
   delete, conversaciones resueltas, merge solo por PR (`AGENTS.md` §5.7).

---

## Datos del cliente

El sitio puede manejar:

- Datos institucionales públicos (mail de contacto, dirección).
- En el futuro: CVs enviados vía formulario, inscripciones a formaciones.

Los datos del segundo grupo se tratan como **PII**: se cifran en tránsito
(HTTPS obligatorio en producción), no se loguean en claro, y solo el
equipo con acceso operativo al backend puede leerlos.

Si descubrís una exposición de PII, **tratá el reporte como crítico** y
seguí el canal privado de arriba.
