import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';

import { useThemeColor } from 'components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';

import {
  useGetAllEntitiesQuery,
} from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import EditEntityForm from 'components/forms/EditEntityForm';

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

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);

  if (route.params?.entityId) {
    return (
      <SafeAreaView>
        <TransparentFullPageScrollView>
          <TransparentPaddedView>
            <EditEntityForm entityId={entityId}/>
          </TransparentPaddedView>
        </TransparentFullPageScrollView>
      </SafeAreaView>
    );
  }
  return null;
}
