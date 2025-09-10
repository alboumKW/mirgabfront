'use client';

import {useLocale} from 'next-intl';
import MiniTetris from '@/components/MiniTetris';

export default function MaybeTetris() {
  const locale = useLocale();
  if (locale === 'ar') return null;
  return <MiniTetris />;
}


