import { SpecSheetEditor } from '@/components/SpecSheetEditor';
import { setRequestLocale } from 'next-intl/server';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <SpecSheetEditor productId={id} />;
}
