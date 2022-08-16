import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList, RootTabParamList } from 'types/base';

import { Text, useThemeColor } from 'components/Themed';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useEffect, useState } from 'react';
import DeleteSuccess from '../components/DeleteSuccess';
import { useFocusEffect } from '@react-navigation/native';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import {
  useDeleteEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import * as forms from 'components/forms/entityFormFieldTypes';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';

export default function EditEntityScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'EditEntity'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const headerTintColor = useThemeColor({}, 'primary');
  const headerBackgroundColor = useThemeColor({}, 'almostWhite');

  useEffect(() => {
    if (allEntities) {
      const entityIdRaw = route.params.entityId;
      const entityId =
        typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
      const entityToEdit = allEntities.byId[entityId];
      if (entityToEdit) {
        navigation.setOptions({
          headerTitle: entityToEdit.name,
          headerTintColor,
          headerStyle: {
            backgroundColor: headerBackgroundColor
          }
        });
      }
    }
  }, [route.params.entityId, allEntities]);

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
    Pet: forms.pet(),
    DaysOff: forms.daysoff()
  };

  const [updatedSuccessfully, setUpdatedSuccessfully] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setUpdatedSuccessfully(false);
    }, [])
  );

  if (isLoading || !allEntities || !route.params.entityId) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entityToEdit = allEntities.byId[entityId];

  const formFields = deepCopy<FormFieldTypes>(
    entityForms[entityToEdit?.resourcetype]
  );

  const onDeleteSuccess = (res: CarResponseType) => {
    navigation.goBack();
  };

  if (route.params?.entityId && allEntities.byId[entityId]) {
    for (const fieldName in formFields) {
      if (fieldName in entityToEdit) {
        formFields[fieldName].initialValue = entityToEdit[fieldName] || null;
      }
    }

    return (
      <SafeAreaView>
        <TransparentFullPageScrollView>
          <TransparentPaddedView>
            {updatedSuccessfully ? (
              <Text>
                {t('screens.editEntity.updateSuccess', {
                  entityName: entityToEdit.name
                })}
              </Text>
            ) : null}
            <RTKForm
              fields={formFields}
              methodHooks={{
                PATCH: useUpdateEntityMutation,
                DELETE: useDeleteEntityMutation
              }}
              formType="UPDATE"
              extraFields={{
                resourcetype: entityToEdit.resourcetype,
                id: entityToEdit.id
              }}
              onSubmitSuccess={() => {
                setUpdatedSuccessfully(true);
              }}
              onDeleteSuccess={onDeleteSuccess}
              clearOnSubmit={false}
            />
          </TransparentPaddedView>
        </TransparentFullPageScrollView>
      </SafeAreaView>
    );
  }
  return null;
}
