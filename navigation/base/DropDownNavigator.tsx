import {
  createNavigatorFactory,
  TabActions,
  TabRouter,
  useNavigationBuilder
} from '@react-navigation/native';
import { NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import DropDown from 'components/forms/components/DropDown';
import {
  TransparentView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import { t } from 'i18next';
import { StyleSheet } from 'react-native';
import { elevation } from 'styles/elevation';

const styles = StyleSheet.create({
  header: { zIndex: 10 },
  screenContainer: { flex: 1 }
});
export function DropDownNavigator({
  initialRouteName,
  children,
  screenOptions
}: NativeStackNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(TabRouter, {
      children,
      screenOptions,
      initialRouteName
    });

  const currentRouteKey = state.routes[state.index].key;

  return (
    <NavigationContent>
      <WhitePaddedView style={[styles.header, elevation.elevated]}>
        <DropDown
          listMode="MODAL"
          dropdownPlaceholder={t('navigation.dropdown.quickNav')}
          value={currentRouteKey}
          items={state.routes.map((route) => ({
            label: descriptors[route.key].options.title || '',
            value: route.key
          }))}
          setFormValues={(routeKey) => {
            const route = descriptors[routeKey].route;
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            }) as { defaultPrevented: boolean };
            if (!event.defaultPrevented) {
              navigation.dispatch({
                ...TabActions.jumpTo(route.name),
                target: state.key
              });
            }
          }}
        />
      </WhitePaddedView>
      <TransparentView style={[styles.screenContainer]}>
        {state.routes.map((route, i) => {
          const displayStyle = {
            display: i === state.index ? 'flex' : ('none' as 'flex' | 'none')
          };
          return (
            <TransparentView
              key={route.key}
              style={[StyleSheet.absoluteFill, displayStyle]}
            >
              {descriptors[route.key].render()}
            </TransparentView>
          );
        })}
      </TransparentView>
    </NavigationContent>
  );
}

export const createDropDownNavigator =
  createNavigatorFactory(DropDownNavigator);
