import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
  id: number;
  code: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'>; quantity: number }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number }
  | { type: 'REMOVE_ITEM'; id: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.find(item => item.id === action.item.id);
      if (existing) {
        return state.map(item =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
      }
      return [...state, { ...action.item, quantity: action.quantity }];
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      ).filter(item => item.quantity > 0);
    
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.id);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', item, quantity });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
