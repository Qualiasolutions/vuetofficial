import { TransparentView } from 'components/molecules/ViewComponents';
import { TextInput } from 'components/Themed';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateTimeTextInput({
  value,
  textInputStyle,
  containerStyle,
  onValueChange,
  Date = false
}: {
  value: Date | null;
  textInputStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  onValueChange: Function;
  Date?: boolean;
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] =
    React.useState<boolean>(false);

  return (
    <TransparentView style={containerStyle}>
      <Pressable onPress={() => setIsDatePickerVisible(true)}>
        <TransparentView pointerEvents="none">
          <TextInput
            value={
              value
                ? Date
                  ? dayjs(value).format('DD/MM/YYYY')
                  : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                : 'DD/MM/YYYY'
            }
            style={textInputStyle || {}}
          />
        </TransparentView>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={Date ? 'date' : 'datetime'}
        onConfirm={(newValue) => {
          onValueChange(newValue);
          setIsDatePickerVisible(false);
        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
          onValueChange(null);
        }}
      ></DateTimePickerModal>
    </TransparentView>
  );
}
