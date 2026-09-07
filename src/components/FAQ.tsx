import { Accordion } from './Accordion';

export function FAQ() {
  const faqs = [
    {
      q: "¿Cómo realizo un pedido?",
      a: "Elige tus zapatos, agrégalos a la bolsa y al finalizar, haz clic en 'Pedir por WhatsApp'. Se abrirá el chat con nuestro equipo enviando todo el detalle del pedido para coordinar pago y entrega al instante."
    },
    {
      q: "¿Cuáles son los métodos de pago?",
      a: "Aceptamos Pago Móvil, transferencias bancarias nacionales, Zelle, Binance Pay y divisas en efectivo para entregas personales en tienda o delivery."
    },
    {
      q: "¿Hacen envíos a toda Venezuela?",
      a: "Sí, realizamos envíos a nivel nacional a través de MRW, Zoom o Tealca. También ofrecemos servicio de delivery exprés en zonas céntricas y entregas personales."
    },
    {
      q: "¿Puedo cambiar la talla si no me sirve?",
      a: "Sí, tienes 3 días para solicitar un cambio de talla sujeto a disponibilidad. El calzado no debe haber sido usado y debe mantener su empaque original. Los costos de envío corren por cuenta del cliente."
    }
  ];

  return (
    <div id="faq-section" className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black tracking-tighter text-black uppercase">Preguntas Frecuentes</h2>
        <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">Todo lo que necesitas saber antes de hacer tu pedido</p>
      </div>
      <div className="flex flex-col border-t border-gray-200">
        {faqs.map((faq, i) => (
          <Accordion key={i} title={faq.q} content={faq.a} />
        ))}
      </div>
    </div>
  );
}
