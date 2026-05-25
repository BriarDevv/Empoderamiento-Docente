"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { AREAS_INTERES } from "../data/areas";
import { ArrowRight } from "@/components/ui/icons";

const PAISES = [
  ...siteConfig.paises,
  "Colombia",
  "Costa Rica",
  "Otro",
] as const;

/**
 * Formulario de postulación al equipo de ED.
 *
 * IMPLEMENTACIÓN MVP — mailto (sin backend):
 * Al submit, construye un mailto con los datos precargados y abre el
 * cliente de mail del usuario. El user adjunta el CV manualmente antes
 * de enviar. Trade-off conocido: depende de que el user tenga mail
 * client configurado. Cuando Daniela confirme stack de backend
 * (Resend / SMTP / API custom), reemplazar el handler `onSubmit`.
 *
 * Accesibilidad: labels asociados, validación HTML5 native, focus visible,
 * mensaje de éxito anunciado por screen reader (`role="status"`).
 */
export function PostulacionForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pais, setPais] = useState<string>(PAISES[0]);
  const [area, setArea] = useState<string>(AREAS_INTERES[0]);
  const [linkedin, setLinkedin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const subject = `Postulación — ${nombre.trim()} — ${area}`;
    const body = [
      `Hola Daniela,`,
      ``,
      `Me gustaría postularme para trabajar con Empoderamiento Docente.`,
      ``,
      `Datos de contacto:`,
      `• Nombre: ${nombre.trim()}`,
      `• Email: ${email.trim()}`,
      `• País: ${pais}`,
      `• Área de interés: ${area}`,
      linkedin.trim() ? `• LinkedIn / portfolio: ${linkedin.trim()}` : null,
      ``,
      mensaje.trim() ? `Mensaje:\n${mensaje.trim()}\n` : null,
      `Adjunto mi CV a este correo.`,
      ``,
      `Saludos,`,
      nombre.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoUrl = `mailto:${siteConfig.contacto.emailPostulaciones}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Abre el cliente de mail del user con todo precargado.
    window.location.href = mailtoUrl;
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div
        role="status"
        className="border-verde-concepto/40 bg-verde-concepto/[0.06] rounded-2xl border p-8 md:p-10"
      >
        <p className="text-verde-concepto font-sans text-[0.72rem] font-medium tracking-[0.26em] uppercase">
          Tu cliente de mail se abrió
        </p>
        <h3 className="font-display text-azul-principal mt-3 text-[1.4rem] leading-tight font-medium md:text-[1.65rem]">
          Adjuntá tu CV y enviá el mensaje
        </h3>
        <p className="text-gris-texto mt-4 font-sans text-[0.95rem] leading-relaxed">
          Te abrimos un borrador en tu aplicación de mail con todos los datos
          precargados. Solo tenés que <strong>adjuntar tu CV en PDF</strong>{" "}
          (máx. 5 MB recomendado) y enviarlo. Te respondemos en un plazo de
          hasta 14 días hábiles.
        </p>
        <p className="text-gris-texto mt-4 font-sans text-[0.88rem]">
          ¿No se abrió el mail?{" "}
          <button
            type="button"
            onClick={() => setEnviado(false)}
            className="text-verde-concepto hover:text-azul-principal underline decoration-2 underline-offset-2"
          >
            Volvé al formulario
          </button>{" "}
          o escribinos a{" "}
          <a
            href={`mailto:${siteConfig.contacto.emailPostulaciones}`}
            className="text-azul-principal decoration-verde-concepto underline decoration-2 underline-offset-2"
          >
            {siteConfig.contacto.emailPostulaciones}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-azul-principal/10 rounded-2xl border bg-white p-7 md:p-10"
      noValidate
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <Field label="Nombre y apellido" htmlFor="nombre" required>
          <input
            id="nombre"
            type="text"
            required
            minLength={2}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <Field label="Email" htmlFor="email" required>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputClass}
          />
        </Field>

        <Field label="País" htmlFor="pais" required>
          <select
            id="pais"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            className={selectClass}
          >
            {PAISES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Área de interés" htmlFor="area" required>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={selectClass}
          >
            {AREAS_INTERES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="LinkedIn / portfolio (opcional)"
          htmlFor="linkedin"
          className="md:col-span-2"
        >
          <input
            id="linkedin"
            type="url"
            placeholder="https://"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            autoComplete="url"
            className={inputClass}
          />
        </Field>

        <Field
          label="Mensaje breve (opcional)"
          htmlFor="mensaje"
          className="md:col-span-2"
        >
          <textarea
            id="mensaje"
            rows={4}
            maxLength={500}
            placeholder="Contanos por qué te interesa sumarte, en qué proyectos te gustaría aportar, o cualquier cosa que quieras destacar."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className={`${inputClass} resize-none leading-relaxed`}
          />
          <p className="text-gris-texto mt-1 text-right font-sans text-[0.75rem]">
            {mensaje.length} / 500
          </p>
        </Field>
      </div>

      {/* Nota sobre el CV (no se puede adjuntar archivos vía mailto) */}
      <div className="bg-azul-claro/[0.18] mt-7 rounded-lg p-4 md:p-5">
        <p className="text-azul-principal font-sans text-[0.88rem] leading-relaxed">
          <strong className="font-semibold">Sobre tu CV:</strong> al enviar este
          formulario te abrimos un borrador en tu aplicación de mail.{" "}
          <strong className="font-semibold">
            Adjuntá tu CV en PDF a ese correo antes de enviarlo
          </strong>{" "}
          (máx. 5 MB recomendado).
        </p>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-gris-texto font-sans text-[0.82rem]">
          Te respondemos en hasta 14 días hábiles.
        </p>

        <button
          type="submit"
          className="btn-premium bg-naranja-accion hover:bg-naranja-accion/95 hover:shadow-naranja-accion/30 focus-visible:outline-naranja-accion relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-7 py-3 font-sans text-[0.95rem] font-medium text-white transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="btn-sheen" aria-hidden="true" />
          <span className="relative z-[1]">Enviar postulación</span>
          <span className="btn-ico relative z-[1]" aria-hidden="true">
            <span className="btn-ico__main">
              <ArrowRight size={16} />
            </span>
            <span className="btn-ico__ghost">
              <ArrowRight size={16} />
            </span>
          </span>
        </button>
      </div>
    </form>
  );
}

/* ────────────────────────────────────────────────────────────────── */

const inputClass =
  "border-azul-principal/15 focus:border-verde-concepto focus:ring-verde-concepto/20 w-full rounded-lg border bg-white px-4 py-2.5 font-sans text-[0.95rem] text-azul-principal transition-colors focus:outline-none focus:ring-4 placeholder:text-gris-texto/60";

const selectClass = `${inputClass} appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

function Field({
  label,
  htmlFor,
  children,
  required,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-azul-principal/85 font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase"
      >
        {label}
        {required && <span className="text-naranja-accion ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
