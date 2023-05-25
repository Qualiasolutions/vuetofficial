import { StyleSheet, ViewStyle } from 'react-native';
import { TransparentView } from './ViewComponents';

export default function ColourBar({
  colourHexcodes,
  style = {}
}: {
  colourHexcodes: string[];
  style?: ViewStyle;
}) {
  const bars = colourHexcodes.map((colour: string, i: number) => {
    return (
      <TransparentView
        key={i}
        style={[styles.colourBar, { backgroundColor: `#${colour}` }, style]}
      />
    );
  });

  return <TransparentView style={styles.container}>{bars}</TransparentView>;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  colourBar: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginLeft: 2
  }
});
