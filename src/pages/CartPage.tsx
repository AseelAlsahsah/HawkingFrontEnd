// src/pages/CartPage.tsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, cartTotal, cartCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 to-amber-50">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center p-12 max-w-md">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <Link 
              to="/collections" 
              className="inline-flex items-center px-8 py-4 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700 transition text-lg"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 to-amber-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white/80 p-6 rounded-2xl border shadow-sm flex gap-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">Code: <span className="font-mono">{item.code}</span></p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-lg sm:text-xl font-bold text-gold-600 truncate">
                            ${item.price.toFixed(3)}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm"
                            >
                              −
                            </button>
                            <span className="w-12 text-center text-lg font-semibold min-w-[2rem]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm px-2 py-1 whitespace-nowrap flex-shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white/80 p-6 rounded-2xl border shadow-sm sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>{cartCount} Items</span>
                    <span>${cartTotal.toFixed(3)}</span>
                  </div>
                </div>
                <Link
                  to="/collections"
                  className="w-full block py-3 px-4 border border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center hover:shadow-sm mb-4 text-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Continue Shopping
                </Link>
                <Link
                  to="/reservation"
                  className="w-full block py-3 px-6 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700 transition text-lg mb-4 justify-center flex items-center"
                >
                  Proceed to Reservation
                </Link>
                <button
                  onClick={() => clearCart()}
                  className="w-full py-3 px-4 border border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center hover:shadow-sm mt-3"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear {cartCount} items
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
