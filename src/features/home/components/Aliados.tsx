import { Eyebrow } from "@/components/ui/Eyebrow";

type Aliado = {
  nombre: string;
  detalle: string;
};

const aliados: readonly Aliado[] = [
  {
    nombre: "TECHINT",
    detalle:
      "Alianza estratégica para la innovación educativa y el desarrollo de comunidades.",
  },
  {
    nombre: "Gen Técnico Roberto Rocca",
    detalle:
      "Fortalecimiento de la educación técnica y el desarrollo de competencias.",
  },
  {
    nombre: "Escuelas Técnicas Roberto Rocca",
    detalle: "Acompañamiento integral a las escuelas técnicas de la red.",
  },
  {
    nombre: "Ministerio de Educación de CABA",
    detalle:
      "Asesoría general para la mejora educativa en el área de matemáticas de manera transversal.",
  },
  {
    nombre: "Bloom",
    detalle:
      "Construcción de dispositivos de desarrollo profesional docente masivos.",
  },
  {
    nombre: "Redes y comunidades",
    detalle:
      "Docentes, directivos, investigadores y universidades en América Latina.",
  },
];

export function Aliados() {
  return (
    <section
      data-section="aliados"
      className="bg-gris-fondo relative py-24 md:py-32"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        005 / Alianzas
      </span>

      {/* Decoración: círculo verde grande abajo derecha */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/[0.06] absolute -right-32 -bottom-32 z-0 h-[28rem] w-[28rem] rounded-full"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-anim="aliados-intro">
            <Eyebrow>Trabajamos en alianza</Eyebrow>
            <h2
              className="font-display text-azul-principal mt-6 leading-[1.04] font-bold tracking-[-0.018em]"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.25rem)" }}
            >
              Construimos con quienes mueven la educación.
            </h2>
          </div>
          <p
            data-anim="aliados-intro-text"
            className="text-gris-texto font-sans text-[0.98rem] leading-relaxed md:col-span-5 md:text-right"
          >
            Empresas, ministerios, escuelas y redes con las que sostenemos
            proyectos de transformación educativa en Latinoamérica.
          </p>
        </div>

        <ul
          data-anim="aliados-grid"
          className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3"
        >
          {aliados.map(({ nombre, detalle }) => (
            <li
              key={nombre}
              className="group border-azul-principal/10 hover:border-verde-concepto/60 hover:shadow-azul-principal/10 relative flex flex-col border-l-2 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-display text-azul-principal text-[1.05rem] leading-tight font-bold tracking-[-0.005em] md:text-[1.15rem]">
                {nombre}
              </h3>
              <p className="text-gris-texto mt-3 font-sans text-[0.9rem] leading-relaxed">
                {detalle}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
