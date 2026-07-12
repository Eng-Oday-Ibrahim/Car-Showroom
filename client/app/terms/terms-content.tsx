'use client';

import { Translate } from '@/lib/i18n';

const sectionKeys = [
  { title: 'termsPage.section1Title', body: 'termsPage.section1Body' },
  { title: 'termsPage.section2Title', body: 'termsPage.section2Body' },
  { title: 'termsPage.section3Title', body: 'termsPage.section3Body' },
  { title: 'termsPage.section4Title', body: 'termsPage.section4Body' },
  { title: 'termsPage.section5Title', body: 'termsPage.section5Body' },
  { title: 'termsPage.section6Title', body: 'termsPage.section6Body' },
  { title: 'termsPage.section7Title', body: 'termsPage.section7Body' },
  { title: 'termsPage.section8Title', body: 'termsPage.section8Body' },
];

export function TermsContent() {
  const updatedDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-3 pb-8 border-b border-gray-100">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          <Translate id="termsPage.title" />
        </h1>
        <p className="text-sm text-gray-400">
          <Translate id="termsPage.updated" values={{ date: updatedDate }} />
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
        <Translate id="termsPage.footerText" values={{ email: 'info@husseinghulammotors.com' }} />
      </div>
    </div>
  );
}
