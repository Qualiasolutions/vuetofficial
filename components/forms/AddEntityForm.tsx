import React from 'react';
import { Text } from 'components/Themed';
import { formStyles } from './formStyles';
import RTKForm from 'components/forms/RTKForm';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import GenericError from 'components/molecules/GenericError';
import {
  useCreateEntityMutation,
  useGetAllEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import * as forms from './entityFormFieldTypes';
import { EntityResponseType, EntityTypeName } from 'types/entities';
import { SafeAreaView } from 'react-native-safe-area-context';

type FieldsMapping = {
  [key in EntityTypeName]?: (parent: EntityResponseType) => any;
};

const extraFieldsMapping = {
  TripTransport: (parent: EntityResponseType) => ({
    name: `${parent.name} transport`
  }),
  TripAccommodation: (parent: EntityResponseType) => ({
    name: `${parent.name} accommodation`
  })
} as FieldsMapping;

export default function AddEntityForm({
  entityType,
  parentId
}: {
  entityType: EntityTypeName;
  parentId?: number;
}) {
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);
  const entityForms = {
    Car: forms.car(),
    Birthday: forms.birthday(),
    Event: forms.event(),
    Hobby: forms.hobby(),
    List: forms.list(),
    Trip: forms.trip(),
    TripTransport: forms.tripTransport(),
    TripAccommodation: forms.tripAccommodation(),
    TripActivity: forms.tripActivity(),
    Pet: forms.pet()
  };

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  const { t } = useTranslation();

  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const parentEntity = parentId ? allEntities.byId[parentId] : null;

  if (entityType && Object.keys(entityForms).includes(entityType)) {
    const extraFieldsFunction = extraFieldsMapping[entityType];
    const computedExtraFields =
      parentEntity && extraFieldsFunction
        ? extraFieldsFunction(parentEntity)
        : {};
    const extraFields = {
      ...computedExtraFields,
      resourcetype: entityType
    } as any;

    if (parentId) {
      extraFields.parent = parentId;
    }

    return (
      <SafeAreaView style={[formStyles.container]}>
        {createSuccessful ? (
          <Text>{t('screens.addEntity.createSuccess', { entityType })}</Text>
        ) : null}

        <RTKForm
          fields={entityForms[entityType]}
          methodHooks={{
            POST: useCreateEntityMutation
          }}
          formType="CREATE"
          extraFields={extraFields}
          onSubmitSuccess={() => {
            setCreateSuccessful(true);
          }}
          onValueChange={() => setCreateSuccessful(false)}
          clearOnSubmit={true}
          inlineFields={true}
        />
      </SafeAreaView>
    );
  }
  return null;
}
