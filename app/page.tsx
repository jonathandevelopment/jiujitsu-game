import Link from "next/link";

const features = [
  {
    title: "Reflejos en tiempo real",
    description:
      "Rounds cortos con timers que se achican cada vez que sumás score. Ideal para calentar antes del open mat.",
  },
  {
    title: "Progresión de cinturón",
    description:
      "Ganá XP en cada contra, avanzá de blanco a negro y reiniciá cuando quieras sin perder tus skills.",
  },
  {
    title: "Feedback inmersivo",
    description:
      "Sonidos, vibraciones opcionales y mensajes del coach para que sientas un roll sin salir del browser.",
  },
  {
    title: "Integración simple",
    description:
      "Next.js App Router + TypeScript + Tailwind 4 + Framer Motion. Sin dependencias extra.",
  },
];

const steps = [
  {
    step: "01",
    title: "Entrá al tatami",
    copy: "Visitá /bjj y tocá “Start Roll”. No hay registro ni ajustes previos.",
  },
  {
    step: "02",
    title: "Reaccioná",
    copy: "Elegí la contra correcta (tap o 1/2/3) antes de que el reloj llegue a cero.",
  },
  {
    step: "03",
    title: "Escalá cinturones",
    copy: "Sumá puntos, recuperá stamina y desbloqueá cinturones cada 100 XP.",
  },
];

const playTips = [
  "El oponente tira Pase, Barrido o Sumisión.",
  "Respondé con la contra correcta usando los botones o las teclas 1/2/3.",
  "Cuidá la barra de stamina: si llega a cero se termina la sesión.",
  "Podés pausar y ajustar sonidos/haptics desde Ajustes.",
];

const counterRules = [
  { attack: "Pase de guardia", losesTo: "Barrido" },
  { attack: "Barrido", losesTo: "Sumisión" },
  { attack: "Sumisión", losesTo: "Pase de guardia" },
];

const heroStats = [
  { label: "Reacción promedio", value: "2.1s" },
  { label: "Cinturones simulados", value: "5" },
  { label: "Inputs soportados", value: "Tap + 1/2/3" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
        <Hero />
        <HowItWorks />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="space-y-5 rounded-3xl border border-white/5 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
        Grip State Lab · Mini-game
      </p>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold leading-tight text-white">
          Entrená reflejos BJJ desde tu teléfono.
        </h1>
        <p className="text-base text-neutral-300">
          Timers dinámicos, feedback inmediato y progreso de cinturones. Listo para integrar en tu
          proyecto Next.js sin configuraciones extras.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/bjj"
          className="rounded-2xl bg-white/95 px-6 py-3 text-center font-semibold text-neutral-900 transition hover:bg-white"
        >
          Jugar ahora
        </Link>
        <a
          href="#como-funciona"
          className="rounded-2xl border border-white/30 px-6 py-3 text-center text-sm font-semibold text-neutral-100 transition hover:bg-white/10"
        >
          Cómo funciona
        </a>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Cómo jugar
        </p>
      </div>  
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/5 bg-neutral-900/40 p-5">
          <h3 className="text-xl font-semibold text-white">Instrucciones</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-400">
            {playTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-white/5 bg-neutral-900/40 p-5">
          <h3 className="text-xl font-semibold text-white">
            Reglas de contraataque
          </h3>
          <ul className="mt-4 space-y-3 text-neutral-200">
            {counterRules.map((rule) => (
              <li
                key={rule.attack}
                className="rounded-2xl border border-white/10 bg-neutral-950/40 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-white">{rule.attack}</span>{" "}
                pierde contra{" "}
                <span className="font-semibold text-[#f97316]">
                  {rule.losesTo}
                </span>
                .
              </li>
            ))}
          </ul>
        </article>
        <Link
          href="/bjj"
          className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-black"
        >
          Lanzar mini-game
        </Link>
      </div>
    </section>
  );
}


 
