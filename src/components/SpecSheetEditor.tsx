'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { ImageUploader } from './ImageUploader';
import { useState, useEffect, useRef } from 'react';
import { DEFAULT_LOGO } from './DefaultLogo';

export function SpecSheetEditor({ productId }: { productId: string }) {
  const t = useTranslations('editor');
  const tHome = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();

  const product = useProductStore((s) => s.products.find((p) => p.id === productId));
  const updateProduct = useProductStore((s) => s.updateProduct);
  const updateParam = useProductStore((s) => s.updateParam);

  const [saved, setSaved] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save with debounce
  const markDirty = () => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(true), 800);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (!product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-neutral-500">
        <p className="mb-4">产品未找到</p>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-8">
      {/* Toolbar */}
      <div className="no-print sticky top-[57px] z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[210mm] items-center justify-between px-4 py-2">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('back')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">
              {saved ? `✓ ${t('saved')}` : t('saving')}
            </span>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('exportPdf')}
            </button>
          </div>
        </div>
      </div>

      {/* Product name input */}
      <div className="no-print mx-auto mt-4 max-w-[210mm] px-4">
        <input
          type="text"
          value={product.name}
          onChange={(e) => {
            updateProduct(productId, { name: e.target.value });
            markDirty();
          }}
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-green-500 focus:outline-none"
          placeholder="产品名称"
        />
      </div>

      {/* A4 Spec Sheet Preview */}
      <div
        className="print-page mx-auto mt-4 bg-white shadow-lg"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div className="mb-[9mm] flex justify-between border-b border-neutral-100 pb-2.5">
          <div className="flex flex-col gap-1.5" style={{ width: '200px' }}>
            <input
              type="text"
              value={product.brand}
              onChange={(e) => { updateProduct(productId, { brand: e.target.value }); markDirty(); }}
              className="spec-input border border-transparent bg-transparent text-[15px] font-bold text-neutral-900 focus:border-green-500 focus:outline-none"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              value={product.series}
              onChange={(e) => { updateProduct(productId, { series: e.target.value }); markDirty(); }}
              className="spec-input border border-transparent bg-transparent text-[15px] text-neutral-900 focus:border-green-500 focus:outline-none"
              style={{ width: '200px' }}
            />
            <input
              type="text"
              value={product.description}
              onChange={(e) => { updateProduct(productId, { description: e.target.value }); markDirty(); }}
              className="spec-input border border-transparent bg-transparent text-[15px] text-neutral-900 focus:border-green-500 focus:outline-none"
              style={{ width: '200px' }}
            />
          </div>
          <div className="flex justify-end" style={{ width: '200px' }}>
            <ImageUploader
              image={product.logo}
              onChange={(img) => { updateProduct(productId, { logo: img }); markDirty(); }}
              className="h-20 w-full"
              placeholder={t('changeLogo')}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-[15mm]">
          {/* Left: images */}
          <div className="flex flex-col gap-[9mm]" style={{ marginLeft: '20mm' }}>
            <ImageUploader
              image={product.productImage}
              onChange={(img) => { updateProduct(productId, { productImage: img }); markDirty(); }}
              className="h-[90mm] w-[90mm]"
              placeholder={t('uploadProductImage')}
              hint={t('sizeHint')}
            />
            <ImageUploader
              image={product.productDiagram}
              onChange={(img) => { updateProduct(productId, { productDiagram: img }); markDirty(); }}
              className="h-[70mm] w-[90mm]"
              placeholder={t('uploadDiagram')}
              hint={t('sizeHintDiagram')}
            />
          </div>

          {/* Right: params table */}
          <div style={{ width: '85mm', marginLeft: '-10mm' }}>
            <table className="w-full border-collapse">
              <tbody>
                {product.params.map((param) => {
                  const isEmpty = !param.value.trim();
                  return (
                    <tr
                      key={param.id}
                      className={`param-row ${isEmpty ? 'empty' : ''}`}
                      style={{ height: '24px' }}
                    >
                      <td
                        className="whitespace-nowrap pr-2.5 text-left text-[12px] font-medium text-neutral-600"
                        style={{ width: '95px' }}
                      >
                        {param.editable ? (
                          <input
                            type="text"
                            value={param.label}
                            onChange={(e) => {
                              updateParam(productId, param.id, { label: e.target.value });
                              markDirty();
                            }}
                            className="spec-input w-full border border-transparent bg-transparent px-0 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 focus:border-green-500 focus:outline-none"
                          />
                        ) : (
                          param.label
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={param.value}
                          placeholder={`输入${param.label}`}
                          onChange={(e) => {
                            updateParam(productId, param.id, { value: e.target.value });
                            markDirty();
                          }}
                          onBlur={(e) => {
                            let val = e.target.value.trim();
                            if (val && param.unit && !val.endsWith(param.unit)) {
                              if (val.includes('/')) {
                                val = val + param.unit;
                              } else {
                                const num = parseFloat(val);
                                if (!isNaN(num)) val = num + param.unit;
                              }
                              updateParam(productId, param.id, { value: val });
                              markDirty();
                            }
                          }}
                          onFocus={(e) => {
                            if (param.unit && e.target.value.endsWith(param.unit)) {
                              e.target.value = e.target.value.slice(0, -param.unit.length);
                            }
                          }}
                          className="spec-input w-full border-none bg-transparent px-0 text-[13px] text-neutral-900 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accessories grid */}
        <div
          className="absolute"
          style={{ bottom: '30mm', left: '40mm', width: '70mm' }}
        >
          <div className="grid grid-cols-2 gap-[8mm]">
            {product.accessories.map((img, i) => (
              <ImageUploader
                key={i}
                image={img}
                onChange={(dataUrl) => {
                  const next = [...product.accessories];
                  next[i] = dataUrl;
                  updateProduct(productId, { accessories: next });
                  markDirty();
                }}
                className="h-[35mm] w-[35mm]"
                placeholder={`${t('accessory')}${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Light curves grid */}
        <div
          className="absolute"
          style={{ bottom: '30mm', left: '135mm', width: '70mm' }}
        >
          <div className="grid grid-cols-2 gap-[8mm]">
            {product.curves.map((img, i) => (
              <ImageUploader
                key={i}
                image={img}
                onChange={(dataUrl) => {
                  const next = [...product.curves];
                  next[i] = dataUrl;
                  updateProduct(productId, { curves: next });
                  markDirty();
                }}
                className="h-[35mm] w-[35mm]"
                placeholder={`${t('curve')}${i + 1}`}
                grayscale
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute border-t border-neutral-200 pt-2"
          style={{ bottom: '5mm', left: '20mm', right: '20mm', width: '170mm', margin: '0 auto' }}
        >
          <div className="flex justify-around text-[9px] text-neutral-600">
            <div className="flex max-w-[30%] flex-col gap-0.5 text-left">
              <input
                type="text"
                value={product.footer.website}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, website: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[9px] text-neutral-600 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={product.footer.company}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, company: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[9px] text-neutral-600 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="flex max-w-[30%] flex-col gap-0.5 text-left">
              <input
                type="text"
                value={product.footer.email}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, email: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[9px] text-neutral-600 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={product.footer.addressSh}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, addressSh: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[9px] text-neutral-600 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={product.footer.addressSz}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, addressSz: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[9px] text-neutral-600 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="flex max-w-[30%] flex-col gap-0.5 text-left text-[8px] text-neutral-400">
              <input
                type="text"
                value={product.footer.rights}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, rights: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[8px] text-neutral-400 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={product.footer.version}
                onChange={(e) => {
                  updateProduct(productId, { footer: { ...product.footer, version: e.target.value } });
                  markDirty();
                }}
                className="spec-input border border-transparent bg-transparent text-[8px] text-neutral-400 hover:border-neutral-200 focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
