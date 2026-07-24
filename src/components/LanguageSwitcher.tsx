'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const locales = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: string) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    startTransition(() => {
      router.replace(segments.join('/'));
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5 no-print">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          disabled={isPending}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            locale === l.code
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
