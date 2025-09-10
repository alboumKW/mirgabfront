'use client';

import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import dynamic from 'next/dynamic';
const EmailSubscription = dynamic(() => import('@/components/EmailSubscription'), { ssr: false });
import PixelEffects from '@/components/PixelEffects';
import MaybeTetris from '@/components/MaybeTetris';
import { Gamepad2, Github, Twitter, Instagram } from 'lucide-react';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Pixel Effects */}
      <PixelEffects />
      
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center header-bar">
        <div className="text-2xl font-bold text-white font-display">
          {t('brand')}
        </div>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 pixel-border pixel-glow">
              <Gamepad2 className="text-white" size={40} />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight font-display">
            {t('comingSoon')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium font-display">
            {t('subtitle')}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          {/* Mini Tetris Game (hidden in Arabic) */}
          <div className="mb-12">
            <MaybeTetris />
          </div>

          {/* Email Subscription */}
          <div className="mb-12">
            <h3 className="text-lg text-gray-300 mb-6 font-medium font-display">
              {t('notifyMe')}
            </h3>
            <EmailSubscription />
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <p className="text-gray-400 mb-4 font-medium">{t('followUs')}</p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 text-gray-300 hover:text-white hover:pixel-glow"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 text-gray-300 hover:text-white hover:pixel-glow"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 text-gray-300 hover:text-white hover:pixel-glow"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-gray-500 text-sm">
          {t('copyright')}
        </p>
      </footer>
    </div>
  );
}