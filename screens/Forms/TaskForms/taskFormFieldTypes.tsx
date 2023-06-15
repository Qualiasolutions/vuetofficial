import { FlatFormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';

export const useTaskTopFieldTypes = (
  isEdit: boolean = false,
  taskHiddenTag: string = ''
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { data: userFullDetails } = useGetUserDetails();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      title: {
        type: 'string',
        required: true,
        displayName: t('tasks.task.title'),
        disabled: !!(isEdit && taskHiddenTag) // If has hidden tag then shouldn't be editable
      },
      members: {
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: userFullDetails?.family?.users || [],
          friends: userFullDetails?.friends || []
        },
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members')
      }
    };
  }, [t, userFullDetails, isEdit, taskHiddenTag]);
};

export const useDueDateFieldTypes = (
  isEdit: boolean = false,
  taskHiddenTag: string = ''
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { data: userFullDetails } = useGetUserDetails();
  const { data: allRoutines } = useGetAllRoutinesQuery();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      title: {
        type: 'string',
        required: true,
        displayName: t('tasks.task.title'),
        disabled: !!(isEdit && taskHiddenTag) // If has hidden tag then shouldn't be editable
      },
      members: {
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: userFullDetails?.family?.users || [],
          friends: userFullDetails?.friends || []
        },
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members')
      },
      date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.due_date.date')
      },
      duration: {
        type: 'duration',
        required: true,
        displayName: t('tasks.task.duration_minutes')
      },
      reminders: {
        type: 'multiRecurrenceSelector',
        required: false,
        reverse: true,
        firstOccurrenceField: 'date',
        displayName: t('tasks.task.reminders'),
        max: 3
      },
      tags: {
        type: 'tagSelector',
        required: true
      },
      routine: {
        type: 'dropDown',
        required: false,
        displayName: t('tasks.task.routine'),
        permittedValues: allRoutines
          ? Object.values(allRoutines.byId).map((routine) => ({
              value: routine.id,
              label: routine.name
            }))
          : [],
        listMode: 'MODAL'
      }
    };
  }, [userFullDetails, t, isEdit, taskHiddenTag, allRoutines]);
};

export const useTaskMiddleFieldTypes = (
  disableFlexible: boolean = false,
  disabledRecurrenceFields: boolean = false
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return useMemo(() => {
    return {
      is_flexible: {
        type: 'checkbox',
        required: false,
        displayName: t('tasks.task.is_flexible'),
        hidden: disableFlexible
      },
      start_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.start_datetime'),
        disabled: disabledRecurrenceFields,
        associatedEndTimeField: 'end_datetime',
        shownFields: {
          is_flexible: false
        }
      },
      end_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.end_datetime'),
        disabled: disabledRecurrenceFields,
        associatedStartTimeField: 'start_datetime',
        shownFields: {
          is_flexible: false
        }
      },
      duration_minutes_calculated: {
        type: 'calculatedDuration',
        displayName: t('tasks.task.duration_minutes'),
        disabled: true,
        required: false,
        startFieldName: 'start_datetime',
        endFieldName: 'end_datetime',
        shownFields: {
          is_flexible: false
        }
      },
      earliest_action_date: {
        type: 'Date',
        displayName: t('tasks.task.earliest_action_date'),
        required: true,
        shownFields: {
          is_flexible: true
        }
      },
      due_date: {
        type: 'Date',
        displayName: t('tasks.task.due_date'),
        required: true,
        shownFields: {
          is_flexible: true
        }
      },
      duration_minutes: {
        type: 'duration',
        displayName: t('tasks.task.duration_minutes'),
        disabled: true,
        required: true,
        shownFields: {
          is_flexible: true
        }
      },
      recurrence: {
        type: 'recurrenceSelector',
        required: false,
        firstOccurrenceField: 'start_datetime',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields,
        shownFields: {
          is_flexible: false
        }
      },
      reminders: {
        type: 'multiRecurrenceSelector',
        required: false,
        reverse: true,
        firstOccurrenceField: 'start_datetime',
        displayName: t('tasks.task.reminders'),
        max: 3
      },
      tags: {
        type: 'tagSelector',
        required: true
      }
    };
  }, [t, disabledRecurrenceFields, disableFlexible]);
};

export const useTaskBottomFieldTypes = (): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return useMemo(() => {
    return {
      location: {
        type: 'string',
        required: false,
        displayName: t('tasks.task.location')
      },
      contact_name: {
        type: 'string',
        required: false,
        displayName: t('tasks.task.contact_name')
      },
      contact_email: {
        type: 'string',
        required: false,
        displayName: t('tasks.task.contact_email')
      },
      contact_number: {
        type: 'phoneNumber',
        required: false,
        displayName: t('tasks.task.contact_number')
      },
      notes: {
        type: 'TextArea',
        required: false,
        displayName: t('tasks.task.notes')
      }
    };
  }, [t]);
};
