import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { carsApi } from '../../../../lib/api/cars.api';
import { EditCarContent } from './edit-car-content';
import type { Car } from '../../../../types/car.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data } = await carsApi.getById(id);
    return { title: `Edit - ${data.make} ${data.model} ${data.year}` };
  } catch {
    return { title: 'Edit Car' };
  }
}

export default async function EditCarPage({ params }: PageProps) {
  const { id } = await params;
  let car: Car;

  try {
    const { data } = await carsApi.getById(id);
    car = data;
  } catch {
    notFound();
  }

  return <EditCarContent car={car} />;
}
