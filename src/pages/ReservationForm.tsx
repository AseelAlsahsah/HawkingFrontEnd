// src/pages/ReservationForm.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

interface ReservationItem {
  itemCode: string;
  quantity: number;
}

interface ReservationRequest {
  username: string;
  phoneNumber: string;
  totalPrice: number;
  items: ReservationItem[];
}

export default function ReservationForm() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const request: ReservationRequest = {
      username: formData.username.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      totalPrice: cartTotal,
      items: cart.map(item => ({
        itemCode: item.code,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorBody = errorData.body || {};
        setErrors(errorBody);
        const firstError = Object.values(errorBody).flat()[0] as string;
        addToast(firstError || 'Please fix the errors above', 'error');
        return;
      }

      clearCart();
      addToast('Reservation created successfully! Owner will contact you soon.', 'success');
      navigate('/collections');
    } catch (error) {
      setErrors({ general: ['Network error. Please try again.'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 p-8 rounded-2xl border shadow-xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gold-600 mb-2">Complete Reservation</h1>
              <p className="text-lg text-gray-600">
                Fill in your details. We'll contact you for pickup.
              </p>
            </div>

            <div className="mb-6 p-4 bg-gray-100 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{cart.length} Items</span>
                  <span className="font-semibold">${cartTotal.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">{errors.general[0]}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
                  placeholder="+962 7XX XXX XXXX"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold-600 text-white font-semibold text-lg rounded-xl hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Reservation...' : `Reserve Order $ ${cartTotal.toFixed(3)}`}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/cart"
                className="w-full block py-3 px-4 border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center hover:shadow-sm"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
