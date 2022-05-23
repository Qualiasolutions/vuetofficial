import { Text } from 'components/Themed';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

export default function GenericButton({
  onPress,
  title,
  disabled = false,
  style = {},
  textStyle = {},
  disabledStyle = {},
  disabledTextStyle = {}
}: {
  onPress: Function;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabledStyle?: ViewStyle;
  disabledTextStyle?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      style={
        disabled
          ? [styles.genericButton, style, styles.disabledButton, disabledStyle]
          : [styles.genericButton, style]
      }
      onPress={() => {
        onPress();
      }}
      disabled={disabled}
    >
      <Text
        style={
          disabled
            ? [
                styles.genericButtonText,
                textStyle,
                styles.disabledText,
                disabledTextStyle
              ]
            : [styles.genericButtonText, textStyle]
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  genericButton: {
    backgroundColor: '#C4C4C4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignContent: 'center',
    justifyContent: 'center'
  },
  genericButtonText: {
    fontWeight: 'bold',
    color: 'black'
  },
  disabledButton: {
    backgroundColor: '#DDDDDD'
  },
  disabledText: {
    color: 'white'
  }
});
