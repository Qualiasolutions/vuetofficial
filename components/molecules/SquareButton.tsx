import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function SquareButton({
  onPress,
  fontAwesomeIconName,
  fontAwesomeIconSize = 30
}: {
  onPress: Function;
  fontAwesomeIconName?: keyof typeof FontAwesome.glyphMap;
  fontAwesomeIconSize?: number;
}) {
  let icon;
  if (fontAwesomeIconName) {
    icon = (
      <FontAwesome name={fontAwesomeIconName} size={fontAwesomeIconSize} />
    );
  }

  return (
    <TouchableOpacity
      style={styles.squareButton}
      onPress={() => {
        onPress();
      }}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = {
  squareButton: {
    backgroundColor: '#cccccc',
    padding: 5,
    borderRadius: 5
  }
};
