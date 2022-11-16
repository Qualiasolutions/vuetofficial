import { TextInput as DefaultTextInput } from 'react-native';

export type TextInputProps = DefaultTextInput['props'];

export function TextInput(props: TextInputProps) {
  return <DefaultTextInput {...props} />;
}
