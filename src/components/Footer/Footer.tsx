import { FaInstagram } from 'react-icons/fa6';
import { FaWhatsapp } from 'react-icons/fa';
import { FaFacebookSquare } from 'react-icons/fa';
import { TitleH2 } from '../Titles/Titles';
import { CustomLink } from '../LinkComponent/Link';

export const Footer = () => {
  return (
    <footer className="bg-primary-greenFooter px-6 text-text-primary">
      <div className="container mx-auto flex flex-wrap justify-between gap-6 px-4 py-6">
        <div className="my-3 mb-6 flex min-w-[220px] flex-col items-start">
          <TitleH2>Conheça nosso site</TitleH2>
          <CustomLink type="footer" href="/login">
            Login
          </CustomLink>
          <CustomLink type="footer" href="/register">
            Cadastro
          </CustomLink>
          <CustomLink type="footer" href="/menu">
            Menu
          </CustomLink>
        </div>

        <div className="my-3 mb-6 flex min-w-[220px] flex-col items-start">
          <TitleH2>Suporte</TitleH2>
          <CustomLink type="footer" href="/duvidas">
            Dúvidas
          </CustomLink>
          <p>Entre em contato: (21)99999-9999</p>
        </div>

        <div className="my-3 mb-6 flex min-w-[220px] flex-col items-start">
          <TitleH2>Redes Sociais</TitleH2>
          <div className="flex gap-3">
            <CustomLink
              href={'https://www.instagram.com/chefalineval/'}
              type="social"
            >
              <FaInstagram size={20} />
            </CustomLink>
            <CustomLink href={''} type="social">
              <FaWhatsapp size={20} />
            </CustomLink>
            <CustomLink
              href={'https://www.facebook.com/empadaodaline'}
              type="social"
            >
              <FaFacebookSquare size={20} />
            </CustomLink>
          </div>
        </div>
      </div>

      <div className="border-t border-white pt-4 text-center text-base">
        <p>Empadão Da Aline &copy; 2025 - Todos os direitos reservados</p>
      </div>
    </footer>
  );
};
