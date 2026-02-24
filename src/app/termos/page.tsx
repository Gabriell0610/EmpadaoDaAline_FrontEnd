import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { TitleH1, TitleH3 } from '@/components/Titles/Titles';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container-custom">
        <section className="mx-auto w-full max-w-5xl rounded-xl border border-text-primary/10 bg-neutral-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">
          <TitleH1 className="mb-2">POLÍTICA DE PRIVACIDADE</TitleH1>
          <p className="mb-6 text-sm text-text-secondary">
            Última atualização: [22/02/2026]
          </p>

          <p className="mb-4 leading-relaxed text-text-primary">
            Esta Política de Privacidade descreve como os dados pessoais são
            coletados, utilizados e protegidos por meio da plataforma [EMPADÃO
            DA ALINE], destinada à realização de pedidos de alimentos para
            entrega.
          </p>

          <p className="mb-4 leading-relaxed text-text-primary">
            O tratamento de dados é realizado por [Gabriel Barbosa Conceição
            Vieira], pessoa física responsável pela operação da plataforma.
          </p>

          <p className="mb-8 leading-relaxed text-text-primary">
            Este documento está em conformidade com a Lei nº 13.709/2018 (Lei
            Geral de Proteção de Dados Pessoais – LGPD).
          </p>

          <article className="mb-8">
            <TitleH3 className="mb-3">1. DADOS COLETADOS</TitleH3>
            <p className="mb-3 leading-relaxed text-text-primary">
              Para viabilizar a realização de pedidos e entregas, poderão ser
              coletados os seguintes dados pessoais:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-text-primary">
              <li>Nome</li>
              <li>Número de telefone</li>
              <li>Endereço para entrega</li>
              <li>Informações relacionadas ao pedido realizado</li>
            </ul>
            <p className="leading-relaxed text-text-primary">
              Não são coletados dados bancários ou informações de cartão de
              crédito, pois o pagamento é realizado presencialmente no momento
              da entrega.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">2. FINALIDADE DO TRATAMENTO</TitleH3>
            <p className="mb-3 leading-relaxed text-text-primary">
              Os dados pessoais são utilizados exclusivamente para:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-text-primary">
              <li>Processamento e confirmação de pedidos</li>
              <li>Organização e realização da entrega</li>
              <li>
                Contato com o cliente em caso de necessidade relacionada ao
                pedido
              </li>
              <li>
                Cumprimento de obrigações legais ou fiscais, quando aplicável
              </li>
            </ul>
            <p className="leading-relaxed text-text-primary">
              A base legal para o tratamento é a execução de contrato,
              considerando que os dados são necessários para viabilizar a
              entrega solicitada pelo próprio usuário.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">3. COMPARTILHAMENTO DE DADOS</TitleH3>
            <p className="mb-3 leading-relaxed text-text-primary">
              Os dados poderão ser compartilhados apenas quando necessário para:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-text-primary">
              <li>Realização da entrega (ex.: entregadores)</li>
              <li>Cumprimento de obrigação legal ou determinação judicial</li>
            </ul>
            <p className="leading-relaxed text-text-primary">
              Não há comercialização ou compartilhamento para fins de marketing.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">4. ARMAZENAMENTO E RETENÇÃO</TitleH3>
            <p className="mb-4 leading-relaxed text-text-primary">
              Os dados pessoais serão mantidos enquanto o usuário mantiver
              cadastro ativo na plataforma.
            </p>
            <p className="leading-relaxed text-text-primary">
              Após a exclusão da conta, os dados poderão ser mantidos pelo prazo
              necessário ao cumprimento de obrigações legais, fiscais ou para o
              exercício regular de direitos, conforme permitido pela legislação.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">5. DIREITOS DO TITULAR</TitleH3>
            <p className="mb-3 leading-relaxed text-text-primary">
              Nos termos da LGPD, o titular pode solicitar:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-text-primary">
              <li>Confirmação da existência de tratamento</li>
              <li>Acesso aos dados pessoais</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Exclusão dos dados pessoais, quando aplicável</li>
              <li>Informações sobre eventual compartilhamento</li>
            </ul>
            <p className="leading-relaxed text-text-primary">
              As solicitações podem ser feitas por meio do canal indicado nesta
              política.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">6. EXCLUSÃO DE DADOS</TitleH3>
            <p className="mb-4 leading-relaxed text-text-primary">
              Caso o usuário deseje excluir sua conta e seus dados pessoais,
              deverá encaminhar solicitação para:
            </p>
            <p className="mb-4 leading-relaxed text-text-primary">
              E-mail: [empadaaline@gmail.com]
            </p>
            <p className="leading-relaxed text-text-primary">
              A solicitação será analisada e atendida nos termos da legislação
              vigente, podendo haver retenção de dados quando houver obrigação
              legal que justifique sua manutenção.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">7. SEGURANÇA DAS INFORMAÇÕES</TitleH3>
            <p className="mb-4 leading-relaxed text-text-primary">
              São adotadas medidas técnicas e administrativas razoáveis para
              proteção dos dados pessoais contra acessos não autorizados,
              vazamentos ou uso indevido.
            </p>
            <p className="leading-relaxed text-text-primary">
              O site utiliza conexão segura (HTTPS) e acesso restrito às
              informações armazenadas.
            </p>
          </article>

          <article className="mb-8">
            <TitleH3 className="mb-3">8. RESPONSÁVEL PELO TRATAMENTO</TitleH3>
            <p className="mb-2 leading-relaxed text-text-primary">
              Responsável: [Gabriel Barbosa Conceição Vieira]
            </p>
            <p className="mb-4 leading-relaxed text-text-primary">
              Contato: [gabriell.vieira432@gmail.com]
            </p>
            <p className="leading-relaxed text-text-primary">
              Em caso de necessidade, o titular poderá apresentar reclamação à
              Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </article>

          <article>
            <TitleH3 className="mb-3">9. ALTERAÇÕES NESTA POLÍTICA</TitleH3>
            <p className="leading-relaxed text-text-primary">
              Esta Política de Privacidade poderá ser atualizada a qualquer
              momento para refletir melhorias na plataforma ou alterações
              legais. A versão vigente estará sempre disponível no site.
            </p>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
