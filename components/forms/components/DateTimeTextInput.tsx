import SafePressable from 'components/molecules/SafePressable';
import { TransparentView } from 'components/molecules/ViewComponents';
import { TextInput, useThemeColor } from 'components/Themed';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateTimeTextInput({
  value,
  textInputStyle,
  containerStyle,
  onValueChange,
  Date = false,
  disabled = false,
  maximumDate,
  minimumDate,
  placeholder
}: {
  value: Date | null;
  textInputStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  onValueChange: Function;
  Date?: boolean;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  placeholder?: string;
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] =
    React.useState<boolean>(false);

  const disabledTextColor = useThemeColor({}, 'disabledGrey');

  return (
    <TransparentView style={containerStyle}>
      <SafePressable
        onPress={() => {
          if (!disabled) setIsDatePickerVisible(true);
        }}
      >
        <TransparentView pointerEvents="none">
          <TextInput
            value={
              value
                ? Date
                  ? dayjs(value).format('DD/MM/YYYY')
                  : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                : ''
            }
            style={[
              textInputStyle || {},
              disabled ? { color: disabledTextColor } : {}
            ]}
            placeholder={placeholder || (Date ? 'DD/MM/YYYY' : '')}
          />
        </TransparentView>
      </SafePressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={Date ? 'date' : 'datetime'}
        date={value || undefined}
        onConfirm={(newValue) => {
          setIsDatePickerVisible(false);
          if (
            (minimumDate && newValue < minimumDate) ||
            (maximumDate && newValue > maximumDate)
          ) {
            return onValueChange(null);
          }
          onValueChange(newValue);
        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
          onValueChange(null);
        }}
        disabled={disabled}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </TransparentView>
  );
}
