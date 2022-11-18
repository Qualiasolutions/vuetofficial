import { useThemeColor } from 'components/Themed';
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { BlackText } from './TextComponents';

export function Button(props: {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  style?: object;
  disabled?: boolean;
}) {
  const { style, title, disabled, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'buttonDefault');
  const disabledBackgroundColor = useThemeColor({}, 'disabledGrey');
  const textColor = useThemeColor({}, 'buttonTextDefault');
  const color = useThemeColor({}, 'text');

  return (
    <Pressable
      style={[
        {
          backgroundColor: disabled ? disabledBackgroundColor : backgroundColor,
          color
        },
        styles.button,
        style
      ]}
      disabled={disabled}
      {...otherProps}
    >
      <BlackText style={[{ color: textColor }]} text={title} bold={true} />
    </Pressable>
  );
}

export function LinkButton(props: {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  style?: object;
  disabled?: boolean;
}) {
  const { style, title, disabled, ...otherProps } = props;
  const textColor = useThemeColor({}, 'secondary');

  return (
    <Pressable
      style={[styles.linkButton, style]}
      disabled={disabled}
      {...otherProps}
    >
      <BlackText style={[{ color: textColor }]} text={title} bold={true} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 15,
    textAlign: 'center',
    alignItems: 'center'
  },
  linkButton: {
    textAlign: 'center',
    alignItems: 'center'
  }
});
