import { useThemeColor } from 'components/Themed';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

type PhoneNumberInputProps = PhoneInput['props'];

export default function PhoneNumberInput(props: PhoneNumberInputProps) {
  const {
    containerStyle,
    textInputStyle,
    textContainerStyle,
    codeTextStyle,
    ...otherProps
  } = props;
  const phoneInput = useRef<PhoneInput>(null);
  const borderColor = useThemeColor({}, 'grey');

  return (
    <PhoneInput
      ref={phoneInput}
      defaultCode="GB"
      layout="second"
      autoFocus
      {...otherProps}
      containerStyle={[
        styles.textInputContainer,
        { borderColor },
        containerStyle
      ]}
      textInputStyle={[textInputStyle]}
      textContainerStyle={[textContainerStyle]}
      codeTextStyle={[codeTextStyle]}
    />
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1
  }
});
