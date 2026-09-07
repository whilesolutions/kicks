import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { MOCK_PRODUCTS } from '../data';
import { useState, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
}

const WHATSAPP_NUMBER = "584122178393";

export function CartDrawer({ isOpen, onClose, cart, removeFromCart, updateQuantity }: Props) {
  const [isNameValid, setIsNameValid] = useState(false);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const generateWhatsAppMessage = () => {
    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const address = addressRef.current?.value || '';

    let text = `Hola Kicks, soy *${name.trim()}* y deseo solicitar el siguiente pedido:\n\n`;
    let total = 0;

    cart.forEach(item => {
      const p = MOCK_PRODUCTS.find(p => p.id === item.productId);
      if (p) {
        const subtotal = p.price * item.quantity;
        total += subtotal;
        text += `▪ ${item.quantity}x ${p.name}\n  SKU/ID: ${p.id}\n  Color: ${item.color}\n  Talla: US ${item.size.us} / EU ${item.size.eu}\n  Precio: $${subtotal.toFixed(2)}\n  Ref: ${p.images[0]}\n\n`;
      }
    });

    text += `*Total a pagar: $${total.toFixed(2)}*\n\n`;

    if (email.trim()) {
      text += `✉️ *Correo:* ${email.trim()}\n`;
    }
    if (address.trim()) {
      text += `📍 *Dirección de Entrega:* ${address.trim()}\n\n`;
    }

    text += `Por favor, indíquenme los métodos de pago disponibles.`;
    return encodeURIComponent(text);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const p = MOCK_PRODUCTS.find(p => p.id === item.productId);
      return acc + ((p?.price || 0) * item.quantity);
    }, 0);
  };

  const isFormValid = isNameValid;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}
      {isOpen && (
        <motion.div
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        >
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="text-lg font-black uppercase tracking-tighter text-black">Tu Bolsa ({cart.length})</h2>
              <button onClick={onClose} className="p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 p-6">
                  <ShoppingBag className="mb-4 h-12 w-12 text-gray-800" />
                  <p className="text-sm font-medium">Tu carrito está vacío.</p>
                </div>
              ) : (
                <div className="p-6">
                  <ul className="space-y-6">
                    {cart.map(item => {
                      const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <li key={item.id} className="flex gap-4">
                          <div className="h-24 w-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm font-bold text-black">{product.name}</h3>
                                <p className="text-sm font-bold text-black border-b border-black">${(product.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{item.color} / US {item.size.us}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center border border-gray-200 rounded-full bg-white">
                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-gray-500 hover:text-black">-</button>
                                <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-500 hover:text-black">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold tracking-widest text-gray-600 uppercase hover:text-black transition-colors">Quitar</button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* MINI FOMULARIO */}
                  <div className="mt-10 border-t border-gray-100 pt-8">
                     <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">Datos para el Envío</h3>
                     <div className="space-y-4">
                        <div>
                          <label htmlFor="customerName" className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-600">Nombre Completo *</label>
                          <input 
                            id="customerName"
                            name="customerName"
                            type="text" 
                            ref={nameRef}
                            onChange={(e) => {
                              const valid = e.target.value.trim().length > 2;
                              if (valid !== isNameValid) setIsNameValid(valid);
                            }}
                            className="w-full border-b py-2 text-sm focus:outline-none transition-colors bg-transparent border-gray-300 focus:border-black"
                            placeholder="Ej. Carlos Pérez"
                          />
                        </div>
                        <div>
                          <label htmlFor="customerEmail" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-widest">Correo Electrónico</label>
                          <input 
                            id="customerEmail"
                            name="customerEmail"
                            type="email" 
                            ref={emailRef}
                            className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                            placeholder="Ej. correo@ejemplo.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="customerAddress" className="block text-xs font-bold mb-1 uppercase tracking-widest text-gray-600">Dirección de Entrega</label>
                          <input 
                            id="customerAddress"
                            name="customerAddress"
                            type="text" 
                            ref={addressRef}
                            className="w-full border-b py-2 text-sm focus:outline-none transition-colors bg-transparent border-gray-300 focus:border-black"
                            placeholder="Ej. Av. Principal, Edificio A"
                          />
                        </div>
                     </div>
                  </div>

                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="mb-6 flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="font-black text-xl text-black">${calculateTotal().toFixed(2)}</span>
                </div>
                {isFormValid ? (
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center w-full bg-[#25D366] py-4 text-sm font-black tracking-widest uppercase text-gray-900 transition-all hover:bg-[#128C7E] shadow-lg rounded-xl"
                  >
                    Pedir por WhatsApp
                  </a>
                ) : (
                  <div className="flex justify-center items-center w-full bg-gray-200 py-4 text-sm font-black tracking-widest uppercase text-gray-600 rounded-xl cursor-not-allowed">
                    Faltan Datos
                  </div>
                )}
                <p className="mt-4 text-center text-[10px] uppercase tracking-widest font-bold text-gray-600">
                  Serás redirigido a WhatsApp para confirmar
                </p>
              </div>
            )}
          </motion.div>
      )}
    </AnimatePresence>
  );
}
