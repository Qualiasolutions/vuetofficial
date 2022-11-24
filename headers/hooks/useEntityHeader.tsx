import { useLayoutEffect } from 'react';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { headerMapping } from 'headers/utils/headerMappings';
import { headerTintColorMapping } from 'headers/utils/headerTintColorMapping';
import { headerRightMapping } from 'headers/utils/headerRightMapping';

export default function useEntityHeader(
  entityId: number,
  includeHeaderRight: boolean = true,
  title: string = ''
) {
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
        ? headerRightMapping.entities[entity.resourcetype]
        : headerRightMapping.entities.default;

      const headerRight = () =>
        includeHeaderRight && HeaderRightComponent ? (
          <HeaderRightComponent navigation={navigation} route={route} />
        ) : null;

      const headerTintColor = Object.keys(headerTintColorMapping).includes(
        entity.resourcetype
      )
        ? headerTintColorMapping[entity.resourcetype]
        : headerTintColorMapping.default;

      const HeaderComponent =
        headerMapping.entities[entity.resourcetype] ||
        headerMapping.entities.default;

      const header = HeaderComponent
        ? (props: NativeStackHeaderProps) => <HeaderComponent {...props} />
        : null;

      const options: Partial<NativeStackNavigationOptions> = {
        title: title || entity.name,
        headerRight,
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
