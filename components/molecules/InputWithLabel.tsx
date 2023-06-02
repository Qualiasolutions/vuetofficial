import { Text } from 'components/Themed';
import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { AlmostBlackText } from './TextComponents';
import { TransparentView } from './ViewComponents';

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    textAlign: 'left',
    marginVertical: 14,
    marginRight: 10,
    flexShrink: 1,
    width: '100%'
  },
  inlineInputPair: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    alignItems: 'center'
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
});

export default function InputWithLabel({
  label,
  children,
  error,
  inlineFields,
  labelStyle,
  labelWrapperStyle
}: {
  label: string;
  children: ReactNode;
  error?: string;
  inlineFields?: boolean;
  labelStyle?: ViewStyle;
  labelWrapperStyle?: ViewStyle;
}) {
  return (
    <TransparentView>
      {error ? <Text>{error}</Text> : null}
      <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
        <TransparentView
          style={[styles.inputLabelWrapper, labelWrapperStyle || {}]}
        >
          <AlmostBlackText
            text={label}
            style={[styles.inputLabel, labelStyle || {}]}
          />
        </TransparentView>
        <TransparentView style={{ flex: 1 }}>{children}</TransparentView>
      </TransparentView>
    </TransparentView>
  );
}
