"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  userId: string;
  userEmail: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, action.payload];
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product: any) => {
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: (() => {
        if (product.media?.mainImage) return product.media.mainImage;
        if (product.media?.images?.length > 0) return product.media.images[0];
        if (product.imageUrl) return product.imageUrl;
        if (product.image) return product.image;
        if (product.mainImage) return product.mainImage;
        if (product.images?.length) return product.images[0];
        return '/images/profile.jpg';
      })(),
      quantity: 1,
      userId: product.user?.id || '',
      userEmail: product.user?.email || ''
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
