'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'opening'>('idle');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('opening');

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '');
    const phone = String(data.get('phone') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');
    const subject = `Website contact from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      '',
      message,
    ].filter(Boolean).join('\n');
    const gmailUrl = new URL('https://mail.google.com/mail/');

    gmailUrl.searchParams.set('view', 'cm');
    gmailUrl.searchParams.set('fs', '1');
    gmailUrl.searchParams.set('to', 'info@husseinghulammotors.com');
    gmailUrl.searchParams.set('su', subject);
    gmailUrl.searchParams.set('body', body);

    const composeWindow = window.open(gmailUrl.toString(), '_blank', 'noopener,noreferrer');
    if (!composeWindow) {
      window.location.href = gmailUrl.toString();
    }
    window.setTimeout(() => setStatus('idle'), 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs uppercase tracking-wide text-gray-400">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs uppercase tracking-wide text-gray-400">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs uppercase tracking-wide text-gray-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs uppercase tracking-wide text-gray-400">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'opening'}
        className="flex items-center gap-2 bg-[#050505] text-white px-6 py-3 text-sm font-medium hover:bg-[#050505]/80 transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {status === 'opening' ? 'Opening email...' : 'Send Message'}
      </button>
    </form>
  );
}
