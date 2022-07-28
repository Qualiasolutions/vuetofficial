import { useThemeColor } from 'components/Themed';
import { ColorName } from 'constants/Colors';
import { StyleSheet } from 'react-native';
import { ScrollView as DefaultScrollView } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultScrollView['props'];

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
        style={[{ backgroundColor, borderColor }, styles.container, style]}
        {...otherProps}
      />
    );
  };
}

export const WhiteFullPageScrollView = ScrollViewWithColor('white', 'grey');
export const TransparentFullPageScrollView = ScrollViewWithColor(
  'transparent',
  'grey'
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});
