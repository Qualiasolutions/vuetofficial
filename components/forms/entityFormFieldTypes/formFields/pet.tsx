import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { UserFullResponse } from 'types/users';

export const petForm = (
  isEdit: boolean,
  userFullDetails: UserFullResponse,
  t: TFunction
): FormFieldTypes => {
  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.name')
    },
    type: {
      type: 'dropDownWithOther',
      required: true,
      displayName: t('entities.pet.type'),
      permittedValues: [
        { label: 'Dog', value: 'Dog' },
        { label: 'Cat', value: 'Cat' },
        { label: 'Bird', value: 'Bird' }
      ],
      listMode: 'MODAL'
    },
    breed: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.breed')
    },
    dob: {
      type: 'Date',
      required: true,
      displayName: t('entities.pet.dob')
    },
    image: {
      type: 'Image',
      required: false,
      displayName: t('entities.entity.image'),
      sourceField: 'presigned_image_url'
    }
    // TODO - add foreign key picker so that we can pick
    // a vet, walker, grommer, sitter, insurance policy
  };
};
