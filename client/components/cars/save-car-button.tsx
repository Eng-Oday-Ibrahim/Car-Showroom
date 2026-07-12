'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon  } from 'lucide-react';
import { getSavedCarIds, getStoredAuth, toggleSavedCar } from '../../lib/auth/auth';

interface SaveCarButtonProps {
  carId: string;
  className?: string;
}

export function SaveCarButton({ carId, className = '' }: SaveCarButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      const auth = getStoredAuth();
      if (!auth.token) {
        setIsSaved(false);
        return;
      }

      const savedIds = await getSavedCarIds(auth.user?.id);
      setIsSaved(savedIds.includes(carId));
    };

    void loadState();
  }, [carId]);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const auth = getStoredAuth();
    if (!auth.token) {
      router.push('/login');
      return;
    }

    const result = await toggleSavedCar(carId);
    setIsSaved(result.isSaved);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 border border-gray-100 bg-white/95 px-3 py-1.5 text-sm font-medium transition hover:border-black hover:text-black ${className}`}
    >
      <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-[#050505] text-black' : 'text-gray-500'}`} />
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
