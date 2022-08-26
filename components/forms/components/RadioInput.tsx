import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

export type RadioObjectValueType = {
  id: number | string;
};
export type RadioPermittedValues = {
  value: RadioObjectValueType;
  label: string;
}[];

export default function RadioInput({
  value,
  permittedValues,
  onValueChange
}: {
  value: any;
  permittedValues: RadioPermittedValues;
  onValueChange: (value: RadioObjectValueType) => void;
}) {
  const radioButtons = permittedValues.map((obj: any, i: number) => {
    return (
      <RadioButton labelHorizontal={true} key={i}>
        <RadioButtonInput
          obj={obj}
          index={i}
          isSelected={value === obj.value.id}
          onPress={() => {
            onValueChange(obj.value);
          }}
          buttonInnerColor={'#AAAAAA'}
          buttonOuterColor={'#CCCCCC'}
          buttonSize={12}
          buttonOuterSize={24}
          buttonStyle={{}}
          buttonWrapStyle={{ marginLeft: 10 }}
        />
        <RadioButtonLabel
          obj={obj}
          index={i}
          labelHorizontal={true}
          onPress={() => {
            onValueChange(obj.value);
          }}
        />
      </RadioButton>
    );
  });
  return <RadioForm>{radioButtons}</RadioForm>;
}
