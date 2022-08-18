import React, { useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import AddEntityForm from 'components/forms/AddEntityForm';
import {
  TransparentPaddedView, TransparentView,
} from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from 'components/Themed';
import { backgroundComponents } from './utils/backgroundComponents';
import { backgroundColours } from './utils/backgroundColours';
import { StyleSheet, View } from 'react-native';
import { PageTitle } from 'components/molecules/TextComponents';
import { EntityTypeName } from 'types/entities';
import DropDown from 'components/forms/components/DropDown';
import { fieldColorMapping } from 'components/forms/utils/fieldColorMapping';

const titleMapping = {
  DaysOff: 'Add Days Off'
} as { [key: string]: string | undefined };

export default function AddEntityScreen({
  route,
  navigation
}: NativeStackScreenProps<EntityTabParamList, 'AddEntity'>) {
  const { t } = useTranslation();
  const parentId = route.params.parentId;
  const entityTypes = route.params.entityTypes
  const parsedId = parentId
    ? typeof parentId === 'number'
      ? parentId
      : parseInt(parentId)
    : undefined;

  const headerTintColor = useThemeColor({}, 'primary');
  const [selectedEntityType, selectEntityType] = useState<EntityTypeName>(entityTypes[0])
  const headerBackgroundColor = useThemeColor({}, backgroundColours[selectedEntityType] || 'almostWhite');

  const fieldColor = (selectedEntityType && useThemeColor({}, fieldColorMapping[selectedEntityType]))

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
              text={titleMapping[selectedEntityType] || t('screens.addEntity.title', { entityType: selectedEntityType })}
              style={{marginBottom: 0}}
            />
          </TransparentView>
        )
      }
    });
  }, [selectedEntityType]);

  const BackgroundComponent = (backgroundComponents[selectedEntityType] ||
    backgroundComponents.default) as React.ElementType;

  const entityTypeSelector = (entityTypes && (entityTypes.length > 1))
    ? <View style={styles.entityTypeSelectorWrapper}>
      <DropDown
        value={selectedEntityType}
        items={entityTypes.map(entityType => ({
          label: entityType,
          value: entityType
        }))}
        setFormValues={(entityType: EntityTypeName) => { selectEntityType(entityType) }}
        style={{backgroundColor: fieldColor}}
      ></DropDown>
    </View>
    : null

  return (
    <BackgroundComponent>
      {entityTypeSelector}
      <TransparentPaddedView>
        <AddEntityForm
          entityType={selectedEntityType}
          parentId={parsedId}
        />
      </TransparentPaddedView>
    </BackgroundComponent>
  );
}

const styles = StyleSheet.create({
  entityTypeSelectorWrapper: {
    marginTop: 20,
    width: 200,
    alignSelf: 'center',
  },
  container: { height: '100%' }
})