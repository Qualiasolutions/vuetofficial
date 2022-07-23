import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { ScrollView as DefaultScrollView } from 'react-native';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultScrollView['props'];

export function WhiteFullPageScrollView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'white');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultScrollView
      style={[{ backgroundColor, borderColor }, styles.container, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});
