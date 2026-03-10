import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackPageButton() {
  const navigate = useRouter();
  return (
    <span
      onClick={() => navigate.back()}
      className="flex cursor-pointer items-center gap-1 text-lg"
    >
      <ArrowLeft /> Voltar
    </span>
  );
}
