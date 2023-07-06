import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

const styles = StyleSheet.create({
  container: {
    height: 30,
    padding: 0,
    paddingLeft: 20,
    marginBottom: 30
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
  const navigationState = props.navigation.getState();
  const insets = useSafeAreaInsets();

  if (navigationState.index === 0) {
    return null;
  }

  return (
    <TransparentView
      style={[
        styles.container,
        {
          paddingTop: insets.top + 5
        }
      ]}
    >
      <HeaderBackButton
        tintColor={props.options.headerTintColor}
        onPress={props.navigation.goBack}
      />
    </TransparentView>
  );
}
