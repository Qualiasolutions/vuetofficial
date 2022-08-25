import { TextInput, useThemeColor, View } from 'components/Themed';
import { useState } from 'react';
import { ViewStyle } from 'react-native';
import DropDownPicker, { ListModeType } from 'react-native-dropdown-picker';

const otherKey = '%%%%%%OTHER%%%%%%';

export default function DropDown({
  value = '',
  items = [],
  setFormValues = (item: string) => {},
  dropdownPlaceholder = 'Select',
  listMode = 'SCROLLVIEW',
  style = {},
  containerStyle = {},
  allowOther = false
}: {
  value: string;
  items: any[];
  setFormValues: (item: any) => void;
  dropdownPlaceholder?: string;
  listMode?: ListModeType;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  allowOther?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [showOther, setShowOther] = useState<boolean>(false);
  const borderColor = useThemeColor({}, 'grey');

  return (
    <View style={containerStyle}>
      <DropDownPicker
        listMode={listMode}
        open={open}
        value={value}
        items={
          allowOther ? [...items, { label: 'Other', value: otherKey }] : items
        }
        setOpen={setOpen}
        setValue={(item) => {
          if (item(null) == otherKey) {
            setFormValues('');
            return setShowOther(true);
          }
          setShowOther(false);
          setFormValues(item(null));
        }}
        placeholder={dropdownPlaceholder}
        style={[
          {
            borderWidth: 1,
            borderColor
          },
          style
        ]}
        textStyle={{
          fontFamily: 'Poppins',
          fontSize: 15
        }}
      />
      {showOther && (
        <TextInput
          value={value}
          placeholder="Type here"
          onChangeText={(newValue) => {
            setFormValues(newValue);
          }}
          style={{
            height: 50,
            flex: 1
          }}
        />
      )}
    </View>
  );
}
