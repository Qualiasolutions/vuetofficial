import { TransparentView } from 'components/molecules/ViewComponents';
import { useMemo } from 'react';
import { Recurrence } from 'types/tasks';
import RecurrenceSelector from './RecurrenceSelector';

type Props = {
  value: (Recurrence | null)[] | null;
  reverse?: boolean;
  firstOccurrence: Date;
  disabled?: boolean;
  max?: number;
  onChange: (recurrences: (Recurrence | null)[]) => void;
};
export default function MultipleRecurrenceSelector({
  value,
  reverse,
  firstOccurrence,
  disabled,
  onChange,
  max
}: Props) {
  const recurrences = useMemo(() => {
    if (max && value && value.length >= max) {
      return value;
    }
    return [...(value || []), null];
  }, [value, max]);

  const existingRecurrences = recurrences.map((recurrence, i) => (
    <RecurrenceSelector
      key={i}
      value={recurrence}
      reverse={reverse}
      firstOccurrence={firstOccurrence}
      disabled={disabled}
      onChange={(newRecurrence) => {
        if (newRecurrence) {
          onChange(
            recurrences
              .map((oldRecurrence) =>
                oldRecurrence === recurrence ? newRecurrence : oldRecurrence
              )
              .filter((r) => r)
          );
        } else {
          onChange(
            (value || [])
              .filter((oldRecurrence) => oldRecurrence !== recurrence)
              .filter((r) => r)
          );
        }
      }}
    />
  ));

  return <TransparentView>{existingRecurrences}</TransparentView>;
}
