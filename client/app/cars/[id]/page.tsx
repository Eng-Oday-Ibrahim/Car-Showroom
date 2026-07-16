import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { carsApi } from '../../../lib/api/cars.api';
import { formatPrice } from '../../../lib/utils';
import { CarDetailsContent } from '../../../components/cars/car-details-content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: car } = await carsApi.getById(id);
    return {
      title: `${car.make} ${car.model} ${car.year}`,
      description: car.descriptionAr ?? `${car.make} ${car.model} ${car.year} — ${formatPrice(car.price)}`,
    };
  } catch {
    return { title: 'Not Found a Car' };
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;

  let car;
  try {
    const res = await carsApi.getById(id);
    car = res.data;
  } catch {
    notFound();
  }

  return <CarDetailsContent car={car} />;
}