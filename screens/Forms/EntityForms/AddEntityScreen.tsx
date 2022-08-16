import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList, RootTabParamList } from 'types/base';
import AddEntityForm from 'components/forms/AddEntityForm';
import { TransparentPaddedView, WhiteContainerView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { PageTitle } from 'components/molecules/TextComponents';
import { TransparentFullPageScrollView, WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'components/molecules/Header';
import { useThemeColor } from 'components/Themed';

const backgroundComponents = {
  default: TransparentFullPageScrollView
} as {
  [key: string]: React.ElementType | undefined
}

const titleMapping = {
  DaysOff: 'Add Days Off'
} as { [key: string]: string | undefined }

export default function AddEntityScreen({
  route,
  navigation
}: NativeStackScreenProps<EntityTabParamList, 'AddEntity'>) {
  const { t } = useTranslation();
  const parentId = route.params.parentId;
  const parsedId = parentId
    ? typeof parentId === 'number'
      ? parentId
      : parseInt(parentId)
    : undefined;

  const headerTintColor = useThemeColor({}, 'primary');
  const headerBackgroundColor = useThemeColor({}, 'almostWhite');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: titleMapping[route.params.entityType] || `Add ${route.params.entityType}`,
      headerTintColor,
      headerStyle: {
        backgroundColor: headerBackgroundColor
      }
    });
  }, []);

  const BackgroundComponent = (backgroundComponents[route.params.entityType] || backgroundComponents.default) as React.ElementType

  return (
    <SafeAreaView>
      <BackgroundComponent>
        <TransparentPaddedView>
          <AddEntityForm entityType={route.params.entityType} parentId={parsedId} />
        </TransparentPaddedView>
      </BackgroundComponent>
    </SafeAreaView>
  );
}
