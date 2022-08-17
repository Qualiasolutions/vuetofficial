import React, { useLayoutEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import AddEntityForm from 'components/forms/AddEntityForm';
import {
  TransparentPaddedView, TransparentView,
} from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from 'components/Themed';
import { backgroundComponents } from './utils/backgroundComponents';
import { StyleSheet } from 'react-native';
import { PageTitle } from 'components/molecules/TextComponents';

const titleMapping = {
  DaysOff: 'Add Days Off'
} as { [key: string]: string | undefined };

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor,
      headerStyle: {
        backgroundColor: headerBackgroundColor,
      },
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerTitle: (props) => {
        return (
          <TransparentView style={{
            height: 80,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
            <PageTitle
              text={titleMapping[route.params.entityType] || t('screens.addEntity.title', { entityType: route.params.entityType })}
              style={{marginBottom: 0}}
            />
          </TransparentView>
        )
      }
    });
  }, []);

  const BackgroundComponent = (backgroundComponents[route.params.entityType] ||
    backgroundComponents.default) as React.ElementType;

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundComponent>
        <TransparentPaddedView>
          <AddEntityForm
            entityType={route.params.entityType}
            parentId={parsedId}
          />
        </TransparentPaddedView>
      </BackgroundComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%' }
})