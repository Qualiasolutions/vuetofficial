import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import {
  View as DefaultView,
} from 'react-native';  
  
type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView['props'];
  
export function WhiteContainerView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'white'
  );

  return <DefaultView style={[{ backgroundColor }, styles.container, style]} {...otherProps} />;
}

export function AlmostWhiteContainerView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'almostWhite'
  );

  return <DefaultView style={[{ backgroundColor }, styles.container, style]} {...otherProps} />;
}

export function AlmostWhiteView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'almostWhite'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TransparentView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'transparent'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
})