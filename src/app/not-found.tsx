import Link from 'next/link';
import { ArrowLeft, Compass, SearchX } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function NotFound() {
  return (
    <section
      className={`${spaceGrotesk.className} relative isolate flex min-h-screen items-center overflow-hidden bg-slate-950 px-6 py-16 text-white`}
    >
      <div className="pointer-events-none absolute -left-28 -top-24 h-80 w-80 rounded-full bg-green_details-greenFluorescent/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium tracking-[0.2em] text-green_details-greenFluorescent">
            <SearchX className="h-4 w-4" />
            ERRO INESPERADO ACONTECEU...
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
            Esta página não foi encontrada
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            O link pode estar desatualizado, removido ou a rota pode estar
            temporariamente indisponível.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-green_details-greenFluorescent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              <Compass className="h-4 w-4" />
              Ir para o cardápio
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/15 bg-slate-900/70 p-7 shadow-2xl backdrop-blur-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green_details-greenFluorescent">
            O que fazer agora
          </p>
          <ul className="mt-5 space-y-4 text-sm text-slate-200">
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Confirme se o endereço foi digitado corretamente.
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Atualize a página ou tente novamente em alguns minutos.
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
