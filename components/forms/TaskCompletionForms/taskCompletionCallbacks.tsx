import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCreateTaskMutation } from 'reduxStore/services/api/tasks';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { FieldValueTypes } from '../types';

export default function useCompletionCallback(taskId: number) {
  const [createTask] = useCreateTaskMutation();
  const task = useSelector(selectTaskById(taskId));

  const { t } = useTranslation();

  if (
    task?.hidden_tag &&
    [
      'MOT_DUE',
      'INSURANCE_DUE',
      'SERVICE_DUE',
      'WARRANTY_DUE',
      'TAX_DUE'
    ].includes(task.hidden_tag)
  ) {
    return async (parsedFormValues: FieldValueTypes) => {
      const timeDeltaMapping: { [key: string]: string } = {
        DAILY: '1 day, 00:00:00',
        WEEKLY: '7 days, 00:00:00',
        MONTHLY: '30 days, 00:00:00'
      };
      await createTask({
        hidden_tag: task.hidden_tag,
        resourcetype: 'FixedTask',
        date: parsedFormValues.date,
        duration: 30,
        members: parsedFormValues.members,
        title: t('components.entityPages.car.dueDateTitle', {
          dueDateType: t(`hiddenTags.${task.hidden_tag}`)
        }),
        actions: parsedFormValues.reminder_interval
          ? [
              {
                action_timedelta:
                  timeDeltaMapping[parsedFormValues.reminder_interval]
              }
            ]
          : [],
        entities: task.entities,
        type: 'DUE_DATE'
      }).unwrap();
    };
  }

  return () => {};
}
