import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductSpec, createEmptyProduct } from '@/types';

interface ProductStore {
  products: ProductSpec[];
  currentProductId: string | null;

  createProduct: () => string;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => string;
  updateProduct: (id: string, updates: Partial<ProductSpec>) => void;
  updateParam: (productId: string, paramId: string, updates: Partial<{ label: string; value: string; unit: string }>) => void;
  getProduct: (id: string) => ProductSpec | undefined;
  setCurrentProduct: (id: string | null) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      currentProductId: null,

      createProduct: () => {
        const product = createEmptyProduct();
        set((state) => ({
          products: [...state.products, product],
          currentProductId: product.id,
        }));
        return product.id;
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          currentProductId: state.currentProductId === id ? null : state.currentProductId,
        }));
      },

      duplicateProduct: (id) => {
        const original = get().getProduct(id);
        if (!original) return '';
        const now = new Date().toISOString();
        const copy: ProductSpec = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name} (副本)`,
          createdAt: now,
          updatedAt: now,
          params: original.params.map((p) => ({ ...p, id: crypto.randomUUID() })),
        };
        set((state) => ({ products: [...state.products, copy] }));
        return copy.id;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      updateParam: (productId, paramId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  params: p.params.map((param) =>
                    param.id === paramId ? { ...param, ...updates } : param
                  ),
                }
              : p
          ),
        }));
      },

      getProduct: (id) => get().products.find((p) => p.id === id),

      setCurrentProduct: (id) => set({ currentProductId: id }),
    }),
    {
      name: 'rvsspec-products',
    }
  )
);
