import { Field, FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const carForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();
  const { t } = useTranslation('modelFields');

  if (isLoadingFullDetails || fullDetailsError || !userFullDetails) {
    return {};
  }

  const reminderDropDownField = {
    type: 'dropDown',
    permittedValues: [
      {
        label: '1 day before',
        value: '1 day, 0:00:00'
      },
      {
        label: '1 week before',
        value: '7 days, 0:00:00'
      },
      {
        label: '2 weeks before',
        value: '14 days, 0:00:00'
      },
      {
        label: '4 weeks before',
        value: '28 days, 0:00:00'
      }
    ],
    required: false,
    displayName: t('entities.entity.reminder'),
    listMode: 'MODAL'
  } as Field;

  const dueDateMembershipField = {
    type: 'addMembers',
    required: true,
    permittedValues: {
      family: userFullDetails?.family?.users || [],
      friends: userFullDetails?.friends || []
    },
    valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
    displayName: t('entities.entity.taskMembers')
  } as Field;

  return {
    image: {
      type: 'Image',
      required: false,
      displayName: t('entities.entity.image'),
      sourceField: 'presigned_image_url'
    },
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    make: {
      type: 'string',
      required: true,
      displayName: t('entities.car.make')
    },
    model: {
      type: 'string',
      required: true,
      displayName: t('entities.car.model')
    },
    registration: {
      type: 'string',
      required: false,
      displayName: t('entities.car.registration'),
      transform: 'uppercase'
    },
    date_registered: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.date_registered')
    },
    MOT_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.MOT_due_date')
    },
    mot_reminder_timedelta: reminderDropDownField,
    mot_due_date_members: dueDateMembershipField,
    tax_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.tax_due_date')
    },
    tax_reminder_timedelta: reminderDropDownField,
    tax_due_date_members: dueDateMembershipField,
    service_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.service_due_date')
    },
    service_reminder_timedelta: reminderDropDownField,
    service_due_date_members: dueDateMembershipField,
    insurance_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.insurance_due_date')
    },
    insurance_reminder_timedelta: reminderDropDownField,
    insurance_due_date_members: dueDateMembershipField,
    warranty_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.warranty_due_date')
    },
    warranty_reminder_timedelta: reminderDropDownField,
    warranty_due_date_members: dueDateMembershipField,
    vehicle_type: {
      type: 'dropDown',
      permittedValues: [
        {
          label: 'Car',
          value: 'CAR'
        },
        {
          label: 'Motorcycle',
          value: 'MOTORBIKE'
        }
      ],
      required: true,
      displayName: t('entities.car.vehicle_type'),
      listMode: 'MODAL'
    },
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: {
        family: userFullDetails?.family?.users || [],
        friends: userFullDetails?.friends || []
      },
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.members')
    }
  };
};
