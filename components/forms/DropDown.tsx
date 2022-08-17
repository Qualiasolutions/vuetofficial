import { TextInput } from 'components/Themed';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export default function DropDown({
  value = '',
  items = [],
  setFormValues = (item: string) => {}
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [showOther, setShowOther] = useState<boolean>(false);
  return (
    <>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(item) => {
          if (item(null) == 'Other') return setShowOther(true);
          setFormValues(item(null));
        }}
        placeholder="Select Breed"
        style={{ borderWidth: 0, marginTop: 10 }}
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
