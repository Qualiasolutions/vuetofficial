import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import {
  Text as DefaultText
} from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props']

export function PageTitle(props: TextProps & { text: string}) {
  const { style, text, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'headerText');

  return <DefaultText style={[{ color }, styles.header, style]} {...otherProps}>{text}</DefaultText>;
}

export function PageSubtitle(props: TextProps & { text: string}) {
  const { style, text, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'subheaderText');

  return <DefaultText style={[{ color }, styles.subheader, style]} {...otherProps}>{text}</DefaultText>;
}

export function PrimaryText(props: TextProps & { text: string}) {
  const { style, text, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');

  return <DefaultText style={[{ color }, style]} {...otherProps}>{text}</DefaultText>;
}

export function AlmostBlackText(props: TextProps & { text: string}) {
  const { style, text, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'almostBlack');

  return <DefaultText style={[{ color }, style]} {...otherProps}>{text}</DefaultText>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  subheader: {
    fontSize: 14,
    marginBottom: 20,
  },
})