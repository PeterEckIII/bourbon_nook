import { useId, useState } from 'react';
import { useFieldContext } from '../../hooks/form-context';
import { useCategoriesWithSystemNotesSuspense } from '../../api/generated/reviews-api';

export interface TagNoteSelection {
  noteId?: string;
  categoryId: string;
  categoryName: string;
  noteName: string;
  score: number;
}

interface TagNotesFieldProps {
  label: string;
}

const DEFAULT_SCORE = 5;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TagNotesField({ label }: TagNotesFieldProps) {
  const field = useFieldContext<TagNoteSelection[]>();
  const { data: categories } = useCategoriesWithSystemNotesSuspense();
  const id = useId();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const selections = field.state.value;

  function findSelection(categoryId: string, noteName: string) {
    return selections.find((s) => s.categoryId === categoryId && s.noteName === noteName);
  }

  function addNote(categoryId: string, categoryName: string, noteName: string) {
    field.handleChange([...selections, { categoryId, categoryName, noteName, score: DEFAULT_SCORE }]);
  }

  function removeNote(categoryId: string, noteName: string) {
    field.handleChange(
      selections.filter((s) => !(s.categoryId === categoryId && s.noteName === noteName)),
    );
  }

  function updateScore(categoryId: string, noteName: string, score: number) {
    field.handleChange(
      selections.map((s) =>
        s.categoryId === categoryId && s.noteName === noteName ? { ...s, score } : s,
      ),
    );
  }

  return (
    <fieldset className="flex w-full flex-col gap-3">
      <legend className="text-sm font-medium tracking-wide text-ink">{label}</legend>

      {selections.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {selections.map((s) => (
            <li
              key={`${s.categoryId}-${s.noteName}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/70 bg-amber-600/20 px-3 py-1 text-sm text-amber-50"
            >
              <span>
                {s.categoryName} — {s.noteName}
              </span>
              <span className="font-semibold">{s.score}</span>
              <button
                type="button"
                aria-label={`Remove ${s.categoryName} — ${s.noteName}`}
                onClick={() => removeNote(s.categoryId, s.noteName)}
                className="text-amber-100/60 hover:text-amber-50"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="divide-y divide-amber-900/20 rounded-md border border-amber-900/40 bg-[#2a150d]">
        {categories.map((category) => {
          const categoryId = category.id!;
          const categoryName = category.name!;
          const notes = category.systemNotes ?? [];
          const isExpanded = expandedCategoryId === categoryId;
          const selectedCount = selections.filter((s) => s.categoryId === categoryId).length;

          return (
            <div key={categoryId}>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`${id}-${categoryId}-panel`}
                onClick={() => setExpandedCategoryId(isExpanded ? null : categoryId)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-amber-50 hover:bg-amber-600/10"
              >
                <span className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`h-3.5 w-3.5 shrink-0 text-amber-100/60 transition-transform duration-150 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {capitalize(categoryName)}
                </span>
                {selectedCount > 0 && (
                  <span className="rounded-full bg-amber-600/30 px-2 py-0.5 text-xs text-amber-50">
                    {selectedCount}
                  </span>
                )}
              </button>
              {isExpanded && (
                <div id={`${id}-${categoryId}-panel`} className="flex flex-wrap gap-2 px-3 pb-3">
                  {notes.map((note) => {
                    const noteName = note.name!;
                    const selection = findSelection(categoryId, noteName);
                    if (selection) {
                      return (
                        <span
                          key={noteName}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/70 bg-amber-600/20 px-2.5 py-1 text-sm text-amber-50"
                        >
                          <button
                            type="button"
                            aria-pressed="true"
                            onClick={() => removeNote(categoryId, noteName)}
                          >
                            {noteName}
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={selection.score}
                            aria-label={`${noteName} score, 0 to 10`}
                            onChange={(e) => updateScore(categoryId, noteName, e.target.valueAsNumber)}
                            className="w-10 rounded border border-amber-900/40 bg-[#2a150d] px-1 py-0.5 text-center text-xs text-amber-50 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/70"
                          />
                        </span>
                      );
                    }
                    return (
                      <button
                        key={noteName}
                        type="button"
                        aria-pressed="false"
                        onClick={() => addNote(categoryId, categoryName, noteName)}
                        className="rounded-full border border-amber-900/40 bg-transparent px-2.5 py-1 text-sm text-amber-100/80 hover:border-amber-500/70 hover:text-amber-50"
                      >
                        {noteName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
