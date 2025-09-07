'use client';
import { TitleH1 } from '@/components/Titles/Titles';
import { Accordion, Span } from '@chakra-ui/react';

export default function DoubtClientPage() {
  const items = [
    {
      value: 'a',
      title: '1. Como fazer o pedido?',
      text: 'Faça login ou se cadastre. Navegue pelo menu e selecione o produto de sua preferência. Ao finalizar, cadastre ou selecione o seu endereço (casp ja tenha um endereço cadastrado) e escolha o meio de pagamento e confirme os produtos do carrinho',
    },
    {
      value: 'b',
      title: '2. Meio de Pagamento',
      text: 'No momento ainda não fazemos pagamento pelo site. Na hora de fazer o pedido adicione o meio de pagamento apenas para facilitar a entrega. O pagamento será feito pessoalmente ou via pix enviando o comprovante para o nosso Whatsapp.',
    },
    {
      value: 'c',
      title: '3. Agendamento/Entrega',
      text: 'Caso você queira que o pedido seja entregue no mesmo dia, faça o seu pedido até as 12h. Após esse horário seu pedido será feito apenas com agendamento.',
    },
  ];

  return (
    <main className="mx-auto w-full">
      <section id="duvidas" className="w-full px-8 py-6">
        <TitleH1>Dúvidas Frequentes</TitleH1>
        <Accordion.Root collapsible defaultValue={['b']}>
          {items.map((item, index) => (
            <Accordion.Item
              key={index}
              value={item.value}
              className="my-3 rounded-md border border-b-2 border-text-primary px-4 py-3"
            >
              <Accordion.ItemTrigger>
                <Span flex="1" className="text-lg font-semibold">
                  {item.title}
                </Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody className="py-2">
                  {item.text}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </main>
  );
}
