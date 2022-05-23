import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './entityFormFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { setAllEntities } from 'reduxStore/slices/entities/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllEntities } from 'reduxStore/slices/entities/selectors';
import { CarResponseType } from 'types/entities';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const dispatch = useDispatch();
  const allEntities = useSelector(selectAllEntities);
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  const updateEntities = (res: CarResponseType) => {
    dispatch(setAllEntities([...Object.values(allEntities.byId), res]));
    setCreateSuccessful(true);
  };

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

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
            fields={carForm}
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
