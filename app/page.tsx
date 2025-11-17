import Link from "next/link";

const features = [
  {
    title: "Reflejos en tiempo real",
    description:
      "Rounds rápidos con ventanas que se acortan conforme subís el score. Perfecto para calentar antes del open mat.",
  },
  {
    title: "Progresión de cinturón",
    description:
      "Ganás XP en cada contra exitosa y desbloqueás cinturones hasta llegar al negro. La barra se resetea, tus skills no.",
  },
  {
    title: "Feedback inmersivo",
    description:
      "Sonidos, haptics opcionales y coach cues animados para que se sienta como un round en vivo.",
  },
  {
    title: "Pensado para móvil",
    description:
      "Botones ≥44px, accesibles con una mano y compatibles con taps y atajos 1/2/3 en desktop.",
  },
];

const steps = [
  {
    step: "01",
    title: "Entrá al tatami virtual",
    copy:
      "Visitá /bjj para cargar el mini-game. No requiere registro ni configuración extra.",
  },
  {
    step: "02",
    title: "Seguime la señal",
    copy:
      "El oponente tira Pass / Sweep / Submission. Elegí la contra correcta antes de que el tiempo llegue a cero.",
  },
  {
    step: "03",
    title: "Pulí tu timing",
    copy:
      "Subí el high score, desbloqueá cinturones y ajustá sonidos/haptics desde el drawer de settings.",
  },
];

const playTips = [
  "El oponente tira Pase, Barrido o Sumisión.",
  "Respondé con la contra correcta usando los botones o las teclas 1/2/3 antes de que se agote el timer.",
  "Cuidá tu stamina: si llega a cero se termina el round.",
  "Podés pausar cuando quieras y ajustar sonidos/haptics en Ajustes.",
];

const counterRules = [
  { attack: "Pase de guardia", losesTo: "Barrido" },
  { attack: "Barrido", losesTo: "Sumisión" },
  { attack: "Sumisión", losesTo: "Pase de guardia" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16 sm:px-10 lg:px-0">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-10 rounded-3xl border border-white/5 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1.7fr,1fr]">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
          BJJ Mini-Game • Next.js + TS
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Entrená tus reflejos de jiujitsu sin salir del browser.
        </h1>
        <p className="text-lg text-neutral-300">
          Construimos un micro‑juego inspirado en las transiciones de un roll.
          Con timers, puntuación, progresión de cinturones y un skin oscuro al
          puro estilo Grip State. Ideal para demos, streams o simplemente
          calentar antes del entrenamiento.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/bjj"
            className="rounded-2xl bg-white/95 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-white"
          >
            Jugar ahora
          </Link>
          <a
            href="#como-funciona"
            className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-white/10"
          >
            Cómo funciona
          </a>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
        <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
          <span>Coach dashboard</span>
          <span>Tiempo real</span>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Score actual
            </p>
            <p className="text-4xl font-bold">27</p>
            <div className="mt-4 h-2 rounded-full bg-neutral-800">
              <div className="h-full rounded-full bg-[#A32C2C]" style={{ width: "78%" }} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniStat label="Stamina" value="72%" />
            <MiniStat label="High Score" value="41" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4">
            <p className="text-sm text-neutral-400">Coach dice:</p>
            <p className="text-lg font-medium">
              “Seguís arriba. La próxima contra en <span className="text-[#f97316]">0.8s</span>.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Features() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Features clave
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Todo lo necesario para vender la experiencia.
        </h2>
        <p className="text-neutral-400">
          Componentizado en Next.js 13/14 App Router, con Framer Motion,
          TypeScript y Tailwind listos para extender.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6 shadow-lg shadow-black/30"
          >
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-neutral-400">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Cómo jugar
        </p>
        <h2 className="text-3xl font-semibold text-white">
          3 pasos para entrar al flow.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <article
            key={item.step}
            className="rounded-3xl border border-white/5 bg-neutral-900/40 p-5"
          >
            <p className="text-sm font-semibold text-[#f97316]">{item.step}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-neutral-400">{item.copy}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6">
          <h3 className="text-xl font-semibold text-white">Instrucciones</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-400">
            {playTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-white/5 bg-neutral-900/40 p-6">
          <h3 className="text-xl font-semibold text-white">
            Reglas de contraataque
          </h3>
          <ul className="mt-4 space-y-3 text-neutral-200">
            {counterRules.map((rule) => (
              <li
                key={rule.attack}
                className="rounded-2xl border border-white/10 bg-neutral-950/40 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-white">
                  {rule.attack}
                </span>{" "}
                pierde contra{" "}
                <span className="font-semibold text-[#f97316]">
                  {rule.losesTo}
                </span>
                .
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="rounded-3xl border border-white/5 bg-gradient-to-r from-[#A32C2C] to-[#f97316] p-10 text-neutral-900">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-900/80">
          listo para rodar
        </p>
        <h2 className="text-3xl font-semibold">
          Abrí /bjj y poné a prueba tu timing.
        </h2>
        <p className="text-lg text-neutral-900/80">
          El mini-game corre 100% client-side, lista la animación y los sonidos.
          Ideal para mostrar en demos o para tus alumnos.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/bjj"
          className="rounded-2xl bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:bg-black"
        >
          Lanzar mini-game
        </Link>
        <a
          href="mailto:hello@bjj.gg"
          className="rounded-2xl border border-neutral-900 px-6 py-3 font-semibold text-neutral-900 transition hover:bg-neutral-900/10"
        >
          Hablar para custom
        </a>
      </div>
    </section>
  );
}
