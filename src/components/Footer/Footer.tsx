import { FaInstagram } from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';
import { TitleH2 } from '../Titles/Titles';
import { CustomLink } from '../LinkComponent/Link';

export const Footer = () => {
  return (
    <footer className="overflow-hidden border-text-primary/10 bg-gradient-to-br from-green_details-greenFooter/80 via-neutral-white text-text-primary">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <TitleH2 className="mb-3 text-lg text-text-primary">
              Empadão da Aline
            </TitleH2>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary sm:text-base">
              Pedidos simples, entrega organizada e suporte rápido para você
              acompanhar tudo sem complicação.
            </p>
          </div>

          <div>
            <TitleH2 className="mb-3 text-base uppercase tracking-[0.08em] text-text-primary">
              Navegação
            </TitleH2>
            <div className="flex flex-col gap-2 text-sm sm:text-base">
              <CustomLink
                type="footer"
                href="/menu"
                className="text-text-primary decoration-text-secondary/60 transition-colors hover:text-text-green"
              >
                Menu
              </CustomLink>
              <CustomLink
                type="footer"
                href="/doubt"
                className="text-text-primary decoration-text-secondary/60 transition-colors hover:text-text-green"
              >
                Dúvidas
              </CustomLink>
              <CustomLink
                type="footer"
                href="/termos"
                className="text-text-primary decoration-text-secondary/60 transition-colors hover:text-text-green"
              >
                Política de privacidade
              </CustomLink>
            </div>
          </div>

          <div>
            <TitleH2 className="mb-3 text-base uppercase tracking-[0.08em] text-text-primary">
              Contato
            </TitleH2>
            <p className="text-sm text-text-secondary sm:text-base">
              (21) 98464-6995
            </p>
            <div className="mt-4 flex gap-3">
              <CustomLink
                href="https://www.instagram.com/chefalineval/"
                type="social"
                className="border border-text-primary/15 bg-neutral-white text-text-primary transition-colors hover:bg-green_details-greenFooter/60"
              >
                <FaInstagram size={18} />
              </CustomLink>
              <CustomLink
                href=""
                type="social"
                className="border border-text-primary/15 bg-neutral-white text-text-primary transition-colors hover:bg-green_details-greenFooter/60"
              >
                <FaWhatsapp size={18} />
              </CustomLink>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-text-primary/10 py-4 text-center text-sm text-text-secondary">
        Empadão Da Aline &copy; 2026 - Todos os direitos reservados
      </div>
    </footer>
  );
};
