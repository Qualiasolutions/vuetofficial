import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  safeAreaContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  flexShrink: { flexShrink: 1 }
});
export default function BackOnlyHeader(
  props: NativeStackHeaderProps | BottomTabHeaderProps
) {
  const navigationState = props.navigation.getState();

  if (navigationState.index === 0) {
    return null;
  }

  return (
    <TransparentView style={[styles.container]}>
      <TransparentView style={styles.flexShrink}>
        <HeaderBackButton
          tintColor={props.options.headerTintColor}
          onPress={props.navigation.goBack}
        />
      </TransparentView>
    </TransparentView>
  );
}

export function BackOnlyHeaderWithSafeArea(
  props: NativeStackHeaderProps | BottomTabHeaderProps
) {
  // This causes the error
  // "Warning: React has detected a change in the order of Hooks called by BottomTabView"
  const statusBarHeight = getStatusBarHeight();
  const navigationState = props.navigation.getState();

  if (navigationState.index === 0) {
    return null;
  }

  return (
    <WhiteView
      style={[
        styles.container,
        styles.safeAreaContainer,
        { marginTop: statusBarHeight }
      ]}
    >
      <TransparentView style={styles.flexShrink}>
        <HeaderBackButton
          tintColor={props.options.headerTintColor}
          onPress={props.navigation.goBack}
        />
      </TransparentView>
    </WhiteView>
  );
}
