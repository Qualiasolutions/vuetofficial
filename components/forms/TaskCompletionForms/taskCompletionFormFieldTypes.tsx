import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiddenTagType } from 'types/tasks';
import dueDateMembershipField from '../entityFormFieldTypes/utils/dueDateMembershipField';
import reminderDropDownField from '../entityFormFieldTypes/utils/reminderDropDownField';
import { FieldValueTypes } from '../types';

export default function useCompletionFormFieldTypes(
  hiddenTag: HiddenTagType | ''
) {
  const { t: modelFieldTranslations } = useTranslation('modelFields');
  const { data: userFullDetails } = useGetUserFullDetails();

  return useMemo(() => {
    if (!userFullDetails) {
      return {} as FieldValueTypes;
    }

    if (
      [
        'MOT_DUE',
        'INSURANCE_DUE',
        'SERVICE_DUE',
        'WARRANTY_DUE',
        'TAX_DUE'
      ].includes(hiddenTag)
    ) {
      return {
        date: {
          type: 'Date',
          required: true,
          displayName: modelFieldTranslations('tasks.task.date')
        },
        reminder_interval: reminderDropDownField(
          'date',
          modelFieldTranslations('entities.entity.reminder'),
          false
        ),
        members: dueDateMembershipField(
          'date',
          userFullDetails,
          false,
          modelFieldTranslations('entities.entity.taskMembers'),
          modelFieldTranslations('tasks.task.changeMembers')
        )
      };
    }
  }, [userFullDetails, modelFieldTranslations, hiddenTag]);
}
