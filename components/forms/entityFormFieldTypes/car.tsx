import {
  Field,
  FlatFormFieldTypes,
  FormFieldTypes
} from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const useCarForm = (isEdit: boolean): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();
  const { t } = useTranslation('modelFields');

  const reminderDropDownField = useMemo(
    () => (dueDateFieldName: string) =>
      ({
        type: 'dropDown',
        permittedValues: [
          {
            label: '1 day before',
            value: 'DAILY'
          },
          {
            label: '1 week before',
            value: 'WEEKLY'
          },
          {
            label: '1 month before',
            value: 'MONTHLY'
          }
        ],
        required: false,
        displayName: t('entities.entity.reminder'),
        listMode: 'MODAL',
        hidden: isEdit,
        initialValue: 'MONTHLY',
        shownFields: {
          [dueDateFieldName]: true
        }
      } as Field),
    [t, isEdit]
  );

  const dueDateMembershipField = useMemo(
    () => (dueDateFieldName: string) =>
      ({
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: userFullDetails?.family?.users || [],
          friends: userFullDetails?.friends || []
        },
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('entities.entity.taskMembers'),
        hidden: isEdit,
        initialValue: [],
        shownFields: {
          [dueDateFieldName]: true
        }
      } as Field),
    [t, isEdit, userFullDetails]
  );

  return useMemo<FlatFormFieldTypes[]>(() => {
    const fields: FlatFormFieldTypes[] = [
      {
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
      },
      {
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
          listMode: 'MODAL',
          initialValue: 'CAR'
        }
      }
    ];

    const createFields: FlatFormFieldTypes[] = [
      {
        mot_due_date: {
          type: 'Date',
          required: false,
          displayName: t('entities.car.mot_due_date'),
          hidden: isEdit
        },
        mot_reminder_interval: reminderDropDownField('mot_due_date'),
        mot_due_date_members: dueDateMembershipField('mot_due_date')
      },
      {
        tax_due_date: {
          type: 'Date',
          required: false,
          displayName: t('entities.car.tax_due_date'),
          hidden: isEdit
        },
        tax_reminder_interval: reminderDropDownField('tax_due_date'),
        tax_due_date_members: dueDateMembershipField('tax_due_date')
      },
      {
        service_due_date: {
          type: 'Date',
          required: false,
          displayName: t('entities.car.service_due_date'),
          hidden: isEdit
        },
        service_reminder_interval: reminderDropDownField('service_due_date'),
        service_due_date_members: dueDateMembershipField('service_due_date')
      },
      {
        insurance_due_date: {
          type: 'Date',
          required: false,
          displayName: t('entities.car.insurance_due_date'),
          hidden: isEdit
        },
        insurance_reminder_interval:
          reminderDropDownField('insurance_due_date'),
        insurance_due_date_members: dueDateMembershipField('insurance_due_date')
      },
      {
        warranty_due_date: {
          type: 'Date',
          required: false,
          displayName: t('entities.car.warranty_due_date'),
          hidden: isEdit
        },
        warranty_reminder_interval: reminderDropDownField('warranty_due_date'),
        warranty_due_date_members: dueDateMembershipField('warranty_due_date')
      }
    ];

    if (!isEdit) {
      return [...fields, ...createFields];
    }

    return fields;
  }, [
    t,
    dueDateMembershipField,
    reminderDropDownField,
    isEdit,
    userFullDetails
  ]);
};
