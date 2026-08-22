import { z } from 'zod';
import { useAppForm } from './form';
import {
  getUserReviewsQueryKey,
  getReviewQueryKey,
  useReviewCreate,
  useReviewUpdate,
  useAddNotesToReview,
  useDeleteNoteFromReview,
  useUpdateNoteScore,
  type ReviewResponseModel,
  type AddNoteToReviewRequest,
} from '../api/generated/reviews-api';
import type { TagNoteSelection } from '../components/Inputs/TagNotesField';
import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getApiErrorMessage } from '../api/errors';
import { useQueryClient } from '@tanstack/react-query';

const tagNoteSchema = z.object({
  noteId: z.string().optional(),
  categoryId: z.string(),
  categoryName: z.string(),
  noteName: z.string(),
  score: z.number().min(0).max(10),
});

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
  reviewNotes: z.array(tagNoteSchema),
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
  reviewNotes: [],
};

export default function useReviewForm({
  valuesToEdit,
  reviewId,
  bottleId,
}: {
  valuesToEdit?: ReviewResponseModel;
  reviewId?: string;
  bottleId?: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const initialNotes: TagNoteSelection[] = useMemo(
    () =>
      (valuesToEdit?.reviewNotes ?? []).map((note) => ({
        noteId: note.noteId,
        categoryId: note.categoryId ?? '',
        categoryName: note.categoryName ?? '',
        noteName: note.noteName ?? '',
        score: note.score ?? 0,
      })),
    [valuesToEdit],
  );

  const initialValues = useMemo(
    () =>
      valuesToEdit
        ? {
            ...defaultValues,
            ...valuesToEdit,
            mode: 'edit',
            reviewId: reviewId ?? '',
            reviewNotes: initialNotes,
          }
        : {
            ...defaultValues,
            bottleId: bottleId ?? '',
          },
    [reviewId, valuesToEdit, bottleId, initialNotes],
  );

  const queryClient = useQueryClient();

  const reviewCreateMutation = useReviewCreate({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getUserReviewsQueryKey() });
      },
    },
  });

  const reviewUpdateMutation = useReviewUpdate({
    mutation: {
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries({ queryKey: getUserReviewsQueryKey() });
        await queryClient.invalidateQueries({
          queryKey: getReviewQueryKey(variables.reviewId),
        });
      },
    },
  });

  const addNotesToReviewMutation = useAddNotesToReview();
  const deleteNoteFromReviewMutation = useDeleteNoteFromReview();
  const updateNoteScoreMutation = useUpdateNoteScore();

  function toAddNoteRequest(note: TagNoteSelection): AddNoteToReviewRequest {
    return { categoryId: note.categoryId, name: note.noteName, score: note.score };
  }

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
          const review = await reviewCreateMutation.mutateAsync({
            data: {
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
            },
          });
          if (payload.reviewNotes.length > 0) {
            try {
              await addNotesToReviewMutation.mutateAsync({
                reviewId: review.id as string,
                data: payload.reviewNotes.map(toAddNoteRequest),
              });
            } catch (notesError) {
              console.error('Failed to attach tag notes to review', notesError);
            }
          }
          await navigate({
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
          await reviewUpdateMutation.mutateAsync({
            reviewId: reviewId!,
            data: {
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
            },
          });

          const initialById = new Map(
            initialNotes.filter((note) => note.noteId).map((note) => [note.noteId, note]),
          );
          const currentById = new Map(
            payload.reviewNotes.filter((note) => note.noteId).map((note) => [note.noteId, note]),
          );
          const notesToAdd = payload.reviewNotes.filter((note) => !note.noteId);
          const notesToRemove = initialNotes.filter(
            (note) => note.noteId && !currentById.has(note.noteId),
          );
          const notesToUpdate = payload.reviewNotes.filter(
            (note) => note.noteId && initialById.get(note.noteId)?.score !== note.score,
          );

          try {
            await Promise.all([
              notesToAdd.length > 0
                ? addNotesToReviewMutation.mutateAsync({
                    reviewId: reviewId!,
                    data: notesToAdd.map(toAddNoteRequest),
                  })
                : Promise.resolve(),
              ...notesToRemove.map((note) =>
                deleteNoteFromReviewMutation.mutateAsync({
                  reviewId: reviewId!,
                  noteId: note.noteId!,
                }),
              ),
              ...notesToUpdate.map((note) =>
                updateNoteScoreMutation.mutateAsync({
                  reviewId: reviewId!,
                  noteId: note.noteId!,
                  data: { score: note.score },
                }),
              ),
            ]);
          } catch (notesError) {
            console.error('Failed to update tag notes on review', notesError);
          }

          if (notesToAdd.length > 0 || notesToRemove.length > 0 || notesToUpdate.length > 0) {
            await queryClient.invalidateQueries({ queryKey: getReviewQueryKey(reviewId!) });
          }

          await navigate({
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
