import { Text, View } from 'components/Themed';
import moment from 'moment';
import React from 'react';
import { Pressable, TextInput, ViewStyle } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateTimeTextInput({
  value,
  textInputStyle,
  onValueChange
}: {
  value: Date;
  textInputStyle: ViewStyle;
  onValueChange: Function;
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] =
    React.useState<boolean>(false);

  return (
    <>
      <Pressable onPress={() => setIsDatePickerVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            value={value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}
            style={textInputStyle}
          />
        </View>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={(newValue) => {
          onValueChange(newValue);
          setIsDatePickerVisible(false);
        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
          onValueChange(null);
        }}
      ></DateTimePickerModal>
    </>
  );
}
