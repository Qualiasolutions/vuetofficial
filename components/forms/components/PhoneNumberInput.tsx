import { useThemeColor } from 'components/Themed';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

type PhoneNumberInputProps = PhoneInput['props'];

export default function PhoneNumberInput(props: PhoneNumberInputProps) {
  const { containerStyle, ...otherProps } = props;
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
    />
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1
  }
});
