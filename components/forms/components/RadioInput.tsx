import Checkbox from 'components/molecules/Checkbox';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';

export type RadioObjectValueType = {
  id: number | string;
};
export type RadioPermittedValues = {
  value: RadioObjectValueType;
  label: string;
}[];

const styles = StyleSheet.create({
  label: { marginRight: 10 },
  wrapper: { flexDirection: 'row' }
});

export default function RadioInput({
  value,
  label,
  permittedValues,
  onValueChange
}: {
  value: any;
  label?: string;
  permittedValues: RadioPermittedValues;
  onValueChange: (value: RadioObjectValueType) => void;
}) {
  const radioButtons = permittedValues.map((obj: any, i: number) => {
    return (
      <Checkbox
        checked={value === obj.value.id}
        smoothChecking={false}
        onValueChange={async (val) => {
          onValueChange(obj.value);
        }}
        label={obj.label}
        key={i}
      />
    );
  });
  return (
    <TransparentView style={styles.wrapper}>
      {label && <AlmostBlackText text={label} style={styles.label} />}
      <TransparentView>{radioButtons}</TransparentView>
    </TransparentView>
  );
}
