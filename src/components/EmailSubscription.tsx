'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Check } from 'lucide-react';

export default function EmailSubscription() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
        <Check className="text-green-400" size={20} />
        <span className="text-green-100 font-medium font-display">{t('subscribeSuccess')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto" suppressHydrationWarning autoComplete="off">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <span className="text-red-200 text-sm font-medium">{error}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
            required
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !email}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed whitespace-nowrap font-display pixel-border hover:pixel-glow"
        >
          {isLoading ? '...' : t('subscribe')}
        </button>
      </div>
    </form>
  );
}
