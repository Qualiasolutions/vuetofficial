import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { View as DefaultView } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView['props'];

export function WhiteContainerView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'white');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, styles.container, style]}
      {...otherProps}
    />
  );
}

export function AlmostWhiteContainerView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'almostWhite');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, styles.container, style]}
      {...otherProps}
    />
  );
}

export function TransparentContainerView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'transparent');

  return (
    <DefaultView
      style={[{ backgroundColor }, styles.container, style]}
      {...otherProps}
    />
  );
}

export function WhiteView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'white');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function AlmostWhiteView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'almostWhite');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function PrimaryColouredView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'primary');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TransparentView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'transparent');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function TransparentPaddedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  return <TransparentView style={[styles.padded, style]} { ...otherProps } />
}

export function WhiteBox(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'white'
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'grey'
  );

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, styles.box, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  padded: {
    paddingHorizontal: 23,
    paddingVertical: 10
  },
  box: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1
  }
});
