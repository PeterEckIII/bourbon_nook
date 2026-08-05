import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import z from 'zod';
import {
  bottleCreate,
  bottleUpdate,
  type BottleResponseModel,
} from '../api/generated/bottles-api';
import { useAppForm } from './form';
import { getApiErrorMessage } from '../api/errors';

const bottleSchema = z.object({
  name: z.string('Name is required'),
  type: z.string('Type is required'),
  status: z.enum(['OPENED', 'SEALED', 'FINISHED'], 'Status is required'),
  distillery: z.string().optional(),
  producer: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  price: z.number().optional(),
  age: z.string().optional(),
  proof: z.number().optional(),
  releaseYear: z.number().optional(),
  barrelInformation: z.string().optional(),
  finishing: z.string().optional(),
  imageUrl: z.string().optional(),
  openDate: z.iso.date().or(z.literal('')).optional(),
  killDate: z.iso.date().or(z.literal('')).optional(),
  mode: z.enum(['create', 'edit']),
  bottleId: z.string().optional(),
});

type Bottle = z.infer<typeof bottleSchema>;

const defaultValues: Bottle = {
  name: '',
  type: '',
  status: 'SEALED',
  distillery: '',
  producer: '',
  country: '',
  region: '',
  price: 0.0,
  age: '',
  proof: 0.0,
  releaseYear: 0,
  barrelInformation: '',
  finishing: '',
  imageUrl: '',
  openDate: '',
  killDate: '',
  mode: 'create',
  bottleId: '',
};

export default function useBottleForm({
  valuesToEdit,
  bottleId,
}: {
  valuesToEdit?: BottleResponseModel;
  bottleId?: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const initialValues = useMemo(
    () =>
      valuesToEdit
        ? {
            ...defaultValues,
            ...valuesToEdit,
            status: valuesToEdit.status ?? defaultValues.status,
            mode: 'edit',
            bottleId: bottleId ?? '',
          }
        : defaultValues,
    [bottleId, valuesToEdit],
  );

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onBlur: bottleSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.mode === 'create') {
        try {
          const payload = {
            ...value,
            openDate: value.openDate || undefined,
            killDate: value.killDate || undefined,
          };
          const bottle = await bottleCreate({
            name: payload.name,
            type: payload.type,
            status: payload.status,
            distillery: payload.distillery || '',
            producer: payload.producer || '',
            country: payload.country || '',
            region: payload.region || '',
            price: payload.price || 0,
            age: payload.age || '',
            proof: payload.proof || 0,
            releaseYear: payload.releaseYear || 0,
            barrelInformation: payload.barrelInformation || '',
            finishing: payload.finishing || '',
            imageUrl: payload.imageUrl || '',
            openDate: payload.openDate,
            killDate: payload.killDate,
          });
          navigate({
            to: '/bottles/$bottleId',
            params: { bottleId: bottle.id as string },
          });
        } catch (error) {
          setServerError(getApiErrorMessage(error));
        }
      } else if (value.mode === 'edit') {
        if (!bottleId) {
          setServerError("Error! You can't edit an unknown bottle");
        }
        try {
          const payload = {
            ...value,
            openDate: value.openDate || undefined,
            killDate: value.killDate || undefined,
          };
          await bottleUpdate(bottleId!, {
            name: payload.name,
            type: payload.type,
            status: payload.status,
            distillery: payload.distillery || '',
            producer: payload.producer || '',
            country: payload.country || '',
            region: payload.region || '',
            price: payload.price || 0,
            age: payload.age || '',
            proof: payload.proof || 0,
            releaseYear: payload.releaseYear || 0,
            barrelInformation: payload.barrelInformation || '',
            finishing: payload.finishing || '',
            imageUrl: payload.imageUrl || '',
            openDate: payload.openDate,
            killDate: payload.killDate,
          });
          navigate({
            to: '/bottles/$bottleId',
            params: { bottleId: bottleId! },
          });
        } catch (error) {
          setServerError(getApiErrorMessage(error));
        }
      }
    },
  });

  return {
    form,
    serverError,
  };
}
