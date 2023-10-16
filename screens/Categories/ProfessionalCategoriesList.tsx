import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SmallButton } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';
import {
  TransparentPaddedView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { Text, TextInput, useThemeColor } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  useCreateProfessionalCategoryMutation,
  useGetAllProfessionalCategoriesQuery
} from 'reduxStore/services/api/categories';
import { ContentTabParamList } from 'types/base';
import { ProfessionalCategory } from 'types/categories';

const styles = StyleSheet.create({
  innerWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  newCategoryNameInput: {
    marginVertical: 10
  },
  categoryLink: {
    marginBottom: 10
  }
});

const CreateCategoryButton = () => {
  const { t } = useTranslation();
  const primaryColor = useThemeColor({}, 'primary');
  const [createCategory, createCategoryResult] =
    useCreateProfessionalCategoryMutation();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const { data: userDetails } = useGetUserFullDetails();

  if (!userDetails) {
    return null;
  }

  return (
    <>
      <WhiteBox>
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Feather name="plus" size={36} color={primaryColor} />
        </TouchableOpacity>
      </WhiteBox>
      <Modal visible={showModal}>
        <Text>{t('components.professionalCategories.addCategoryBlurb')}</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder={t('common.name')}
          style={styles.newCategoryNameInput}
        />
        {createCategoryResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <SmallButton
            title={t('common.save')}
            onPress={async () => {
              try {
                await createCategory({
                  name: newName,
                  user: userDetails.id
                });
                setNewName('');
                setShowModal(false);
              } catch {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          />
        )}
      </Modal>
    </>
  );
};

const CategoryLink = ({
  category
}: {
  category: ProfessionalCategory | null;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ContentTabParamList>>();
  return (
    <WhiteBox style={styles.categoryLink}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProfessionalCategory', {
            categoryId: category?.id || null
          });
        }}
      >
        <PrimaryText text={category?.name || t('common.uncategorised')} bold />
      </TouchableOpacity>
    </WhiteBox>
  );
};

export default function ProfessionalCategoriesList() {
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllProfessionalCategoriesQuery();

  if (isLoadingCategories || !categories) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView style={styles.innerWrapper}>
        {categories.ids.map((categoryId) => {
          const category = categories?.byId[categoryId];
          return <CategoryLink key={category.id} category={category} />;
        })}
        <CategoryLink category={null} />
        <CreateCategoryButton />
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
