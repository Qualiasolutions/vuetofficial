import { useLayoutEffect } from 'react';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { headerRightMapping } from './headerRightMapping';
import { headerBackgroundMapping } from './headerBackgroundMapping';
import { headerTintColorMapping } from './headerTintColorMapping';
import { headerMapping } from './headerMappings';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function useEntityHeader(entityId: number) {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: userDetails } = useGetUserDetails();

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1);

  const entity = allEntities?.byId[entityId];

  useLayoutEffect(() => {
    if (entity) {
      const HeaderRightComponent = Object.keys(headerRightMapping).includes(
        entity.resourcetype
      )
        ? headerRightMapping[entity.resourcetype]
        : headerRightMapping.default;

      const headerRight = () =>
        HeaderRightComponent ? (
          <HeaderRightComponent navigation={navigation} route={route} />
        ) : null;

      const HeaderBackgroundComponent = Object.keys(
        headerBackgroundMapping
      ).includes(entity.resourcetype)
        ? headerBackgroundMapping[entity.resourcetype]
        : headerBackgroundMapping.default;

      const headerBackground = () =>
        HeaderBackgroundComponent ? <HeaderBackgroundComponent /> : null;

      const headerTintColor = Object.keys(headerTintColorMapping).includes(
        entity.resourcetype
      )
        ? headerTintColorMapping[entity.resourcetype]
        : headerTintColorMapping.default;

      const HeaderComponent = Object.keys(headerMapping).includes(
        entity.resourcetype
      )
        ? headerMapping[entity.resourcetype]
        : headerMapping.default;

      const header = HeaderComponent
        ? (props: NativeStackHeaderProps) => <HeaderComponent {...props} />
        : null;

      const options: Partial<NativeStackNavigationOptions> = {
        title: entity.name,
        headerRight,
        headerBackground,
        headerTintColor,
        headerShown: true
      };

      if (header) {
        options.header = header;
      }

      navigation.setOptions(options);
    }
  }, [entity]);
}
