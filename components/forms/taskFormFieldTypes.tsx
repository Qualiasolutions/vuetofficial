import { Field, FlatFormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import {
  AccommodationTaskType,
  AnniversaryTaskType,
  TransportTaskType
} from 'types/tasks';
import { TFunction } from 'i18next';

const defaultTagSelector = (t: TFunction): Field => ({
  type: 'tagSelector',
  required: true,
  displayName: t('tasks.task.tags'),
  helpText: t('tasks.helpText.tags')
});

const defaultIsFlexible = (t: TFunction, disableFlexible?: boolean): Field => ({
  type: 'checkbox',
  required: false,
  displayName: t('tasks.task.is_flexible'),
  hidden: !!disableFlexible,
  forceUnchecked: ['is_any_time'],
  helpText: t('tasks.helpText.is_flexible'),
  shownFields: [
    {
      is_any_time: false
    }
  ]
});

const defaultIsAnyTime = (t: TFunction, disabled?: boolean): Field => ({
  type: 'checkbox',
  required: false,
  displayName: t('tasks.task.is_any_time'),
  disabled: !!disabled,
  forceUnchecked: ['is_flexible'],
  helpText: t('tasks.helpText.is_any_time'),
  shownFields: [
    {
      is_flexible: false
    }
  ]
});

const defaultActions = (t: TFunction): Field => ({
  type: 'actionsSelector',
  required: false,
  displayName: t('tasks.task.actions'),
  helpText: t('tasks.helpText.actions')
});

const defaultReminders = (t: TFunction): Field => ({
  type: 'reminderSelector',
  required: false,
  displayName: t('tasks.task.reminders'),
  helpText: t('tasks.helpText.reminders')
});

export const useTaskFieldTypes = ({
  isEdit = false,
  taskHiddenTag = '',
  disableFlexible = false,
  disabledRecurrenceFields = false,
  allowRecurrence = true
}: {
  isEdit?: boolean;
  taskHiddenTag?: string;
  disableFlexible?: boolean;
  disabledRecurrenceFields?: boolean;
  allowRecurrence?: boolean;
}): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { data: allRoutines } = useGetAllRoutinesQuery();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: defaultTagSelector(t),
      title: {
        type: 'string',
        required: true,
        displayName: t('tasks.task.title'),
        disabled: !!(isEdit && taskHiddenTag) // If has hidden tag then shouldn't be editable
      },
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.task.changeMembers')
      },
      is_flexible: defaultIsFlexible(t, disableFlexible),
      is_any_time: defaultIsAnyTime(t, disabledRecurrenceFields),
      start_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.start_datetime'),
        disabled: disabledRecurrenceFields,
        associatedEndTimeField: 'end_datetime',
        shownFields: [
          {
            is_flexible: false,
            is_any_time: false
          }
        ]
      },
      end_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.end_datetime'),
        disabled: disabledRecurrenceFields,
        associatedStartTimeField: 'start_datetime',
        shownFields: [
          {
            is_flexible: false,
            is_any_time: false
          }
        ]
      },
      duration_minutes_calculated: {
        type: 'calculatedDuration',
        displayName: t('tasks.task.duration'),
        disabled: true,
        required: false,
        startFieldName: 'start_datetime',
        endFieldName: 'end_datetime',
        shownFields: [
          {
            is_flexible: false,
            is_any_time: false
          }
        ]
      },
      earliest_action_date: {
        type: 'Date',
        displayName: t('tasks.task.earliest_action_date'),
        required: true,
        shownFields: [
          {
            is_flexible: true
          }
        ]
      },
      due_date: {
        type: 'Date',
        displayName: t('tasks.task.due_date'),
        required: true,
        shownFields: [
          {
            is_flexible: true
          }
        ]
      },
      date: {
        type: 'Date',
        displayName: t('tasks.task.date'),
        required: true,
        disabled: disabledRecurrenceFields,
        shownFields: [
          {
            is_flexible: false,
            is_any_time: true
          }
        ]
      },
      duration: {
        type: 'duration',
        displayName: t('tasks.task.duration'),
        disabled: disabledRecurrenceFields,
        required: true,
        shownFields: [
          {
            is_flexible: true
          },
          {
            is_any_time: true
          }
        ]
      },
      recurrence: {
        type: 'recurrenceSelector',
        required: false,
        firstOccurrenceField: 'start_datetime',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields,
        shownFields: [
          {
            is_flexible: false,
            is_any_time: false
          }
        ],
        hidden: !allowRecurrence
      },
      date_recurrence: {
        type: 'recurrenceSelector',
        required: false,
        firstOccurrenceField: 'date',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields,
        sourceField: 'recurrence',
        targetField: 'recurrence',
        shownFields: [
          {
            is_flexible: false,
            is_any_time: true
          }
        ],
        hidden: !allowRecurrence
      },
      actions: {
        ...defaultActions(t),
        shownFields: [
          {
            is_flexible: false
          }
        ]
      },
      reminders: {
        ...defaultReminders(t),
        shownFields: [
          {
            is_any_time: false,
            is_flexible: false
          }
        ]
      },
      date_reminders: {
        ...defaultReminders(t),
        shownFields: [
          {
            is_any_time: true,
            is_flexible: false
          }
        ]
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
        listMode: 'MODAL',
        shownFields: [
          {
            is_any_time: true
          },
          {
            is_flexible: true
          }
        ],
        helpText: t('tasks.helpText.routine')
      }
    };
  }, [
    t,
    isEdit,
    taskHiddenTag,
    allRoutines,
    allowRecurrence,
    disableFlexible,
    disabledRecurrenceFields
  ]);
};

