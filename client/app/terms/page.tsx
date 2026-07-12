import type { Metadata } from 'next';
import { TermsContent } from './terms-content';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the Hussein Ghulam Motors website.',
};

export default function TermsPage() {
  return <TermsContent />;
}
