import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';

import { useThemeColor } from 'components/Themed';
import { useLayoutEffect, useState } from 'react';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { backgroundComponents } from './utils/backgroundComponents';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import EditEntityForm from 'components/forms/EditEntityForm';
import { StyleSheet } from 'react-native';

export default function EditEntityScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'EditEntity'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const headerTintColor = useThemeColor({}, 'primary');
  const headerBackgroundColor = useThemeColor({}, 'almostWhite');
  const [entityType, setEntityType] = useState<string>('');

  useLayoutEffect(() => {
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
        setEntityType(entityToEdit.resourcetype);
      }
    }
  }, [route.params.entityId, allEntities]);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);

  const BackgroundComponent = (backgroundComponents[entityType] ||
    backgroundComponents.default) as React.ElementType;

  if (route.params?.entityId) {
    return (
      <BackgroundComponent>
        <TransparentFullPageScrollView>
          <TransparentPaddedView style={styles.formContainer}>
            <EditEntityForm entityId={entityId} />
          </TransparentPaddedView>
        </TransparentFullPageScrollView>
      </BackgroundComponent>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});
