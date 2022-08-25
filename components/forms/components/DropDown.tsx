import { TextInput, useThemeColor } from 'components/Themed';
import { useState } from 'react';
import { ViewStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const otherKey = '%%%%%%OTHER%%%%%%';

export default function DropDown({
  value = '',
  items = [],
  setFormValues = (item: string) => {},
  dropdownPlaceholder = 'Select',
  style = {},
  allowOther = false
}: {
  value: string;
  items: any[];
  setFormValues: (item: any) => void;
  dropdownPlaceholder?: string;
  style?: ViewStyle;
  allowOther?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [showOther, setShowOther] = useState<boolean>(false);
  const borderColor = useThemeColor({}, 'grey');

  return (
    <>
      <DropDownPicker
        listMode="SCROLLVIEW"
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
    </>
  );
}
