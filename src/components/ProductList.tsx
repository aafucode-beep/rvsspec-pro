'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useLocale } from 'next-intl';

export function ProductList() {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const createProduct = useProductStore((s) => s.createProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const duplicateProduct = useProductStore((s) => s.duplicateProduct);

  const handleCreate = () => {
    const id = createProduct();
    router.push(`/${locale}/editor/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('confirmDelete'))) {
      deleteProduct(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateProduct(id);
    router.push(`/${locale}/editor/${newId}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">{t('title')}</h1>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          + {t('createBtn')}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-20 text-center">
          <svg className="mb-4 h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <p className="text-neutral-500">{t('empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                {product.productImage ? (
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <svg className="h-12 w-12 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <h3 className="mb-1 truncate font-semibold text-neutral-900">{product.name}</h3>
              <p className="mb-3 truncate text-sm text-neutral-500">
                {product.brand} · {product.series}
              </p>
              <p className="text-xs text-neutral-400">
                {t('updatedAt')}: {new Date(product.updatedAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
              </p>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push(`/${locale}/editor/${product.id}`)}
                  className="flex-1 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDuplicate(product.id)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  {t('duplicate')}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
