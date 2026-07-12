'use client';

import { siFacebook, siInstagram } from 'simple-icons/icons';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { ContactForm } from '../../components/contact/contact-form';
import { Translate } from '@/lib/i18n';



const Social = [
  { link: 'https://www.facebook.com/husseinghulammotorsfzco', icon: siFacebook },
  { link: 'https://www.instagram.com/husseinghulammotors', icon: siInstagram },
];

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      <div className="space-y-3 pb-10 border-b border-gray-100">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          <Translate id="contactPage.header" />
        </h1>
        <p className="text-gray-400 text-sm max-w-md">
          <Translate id="contactPage.description" />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-10">
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              <Translate id="contactPage.detailsTitle" />
            </h2>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-300 mt-0.5" />
                <a href="mailto:info@husseinghulammotors.com" className="hover:text-gray-900 transition-colors">
                  info@husseinghulammotors.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-300 mt-0.5" />
                <a href="tel:+971543141978" className="hover:text-gray-900 transition-colors">
                  +971 54 314 1978
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-300 mt-0.5" />
                Dubai, UAE
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              <Translate id="contactPage.chatTitle" />
            </h2>
            <a
              href="https://wa.me/971543141978"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto border border-gray-200 text-gray-900 px-6 py-3 text-sm font-medium hover:border-gray-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> <Translate id="contactPage.whatsapp" />
            </a>
          </div>

          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              <Translate id="contactPage.followTitle" />
            </h2>
            <div className="flex gap-3">
              {Social.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path d={social.icon.path} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