export const useDueDateFieldTypes = (
  isEdit: boolean = false,
  taskHiddenTag: string = '',
  disabledRecurrenceFields: boolean = false,
  allowRecurrence: boolean = true
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { data: allRoutines } = useGetAllRoutinesQuery();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: defaultTagSelector(t),
      title: {
        type: 'string',
        required: true,
        displayName: t('tasks.task.title'),
        disabled: !!(isEdit && taskHiddenTag) // If has hidden tag then shouldn't be editable
      },
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.task.changeMembers')
      },
      date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.due_date.date'),
        disabled: disabledRecurrenceFields
      },
      duration: {
        type: 'duration',
        required: true,
        displayName: t('tasks.task.duration')
      },
      recurrence: {
        type: 'recurrenceSelector',
        required: false,
        firstOccurrenceField: 'date',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields,
        hidden: !allowRecurrence
      },
      actions: defaultActions(t),
      reminders: defaultReminders(t),
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
        listMode: 'MODAL',
        helpText: t('tasks.helpText.routine')
      }
    };
  }, [
    t,
    isEdit,
    taskHiddenTag,
    allRoutines,
    disabledRecurrenceFields,
    allowRecurrence
  ]);
};

export const useTransportFieldTypes = (
  type?: TransportTaskType
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: defaultTagSelector(t),
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.task.changeMembers')
      },
      carrier: {
        type: 'string',
        required: true,
        displayName: t('entities.mode-of-transport.carrier'),
        hidden: type === 'DRIVE_TIME'
      },
      booking_number: {
        type: 'string',
        required: false,
        displayName: t('tasks.transportTask.booking_number'),
        hidden: type === 'DRIVE_TIME'
      },
      flight_number: {
        type: 'string',
        required: false,
        hidden: type !== 'FLIGHT',
        displayName: t('tasks.transportTask.flight_number')
      },
      start_location: {
        type: 'string',
        required: type !== 'DRIVE_TIME',
        displayName:
          type === 'RENTAL_CAR'
            ? t('tasks.transportTask.pickup_location')
            : t('tasks.transportTask.start_location')
      },
      end_location: {
        type: 'string',
        required: type !== 'DRIVE_TIME',
        displayName:
          type === 'RENTAL_CAR'
            ? t('tasks.transportTask.dropoff_location')
            : t('tasks.transportTask.end_location')
      },
      is_any_time: defaultIsAnyTime(t),
      start_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.start_datetime'),
        utc: true,
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      start_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('tasks.task.start_timezone'),
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      end_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.end_datetime'),
        utc: true,
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      end_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('tasks.task.end_timezone'),
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      start_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.start_date'),
        utc: true,
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      end_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.end_date'),
        utc: true,
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      actions: defaultActions(t),
      reminders: defaultReminders(t)
    };
  }, [t, type]);
};

