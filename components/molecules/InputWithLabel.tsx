import { Text } from 'components/Themed';
import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { AlmostBlackText } from './TextComponents';
import { TransparentView } from './ViewComponents';

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    marginRight: 10,
    flexShrink: 1
  },
  inlineInputPair: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inlineChildrenWrapper: {
    flex: 1
  }
});

export default function InputWithLabel({
  label,
  children,
  error,
  inlineFields,
  labelStyle,
  labelWrapperStyle,
  style
}: {
  label: string;
  children: ReactNode;
  error?: string;
  inlineFields?: boolean;
  labelStyle?: ViewStyle;
  labelWrapperStyle?: ViewStyle;
  style?: ViewStyle;
}) {
  return (
    <TransparentView style={style || {}}>
      {error ? <Text>{error}</Text> : null}
      <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
        <TransparentView style={[labelWrapperStyle || {}]}>
          <AlmostBlackText
            text={label}
            style={[styles.inputLabel, labelStyle || {}]}
          />
        </TransparentView>
        <TransparentView
          style={inlineFields ? styles.inlineChildrenWrapper : {}}
        >
          {children}
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
}
