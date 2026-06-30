import type { Metadata } from 'next';
import { Navbar }  from '../components/shared/navbar';

export const metadata: Metadata = {
  title: 
    {
     default: 'معرض السيارات', 
     template: '%s | معرض السيارات' 
    },
  description: 'تصفح أحدث السيارات المتاحة لدينا بأفضل الأسعار في الإمارات',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl flex items-center justify-between text-sm text-gray-400">
          <span>© {new Date().getFullYear()} معرض السيارات. جميع الحقوق محفوظة.</span>
          <span>مدعوم بـ DubiCars</span>
        </div>
      </footer>
    </div>
  );
}
