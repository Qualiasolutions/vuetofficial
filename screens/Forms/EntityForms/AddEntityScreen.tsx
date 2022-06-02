import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './entityFormFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { CarResponseType } from 'types/entities';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api';

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

  const {
    data: allEntities,
    isLoading,
    error,
    refetch: refetchEntities
  } = useGetAllEntitiesQuery();

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const updateEntities = (res: CarResponseType) => {
    refetchEntities();
    setCreateSuccessful(true);
  };

  const permittedEntityForms = ['Car'];
  if (
    route.params?.entityType &&
    permittedEntityForms.includes(route.params?.entityType)
  ) {
    return (
      <SafeAreaView style={formStyles.container}>
        <View style={formStyles.container}>
          <Text style={formStyles.title}>New {route.params.entityType}</Text>
          {createSuccessful ? (
            <Text>Successfully created new {route.params.entityType}</Text>
          ) : null}
          <GenericForm
            fields={carFields}
            url={makeApiUrl(`/core/entity/`)}
            formType="CREATE"
            extraFields={{
              resourcetype: route.params.entityType
            }}
            onSubmitSuccess={updateEntities}
            onValueChange={() => setCreateSuccessful(false)}
            clearOnSubmit={true}
          ></GenericForm>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}
