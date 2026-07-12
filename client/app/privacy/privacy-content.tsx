'use client';

import { Translate } from '@/lib/i18n';

const sectionKeys = [
  { title: 'privacyPage.section1Title', body: 'privacyPage.section1Body' },
  { title: 'privacyPage.section2Title', body: 'privacyPage.section2Body' },
  { title: 'privacyPage.section3Title', body: 'privacyPage.section3Body' },
  { title: 'privacyPage.section4Title', body: 'privacyPage.section4Body' },
  { title: 'privacyPage.section5Title', body: 'privacyPage.section5Body' },
  { title: 'privacyPage.section6Title', body: 'privacyPage.section6Body' },
  { title: 'privacyPage.section7Title', body: 'privacyPage.section7Body' },
];

export function PrivacyContent() {
  const updatedDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-3 pb-8 border-b border-gray-100">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          <Translate id="privacyPage.title" />
        </h1>
        <p className="text-sm text-gray-400">
          <Translate id="privacyPage.updated" values={{ date: updatedDate }} />
        </p>
      </div>

      <div className="space-y-10">
        {sectionKeys.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              <Translate id={section.title} />
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              <Translate id={section.body} />
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-100 text-sm text-gray-400">
        <Translate id="privacyPage.footerText" values={{ email: 'info@husseinghulammotors.com' }} />
      </div>
    </div>
  );
}
