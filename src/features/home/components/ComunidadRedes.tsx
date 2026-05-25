"use client";

import { useState, type FormEvent } from "react";
import {
  Instagram,
  Linkedin,
  Facebook,
  MailOutline,
  ArrowRight,
} from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";

const redesMap = {
  instagram: { label: "Instagram", Icon: Instagram },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  facebook: { label: "Facebook", Icon: Facebook },
} as const;

type RedKey = keyof typeof redesMap;

export function ComunidadRedes() {
  const redes = siteConfig.redes;
  const activas = (Object.keys(redesMap) as RedKey[]).filter((k) =>
    Boolean(redes[k]),
  );
  const hayRedes = activas.length > 0;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();

    // Validación básica de formato
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setError("Ingresá un correo válido.");
      return;
    }

    setStatus("loading");
    setError("");

    // TODO: integrar con servicio (Mailchimp / ConvertKit / Beehiiv / etc.)
    // Por ahora simula éxito local.
    setTimeout(() => {
      setStatus("ok");
      setEmail("");
    }, 600);
  };

  return (
    <section
      id="comunidad"
      data-section="comunidad"
      className="relative overflow-hidden bg-white py-28 md:py-40"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-10 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        006 <span className="text-naranja-accion">/</span> Comunidad
      </span>

      {/* Composición canónica — esquina inferior izquierda */}
      <span
        aria-hidden="true"
        className="pattern-dots absolute bottom-20 left-20 hidden h-44 w-44 md:block"
      />
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute -bottom-32 -left-24 z-0 hidden h-[22rem] w-[22rem] rounded-full md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow dashClass="w-14">Newsletter</Eyebrow>
          <h2
            className="font-display text-azul-principal mt-7 leading-[1.04] font-bold tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.25rem, 5.2vw, 4rem)" }}
          >
            Recibí <span className="text-verde-concepto">novedades</span> en tu
            correo.
          </h2>
          <p className="text-gris-texto mx-auto mt-6 max-w-xl font-sans text-[1rem] leading-relaxed md:text-[1.08rem]">
            Reflexiones, recursos y novedades de la comunidad docente que piensa
            la matemática escolar. Sin spam, baja en cualquier momento.
          </p>
        </div>

        {/* Formulario de suscripción */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-12 max-w-xl"
          aria-labelledby="newsletter-title"
        >
          <h3 id="newsletter-title" className="sr-only">
            Suscripción al newsletter
          </h3>

          {status === "ok" ? (
            <div className="border-verde-concepto/40 bg-verde-concepto/10 flex items-center gap-3 rounded-xl border px-5 py-5 md:px-6">
              <span
                aria-hidden="true"
                className="bg-verde-concepto inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white"
              >
                <MailOutline size={16} />
              </span>
              <div>
                <p className="text-azul-principal font-display text-[1.05rem] leading-tight font-bold">
                  ¡Listo, ya estás dentro!
                </p>
                <p className="text-gris-texto mt-1 font-sans text-[0.88rem]">
                  Vas a recibir las próximas novedades en tu correo.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Correo electrónico
                </label>
                <div className="relative flex-1">
                  <span
                    aria-hidden="true"
                    className="text-gris-texto pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
                  >
                    <MailOutline size={18} />
                  </span>
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="border-azul-principal/20 text-azul-principal placeholder:text-gris-texto/60 focus:border-verde-concepto focus:ring-verde-concepto/20 w-full rounded-lg border bg-white py-4 pr-4 pl-12 font-sans text-[0.98rem] transition-colors focus:ring-4 focus:outline-none"
                    aria-invalid={status === "error"}
                    aria-describedby={
                      status === "error" ? "newsletter-error" : undefined
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-naranja-accion hover:bg-naranja-accion/90 inline-flex items-center justify-center gap-2 rounded-lg px-7 py-4 font-sans text-[0.95rem] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Enviando..." : "Suscribirme"}
                  {status !== "loading" && (
                    <ArrowRight size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              {status === "error" && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="text-naranja-accion mt-3 font-sans text-[0.85rem]"
                >
                  {error}
                </p>
              )}
              <p className="text-gris-texto mt-3 text-center font-sans text-[0.78rem] sm:text-left">
                Al suscribirte aceptás recibir correos de Empoderamiento
                Docente. No compartimos tu correo.
              </p>
            </>
          )}
        </form>

        {/* Sub-bloque: también seguinos en redes (si hay activas) */}
        {hayRedes && (
          <div className="border-azul-principal/10 mx-auto mt-16 flex max-w-xl flex-col items-center gap-4 border-t pt-8 sm:flex-row sm:justify-center md:mt-20">
            <span className="text-gris-texto font-sans text-[0.78rem] font-medium tracking-[0.18em] uppercase">
              También seguinos en
            </span>
            <ul className="flex items-center gap-3">
              {activas.map((key) => {
                const { label, Icon } = redesMap[key];
                const url = redes[key];
                if (!url) return null;
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:text-verde-concepto inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Fallback de contacto directo si NO hay redes y querés
            mantener el canal abierto */}
        {!hayRedes && (
          <p className="text-gris-texto mt-16 text-center font-sans text-[0.88rem] md:mt-20">
            ¿Preferís escribirnos directo?{" "}
            <a
              href={`mailto:${siteConfig.contacto.email}`}
              className="text-azul-principal hover:text-verde-concepto font-medium underline-offset-2 transition-colors hover:underline"
            >
              {siteConfig.contacto.email}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
