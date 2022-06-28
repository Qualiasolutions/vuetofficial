import { useThemeColor } from 'components/Themed';
import { StyleSheet, TextStyle } from 'react-native';
import { View as DefaultView, Text } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView['props'];

export function ErrorBox(
  props: ViewProps & { errorText: string; textStyle?: TextStyle }
) {
  const { style, textStyle, errorText, lightColor, darkColor, ...otherProps } =
    props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'errorBackground'
  );

  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'errorText'
  );

  return (
    <DefaultView
      style={[{ backgroundColor }, styles.errorBox, style]}
      {...otherProps}
    >
      <Text style={[{ color: textColor }, textStyle]}>{errorText}</Text>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    padding: 10,
    margin: 10
  }
});
