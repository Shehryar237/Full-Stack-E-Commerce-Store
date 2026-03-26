// client/src/pages/CheckoutPage/CheckoutPage.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import * as cartService from '../../services/cartService';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button } from '@mantine/core';
import type { Cart} from '../../services/cartService';



export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart>({ products: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cartService.fetchCart().then(setCart).catch(err => {
      console.error('Failed to load cart', err);
    });
  }, []);

  const handlePay = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // simulate payment info
      const paymentInfo = { name, email, method: 'simulated-card' };
      const receipt = await cartService.checkout(paymentInfo);
      setMessage(`Payment succeeded. Total: $${receipt.totalPaid.toFixed(2)} — Thank you!`);
      
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('Payment failed (simulated). Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: 18, maxWidth: 900, margin: '0 auto' }}>
        <h2>Checkout</h2>
        <div>
          {cart.products.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            <>
              <ul>
                {cart.products.map(p => (
                  <li key={p.id}>
                    {p.title} — {p.qty} × ${p.price.toFixed(2)} = ${(p.qty * p.price).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div><strong>Total: ${cart.totalPrice.toFixed(2)}</strong></div>
            </>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <TextInput label="Full name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} style={{ marginTop: 8 }} />
          <div style={{ marginTop: 12 }}>
            <Button onClick={handlePay} loading={loading} disabled={cart.products.length === 0}>
              Pay (simulate)
            </Button>
          </div>
          {message && <div style={{ marginTop: 12 }}>{message}</div>}
        </div>
      </div>
    </MainLayout>
  );
}