export const useAccommodationFieldTypes = (
  type?: AccommodationTaskType
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: defaultTagSelector(t),
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.task.changeMembers')
      },
      accommodation_name: {
        type: 'string',
        required: true,
        displayName:
          type === 'HOTEL'
            ? t('tasks.accommodationTask.hotelName')
            : t('tasks.accommodationTask.friendName')
      },
      is_any_time: defaultIsAnyTime(t),
      start_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.start_datetime'),
        utc: true,
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      start_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('tasks.task.start_timezone'),
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      end_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('tasks.task.end_datetime'),
        utc: true,
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      end_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('tasks.task.end_timezone'),
        shownFields: [
          {
            is_any_time: false
          }
        ]
      },
      start_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.start_date'),
        utc: true,
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      end_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.end_date'),
        utc: true,
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      actions: defaultActions(t),
      reminders: defaultReminders(t)
    };
  }, [t, type]);
};

export const useAnniversaryFieldTypes = (
  type: AnniversaryTaskType,
  disabledRecurrenceFields: boolean = false
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { t: baseT } = useTranslation();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: {
        ...defaultTagSelector(t),
        extraTagOptions:
          type === 'BIRTHDAY'
            ? {
                SOCIAL_INTERESTS: [
                  {
                    value: 'SOCIAL_INTERESTS__BIRTHDAY',
                    label: baseT('tags.SOCIAL_INTERESTS__BIRTHDAY')
                  }
                ]
              }
            : {
                SOCIAL_INTERESTS: [
                  {
                    value: 'SOCIAL_INTERESTS__ANNIVERSARY',
                    label: baseT('tags.SOCIAL_INTERESTS__ANNIVERSARY')
                  }
                ]
              }
      },
      title: {
        type: 'string',
        required: true,
        hidden: type === 'BIRTHDAY',
        displayName: t('tasks.anniversaryTask.name')
      },
      first_name: {
        type: 'string',
        required: true,
        hidden: type !== 'BIRTHDAY',
        displayName: t('tasks.birthdayTask.firstName')
      },
      last_name: {
        type: 'string',
        required: false,
        hidden: type !== 'BIRTHDAY',
        displayName: t('tasks.birthdayTask.lastName')
      },
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.anniversaryTask.changeMembers')
      },
      date: {
        type: 'OptionalYearDate',
        required: true,
        displayName:
          type === 'BIRTHDAY'
            ? t('tasks.birthdayTask.dateOfBirth')
            : t('tasks.anniversaryTask.start'),
        knownYearField: 'known_year'
      },
      recurrence: {
        type: 'recurrenceSelector',
        required: true,
        firstOccurrenceField: 'date',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields
      },
      actions: defaultActions(t),
      reminders: defaultReminders(t)
    };
  }, [t, baseT, disabledRecurrenceFields, type]);
};

export const useHolidayFieldTypes = (
  disabledRecurrenceFields: boolean = false
): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const { t: baseT } = useTranslation();

  return useMemo<FlatFormFieldTypes>(() => {
    return {
      tagsAndEntities: {
        ...defaultTagSelector(t),
        extraTagOptions: {
          SOCIAL_INTERESTS: [
            {
              value: 'SOCIAL_INTERESTS__HOLIDAY',
              label: baseT('tags.SOCIAL_INTERESTS__HOLIDAY')
            }
          ]
        }
      },
      title: {
        type: 'string',
        required: true,
        displayName: t('tasks.task.title')
      },
      members: {
        type: 'addMembers',
        required: true,
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('tasks.task.members'),
        changeMembersText: t('tasks.task.changeMembers')
      },
      start_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.start_date')
      },
      end_date: {
        type: 'Date',
        required: true,
        displayName: t('tasks.task.end_date')
      },
      recurrence: {
        type: 'recurrenceSelector',
        required: false,
        firstOccurrenceField: 'start_date',
        displayName: t('tasks.task.recurrence'),
        disabled: disabledRecurrenceFields
      },
      actions: defaultActions(t),
      reminders: defaultReminders(t)
    };
  }, [t, baseT, disabledRecurrenceFields]);
};
