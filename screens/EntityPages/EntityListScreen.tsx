import React, { useLayoutEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { headerRightMapping } from './utils/headerRightMapping';
import { headerBackgroundMapping } from './utils/headerBackgroundMapping';
import { headerTintColorMapping } from './utils/headerTintColorMapping';
import { headerMapping } from './utils/headerMappings';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import EntityListPage from './EntityListPage';

type EntityListScreenProps = EntityTabScreenProps<'EntityList'>;

export default function EntityListScreen({
  navigation,
  route
}: EntityListScreenProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    const HeaderRightComponent =
      headerRightMapping[route.params.entityTypeName];
    const headerRight = () =>
      HeaderRightComponent ? (
        <HeaderRightComponent navigation={navigation} route={route} />
      ) : null;

    const HeaderBackgroundComponent =
      headerBackgroundMapping[route.params.entityTypeName];
    const headerBackground = () =>
      HeaderBackgroundComponent ? <HeaderBackgroundComponent /> : null;

    const headerTintColor =
      headerTintColorMapping[route.params.entityTypeName] || null;

    const HeaderComponent = headerMapping[route.params.entityTypeName] || null;
    const header = HeaderComponent
      ? (props: NativeStackHeaderProps) => <HeaderComponent {...props} />
      : null;

    const options: Partial<NativeStackNavigationOptions> = {
      title: t(`entityTypes.${route.params.entityTypeName}`),
      headerRight,
      headerBackground,
      headerTintColor
    };

    if (header) {
      options.header = header;
    }

    navigation.setOptions(options);
  }, [route.params.entityTypeName]);

  return (
    <EntityListPage
      entityTypes={route.params.entityTypes}
      entityTypeName={route.params.entityTypeName}
    />
  );
}
