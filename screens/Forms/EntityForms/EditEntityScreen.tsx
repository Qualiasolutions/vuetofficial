import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import EditEntityForm from 'components/forms/EditEntityForm';
import { StyleSheet } from 'react-native';
import useEntityHeader from 'headers/hooks/useEntityHeader';

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});

export default function EditEntityScreen({
  navigation,
  route
}: NativeStackScreenProps<ContentTabParamList, 'EditEntity'>) {
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
