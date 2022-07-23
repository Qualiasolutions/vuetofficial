import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { formStyles } from '../formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import * as forms from './entityFormFieldTypes'

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);
  const entityForms = {
    Car: forms.car(),
    Birthday: forms.birthday(),
    Event: forms.event()
  }

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


  if (
    route.params?.entityType &&
    Object.keys(entityForms).includes(route.params?.entityType)
  ) {
    return (
      <SafeAreaView style={formStyles.container}>
        <View style={formStyles.container}>
          <Text style={formStyles.title}>
            {t('screens.addEntity.title', {
              entityType: route.params.entityType
            })}
          </Text>
          {createSuccessful ? (
            <Text>
              {t('screens.addEntity.createSuccess', {
                entityType: route.params.entityType
              })}
            </Text>
          ) : null}
          <RTKForm
            fields={entityForms[route.params?.entityType]}
            methodHooks={{
              POST: useCreateEntityMutation
            }}
            formType="CREATE"
            extraFields={{
              resourcetype: route.params.entityType
            }}
            onSubmitSuccess={() => {
              setCreateSuccessful(true);
            }}
            onValueChange={() => setCreateSuccessful(false)}
            clearOnSubmit={true}
            inlineFields={true}
          />
        </View>
      </SafeAreaView>
    );
  }
  return null;
}
