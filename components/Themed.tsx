/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  Pressable,
  StyleSheet,
  GestureResponderEvent
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultText style={[{ color }, styles.text, style]} {...otherProps} />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'backgroundWhite'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'backgroundWhite'
  );
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultTextInput
      style={[
        {
          backgroundColor,
          color
        },
        styles.textInput,
        style
      ]}
      {...otherProps}
    />
  );
}

export function Button(
  props: ThemeProps & {
    onPress: (event: GestureResponderEvent) => void;
    title: string;
    style?: object;
  }
) {
  const { style, title, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'buttonDefault'
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'buttonTextDefault'
  );
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Pressable
      style={[
        {
          backgroundColor,
          color
        },
        styles.button,
        style
      ]}
      {...otherProps}
    >
      <Text style={[{ color: textColor }, styles.buttonText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins'
  },
  textInput: {
    borderRadius: 10,
    height: 40,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    width: '100%',
    borderColor: '#D8D8D8',
    fontFamily: 'Poppins'
  },
  button: {
    borderRadius: 10,
    padding: 15,
    textAlign: 'center',
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold'
  }
});
