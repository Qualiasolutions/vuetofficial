import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const generateRandomColor = () => {
  const parts = [];
  for (let i = 0; i < 3; i++) {
    parts.push(Math.floor(256 * Math.random()));
  }
  return parts
    .map((intCode) => ('0' + intCode.toString(16)).slice(-2))
    .join('');
};
export function ColorPicker({
  value,
  onValueChange
}: {
  value: string;
  onValueChange: (value: string) => any;
}) {
  const [color, setColor] = useState<string>(generateRandomColor());

  useEffect(() => {
    if (!color) {
      setColor(generateRandomColor());
    }
    onValueChange(color);
  }, [color]);

  return (
    <Pressable onPress={() => setColor(generateRandomColor)}>
      <View
        style={[
          styles.colorView,
          {
            backgroundColor: `#${color}`
          }
        ]}
      ></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  colorView: {
    width: 100,
    height: 15
  }
});
