import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TransparentView } from 'components/molecules/ViewComponents';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingLeft: 20,
    paddingTop: 30,
    marginBottom: 20
  }
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
      <HeaderBackButton
        tintColor={props.options.headerTintColor}
        onPress={props.navigation.goBack}
      />
    </TransparentView>
  );
}

export function BackOnlyHeaderWithSafeArea(
  props: NativeStackHeaderProps | BottomTabHeaderProps
) {
  // This causes the error
  // "Warning: React has detected a change in the order of Hooks called by BottomTabView"
  // const insets = useSafeAreaInsets();
  const navigationState = props.navigation.getState();

  if (navigationState.index === 0) {
    return null;
  }

  return (
    <TransparentView style={styles.container}>
      <HeaderBackButton
        tintColor={props.options.headerTintColor}
        onPress={props.navigation.goBack}
      />
    </TransparentView>
  );
}
