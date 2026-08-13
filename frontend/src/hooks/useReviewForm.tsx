import { z } from 'zod';
import { useAppForm } from './form';
import { reviewCreate, reviewUpdate, type ReviewResponseModel } from '../api/generated/reviews-api';
import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getApiErrorMessage } from '../api/errors';

const reviewSchema = z.object({
  bottleId: z.string(),
  setting: z.string().min(1, 'Setting is required'),
  reviewDate: z.iso.date().or(z.literal('')).optional(),
  restTimeMin: z.number(),
  glassware: z.string().min(1, 'Glassware is required'),
  nose: z.string().min(1, 'Please provide a value for nose'),
  palate: z.string().min(1, 'Please provide a value for palate'),
  finish: z.string().min(1, 'Please provide a value for finish'),
  thoughts: z.string().min(1, 'Please provide a value for thoughts'),
  valueScore: z.number().min(0, 'Please provide a value score').max(10),
  overallRating: z.number().min(0, 'Please provide an overall rating').max(10),
  mode: z.enum(['create', 'edit']),
  reviewId: z.string().optional(),
});

type Review = z.infer<typeof reviewSchema>;

const defaultValues: Review = {
  bottleId: '',
  setting: '',
  reviewDate: '',
  restTimeMin: 0,
  glassware: '',
  nose: '',
  palate: '',
  finish: '',
  thoughts: '',
  valueScore: 0,
  overallRating: 0,
  mode: 'create',
  reviewId: '',
};

export default function useReviewForm({
  valuesToEdit,
  reviewId,
}: {
  valuesToEdit?: ReviewResponseModel;
  reviewId?: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const initialValues = useMemo(
    () =>
      valuesToEdit
        ? {
            ...defaultValues,
            ...valuesToEdit,
            mode: 'edit',
            reviewId: reviewId ?? '',
          }
        : defaultValues,
    [reviewId, valuesToEdit],
  );

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onBlur: reviewSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.mode === 'create') {
        try {
          const payload = {
            ...value,
            reviewDate: value.reviewDate || '',
          };
          const review = await reviewCreate({
            bottleId: payload.bottleId,
            setting: payload.setting,
            reviewDate: payload.reviewDate,
            restTimeMin: payload.restTimeMin,
            glassware: payload.glassware,
            nose: payload.nose,
            palate: payload.palate,
            finish: payload.finish,
            thoughts: payload.thoughts,
            valueScore: payload.valueScore,
            overallRating: payload.overallRating,
          });
          navigate({
            to: '/reviews/$reviewId',
            params: { reviewId: review.id as string },
          });
        } catch (error) {
          setServerError(getApiErrorMessage(error));
        }
      } else if (value.mode === 'edit') {
        if (!reviewId) {
          setServerError("Error! You can't edit an unknown bottle");
        }
        try {
          const payload = {
            ...value,
            reviewDate: value.reviewDate || '',
          };
          await reviewUpdate(reviewId!, {
            bottleId: payload.bottleId,
            setting: payload.setting,
            reviewDate: payload.reviewDate,
            restTimeMin: payload.restTimeMin,
            glassware: payload.glassware,
            nose: payload.nose,
            palate: payload.palate,
            finish: payload.finish,
            thoughts: payload.thoughts,
            valueScore: payload.valueScore,
            overallRating: payload.overallRating,
          });
          navigate({
            to: '/reviews/$reviewId',
            params: { reviewId: reviewId as string },
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
