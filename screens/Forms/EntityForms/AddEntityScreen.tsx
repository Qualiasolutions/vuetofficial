import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './entityFormFieldTypes';
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
import { useGetUserDetailsQuery } from 'reduxStore/services/api/api';
import { useTranslation } from 'react-i18next';

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);
  const carFields = carForm();

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  const { t } = useTranslation();

  const { data: userDetails } = useGetUserDetailsQuery();

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

  const permittedEntityForms = ['Car'];
  if (
    route.params?.entityType &&
    permittedEntityForms.includes(route.params?.entityType)
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
            fields={carFields}
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
          />
        </View>
      </SafeAreaView>
    );
  }
  return null;
}
