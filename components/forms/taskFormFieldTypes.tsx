import {
  DateField,
  Field,
  FlatFormFieldTypes
} from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import {
  AccommodationTaskType,
  AnniversaryTaskType,
  FixedTaskResponseType,
  TaskType,
  TransportTaskType
} from 'types/tasks';
import { TFunction } from 'i18next';
import { FormType } from 'screens/Forms/TaskForms/AddTaskScreen';
import {
  isAccommodationTaskType,
  isAnniversaryTaskType,
  isTransportTaskType,
  useFormType
} from 'constants/TaskTypes';

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

const defaultStartDate = (t: TFunction): DateField => ({
  type: 'Date',
  required: true,
  displayName: t('tasks.task.start_date'),
  associatedEndDateField: 'end_date'
});

const defaultEndDate = (t: TFunction): DateField => ({
  type: 'Date',
  required: true,
  displayName: t('tasks.task.end_date'),
  associatedStartDateField: 'start_date'
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
      is_any_time: defaultIsAnyTime(t, disabledRecurrenceFields),
      is_all_day: {
        type: 'checkbox',
        required: false,
        displayName: t('tasks.task.is_all_day'),
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      start_date: {
        ...defaultStartDate(t),
        shownFields: [
          {
            is_any_time: true,
            is_all_day: true
          }
        ]
      },
      end_date: {
        ...defaultEndDate(t),
        shownFields: [
          {
            is_any_time: true,
            is_all_day: true
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
            is_any_time: true,
            is_all_day: false
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
            is_any_time: true,
            is_all_day: false
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

export const useDueDateFieldTypes = ({
  isEdit,
  taskHiddenTag,
  disabledRecurrenceFields,
  allowRecurrence
}: {
  isEdit?: boolean;
  taskHiddenTag?: string;
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
      is_any_time: defaultIsAnyTime(t),
      start_date: {
        ...defaultStartDate(t),
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      end_date: {
        ...defaultEndDate(t),
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
      is_any_time: defaultIsAnyTime(t),
      start_date: {
        ...defaultStartDate(t),
        shownFields: [
          {
            is_any_time: true
          }
        ]
      },
      end_date: {
        ...defaultEndDate(t),
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

export const useAnniversaryFieldTypes = ({
  type,
  disabledRecurrenceFields
}: {
  type: AnniversaryTaskType;
  disabledRecurrenceFields?: boolean;
}): FlatFormFieldTypes => {
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
        changeMembersText: t('tasks.task.showOnWhoseCalendar')
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
        changeMembersText: t('tasks.task.showOnWhoseCalendar')
      },
      start_date: defaultStartDate(t),
      end_date: defaultEndDate(t),
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

export const useFieldTypesForFormType = (
  type: FormType | null,
  opts: {
    isEdit?: boolean;
    allowRecurrence?: boolean;
    taskHiddenTag?: string;
    disableFlexible?: boolean;
    disabledRecurrenceFields?: boolean;
    accommodationType?: AccommodationTaskType;
    anniversaryType?: AnniversaryTaskType;
    transportType?: TransportTaskType;
  }
) => {
  const taskFieldTypes = useTaskFieldTypes(opts);
  const dueDateFieldTypes = useDueDateFieldTypes(opts);
  const holidayFieldTypes = useHolidayFieldTypes(opts.disabledRecurrenceFields);
  const accommodationFieldTypes = useAccommodationFieldTypes(
    opts.accommodationType
  );
  const anniversaryFieldTypes = useAnniversaryFieldTypes({
    ...opts,
    type: opts.anniversaryType || 'BIRTHDAY'
  });
  const transportFieldTypes = useTransportFieldTypes(opts.transportType);

  if (!type) {
    return {};
  }

  if (type === 'ACCOMMODATION') return accommodationFieldTypes;
  if (type === 'ANNIVERSARY') return anniversaryFieldTypes;
  if (type === 'TRANSPORT') return transportFieldTypes;
  if (type === 'DUE_DATE') return dueDateFieldTypes;
  if (type === 'HOLIDAY') return holidayFieldTypes;

  return taskFieldTypes;
};

export const useFieldTypesForTask = (task?: FixedTaskResponseType) => {
  const taskType = task?.type;
  const formType = useFormType(taskType || '');

  return useFieldTypesForFormType(formType, {
    isEdit: true,
    allowRecurrence: true,
    taskHiddenTag: task?.hidden_tag,
    disableFlexible: true,
    disabledRecurrenceFields: !!(task && task?.recurrence),
    anniversaryType:
      taskType && isAnniversaryTaskType(taskType) ? taskType : undefined,
    transportType:
      taskType && isTransportTaskType(taskType) ? taskType : undefined,
    accommodationType:
      taskType && isAccommodationTaskType(taskType) ? taskType : undefined
  });
};
