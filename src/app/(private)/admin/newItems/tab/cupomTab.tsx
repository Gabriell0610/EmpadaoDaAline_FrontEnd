import { TitleH3 } from '@/components/Titles/Titles';
import { ShieldCheck } from 'lucide-react';

export function CupomTab() {
  return (
    <section className="rounded-xl border border-text-primary/10 bg-neutral-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 text-green-700" size={18} />
        <div>
          <TitleH3 className="mb-1">Adicione um cupom</TitleH3>
          <p className="text-sm text-text-secondary">
            Sessão ainda em construção...
          </p>
        </div>
      </div>
    </section>
  );
}
