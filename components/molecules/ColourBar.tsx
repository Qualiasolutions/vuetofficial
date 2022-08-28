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
      ></TransparentView>
    );
  });

  return <TransparentView style={styles.container}>{bars}</TransparentView>;
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    right: 0,
    height: 10,
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '100%',
    position: 'absolute'
  },
  colourBar: {
    width: 90,
    height: 10
  }
});
