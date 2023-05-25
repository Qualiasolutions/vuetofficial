import { useThemeColor } from 'components/Themed';
import { ColorName } from 'constants/Colors';
import { StyleSheet } from 'react-native';
import { ScrollView as DefaultScrollView } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultScrollView['props'];

function FullPageScrollViewWithColor(
  backgroundColorName: ColorName,
  borderColorName: ColorName
): (props: ViewProps) => JSX.Element {
  return function ColouredScrollView(props: ViewProps) {
    const { style, ...otherProps } = props;
    const backgroundColor = useThemeColor({}, backgroundColorName);
    const borderColor = useThemeColor({}, borderColorName);

    return (
      <DefaultScrollView
        style={[{ backgroundColor, borderColor }, styles.container, style]}
        {...otherProps}
      />
    );
  };
}

function ScrollViewWithColor(
  backgroundColorName: ColorName,
  borderColorName: ColorName
): (props: ViewProps) => JSX.Element {
  return function ColouredScrollView(props: ViewProps) {
    const { style, ...otherProps } = props;
    const backgroundColor = useThemeColor({}, backgroundColorName);
    const borderColor = useThemeColor({}, borderColorName);

    return (
      <DefaultScrollView
        style={[{ backgroundColor, borderColor }, style]}
        {...otherProps}
      />
    );
  };
}

export const TransparentScrollView = ScrollViewWithColor(
  'transparent',
  'transparent'
);

export const WhiteFullPageScrollView = FullPageScrollViewWithColor(
  'white',
  'grey'
);
export const TransparentFullPageScrollView = FullPageScrollViewWithColor(
  'transparent',
  'grey'
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});
