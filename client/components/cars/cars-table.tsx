'use client';

import { useState }       from 'react';
import Link               from 'next/link';
import type { Car, CarStatusAction } from '../../types/car.types';
import { carsApi }        from '../../lib/api/cars.api';
import { formatPrice, formatKm, STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS, SOURCE_COLORS, cn } from '../../lib/utils';
import { CarImage }       from './car-image';
import { Button }         from '../ui/button';
import { Badge }          from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface CarsTableProps {
  cars:      Car[];
  onRefresh: () => void;
}

export function CarsTable({ cars, onRefresh }: CarsTableProps) {
  const [loadingId,  setLoadingId]  = useState<string | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const handleStatus = async (id: string, action: CarStatusAction) => {
    setLoadingId(id);
    setError(null);
    try {
      await carsApi.setStatus(id, action);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Woops! Something went wrong');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoadingId(deleteId);
    setError(null);
    try {
      await carsApi.delete(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : ' Woops! Something went wrong');
    } finally {
      setLoadingId(null);
    }
  };

  if (cars.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">  No Cars Found</p>
        <p className="text-sm mt-1">Add a new car or sync the data</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto  border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium">Cars</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Kilometers</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {cars.map((car, index) => (
              <tr key={`${car.id}-${index}`} className="hover:bg-gray-50 transition-colors">

                {/* Car name + thumbnail */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-10 overflow-hidden bg-gray-100 shrink-0">
                      {car.images?.length ? (
                        <CarImage src={car.images[0]} alt={car.make} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No Image 
                        </div>
                      )}
                    </div>
                  </div>
                </td>
               <td className="px-4 py-3 ">
                          <div>
                      <p className="font-semibold text-gray-900">{car.make} {car.model}</p>
                      {car.trim && <p className="text-xs text-gray-400">{car.trim}</p>}
                    </div>
               </td>
                <td className="px-4 py-3 text-gray-600">{car.year}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(car.price)}</td>
                <td className="px-4 py-3 text-gray-600">{formatKm(car.kmDriven)}</td>

                {/* Source badge */}
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-medium px-2 py-1 rounded-full', SOURCE_COLORS[car.source])}>
                    {SOURCE_LABELS[car.source]}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-medium px-2 py-1 rounded-full', STATUS_COLORS[car.status])}>
                    {STATUS_LABELS[car.status]}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={loadingId === car.id}
                      >
                        {loadingId === car.id ? '...' : '⋯'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">

                      {/* عرض */}
                      <DropdownMenuItem asChild>
                        <Link href={`/cars/${car.id}`} target="_blank">
                          View on Site
                        </Link>
                      </DropdownMenuItem>

                      {/* Edit — Local only */}
                      {car.source === 'local' && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/cars/${car.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      {/* Change Status — Local only */}
                      {car.source === 'local' && (
                        <>
                          {car.status !== 'active' && (
                            <DropdownMenuItem onClick={() => handleStatus(car.id, 'activate')}>
                              Activate
                            </DropdownMenuItem>
                          )}
                          {car.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleStatus(car.id, 'pause')}>
                              Pause
                            </DropdownMenuItem>
                          )}
                          {car.status !== 'sold' && car.status !== 'deleted' && (
                            <DropdownMenuItem onClick={() => handleStatus(car.id, 'sold')}>
                              Mark as Sold
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteId(car.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* دبي كار — للقراءة فقط */}
                      {car.source === 'dubicars' && (
                        <DropdownMenuItem disabled className="text-gray-400 text-xs">
                          This car is from DubiCars and cannot be modified.
                        </DropdownMenuItem>
                      )}

                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this car? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
