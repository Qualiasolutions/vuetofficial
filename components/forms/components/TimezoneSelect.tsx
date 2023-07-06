import DropDown from './DropDown';
import momentTZ from 'moment-timezone';
import { ViewStyle } from 'react-native';

const timeZonesList = momentTZ.tz.names();

type Props = {
  value: string;
  onSelectTimezone: (tz: string) => void;
  listMode: string;
  style: ViewStyle;
  containerStyle: ViewStyle;
  disabled?: boolean;
};

export default function TimezoneSelect({
  value,
  onSelectTimezone,
  listMode,
  style,
  containerStyle,
  disabled
}: Props) {
  return (
    <DropDown
      value={value}
      items={timeZonesList.map((tzName) => ({ label: tzName, value: tzName }))}
      setFormValues={onSelectTimezone}
      dropdownPlaceholder="Select"
      listMode="MODAL"
      style={style}
      textInputStyle={{}}
      containerStyle={containerStyle}
      allowOther={false}
      disabled={disabled}
    />
  );
}
