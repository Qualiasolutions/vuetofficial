import {
  PrimaryColouredView,
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { Button, useThemeColor, View } from 'components/Themed';
import { Image, Pressable, StyleSheet } from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity
} from 'react-native-gesture-handler';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { EntityTabParamList, RootTabParamList } from 'types/base';

const AddButton = ({ children, onPress }: { [key: string]: any }) => (
  <TransparentView style={styles.addButtonWrapper}>
    <TouchableHighlight style={styles.addButtonPressable} onPress={onPress}>
      <PrimaryColouredView style={styles.addButton}>
        <Image
          source={require('../../assets/images/plus_icon.png')}
          resizeMode="contain"
          style={{
            width: 30,
            height: 30,
            tintColor: '#fff'
          }}
        />
      </PrimaryColouredView>
    </TouchableHighlight>
  </TransparentView>
);

export default function BottomNavBar({
  state,
  descriptors,
  navigation
}: BottomTabBarProps) {
  const [currentScreen, setCurrentScreen] = useState<string>('');
  const [currentScreenParams, setCurrentScreenParams] = useState<object>({});

  const getCurrentScreenAndParams = () => {
    let nestedState: any = { ...state };
    while (true) {
      const route = nestedState.routes[nestedState.index];
      if (route?.state?.index) {
        nestedState = { ...route.state };
      } else {
        return route;
      }
    }
  };

  useEffect(() => {
    const { name, params } = getCurrentScreenAndParams();
    setCurrentScreen(name);
    setCurrentScreenParams(params);
  }, [state]);

  return (
    <WhiteView
      style={[{ borderTopColor: useThemeColor({}, 'lightGrey') }, styles.bar]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state?.index === index;

        if (route.name === 'CreateTask') {
          return (
            <AddButton
              key={index}
              onPress={() => {
                const ignoredScreens = ['AddTask', 'CreateTask'];
                if (ignoredScreens.includes(currentScreen)) {
                  return;
                } else if (currentScreen === 'EntityScreen') {
                  type RouteParams = EntityTabParamList['EntityScreen'];
                  navigation.navigate('AddTask', {
                    entityId: (currentScreenParams as RouteParams).entityId
                  });
                } else if (currentScreen === 'ChildEntitiesScreen') {
                  // TODO - this should instead bring up a list of
                  // all entity types on this page if entityTypes
                  // has length > 1
                  type RouteParams = EntityTabParamList['ChildEntitiesScreen'];
                  navigation.navigate('AddEntity', {
                    entityTypes: (currentScreenParams as RouteParams)
                      .entityTypes[0],
                    parentId: (currentScreenParams as RouteParams).entityId
                  });
                } else if (currentScreen === 'EntityList') {
                  // TODO - this should instead bring up a list of
                  // all entity types on this page if entityTypes
                  // has length > 1
                  type RouteParams = EntityTabParamList['ChildEntitiesScreen'];
                  navigation.navigate('AddEntity', {
                    entityTypes: (currentScreenParams as RouteParams)
                      .entityTypes
                  });
                } else if (currentScreen === 'FamilySettings') {
                  navigation.navigate('CreateUserInvite', {
                    familyRequest: true
                  });
                } else if (currentScreen === 'FriendSettings') {
                  navigation.navigate('CreateUserInvite', {
                    familyRequest: false
                  });
                } else {
                  navigation.navigate('CreateTask');
                }
              }}
            />
          );
        } else if (options.tabBarIcon) {
          const forcedScreen =
            route.name === 'EntityNavigator'
              ? 'Categories'
              : route.name === 'SettingsNavigator'
              ? 'Settings'
              : '';
          return (
            <Pressable
              key={index}
              onPress={() => {
                navigation.navigate(
                  route.name,
                  forcedScreen ? { screen: forcedScreen } : {}
                );
              }}
            >
              {options.tabBarIcon({ focused: isFocused, color: '', size: 0 })}
            </Pressable>
          );
        }
      })}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    borderTopWidth: 1
  },
  addButtonPressable: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonWrapper: {
    position: 'relative',
    height: 60,
    width: 60,
    top: -50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -5
  }
});
