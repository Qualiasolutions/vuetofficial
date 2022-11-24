import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';

import { useState } from 'react';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';

import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import EditEntityForm from 'components/forms/EditEntityForm';
import { StyleSheet } from 'react-native';
import useEntityHeader from 'headers/hooks/useEntityHeader';

export default function EditEntityScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'EditEntity'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const [entityType, setEntityType] = useState<string>('');

  useEntityHeader(route.params.entityId as number, false);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);

  if (route.params?.entityId) {
    return (
      <TransparentFullPageScrollView>
        <TransparentFullPageScrollView>
          <TransparentView style={styles.formContainer}>
            <EditEntityForm entityId={entityId} />
          </TransparentView>
        </TransparentFullPageScrollView>
      </TransparentFullPageScrollView>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});
