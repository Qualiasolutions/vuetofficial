import { useThemeColor } from 'components/Themed';
import { StyleSheet, View, Image, Text, ViewStyle } from 'react-native';

export function ImagePicker({
  onImageSelect,
  backgroundColor = '#ffffff',
  style = {}
}: {
  onImageSelect: (imageLocation: string) => any;
  backgroundColor: string;
  style?: ViewStyle
}) {
  return (
    <View style={[{ backgroundColor }, styles.container, style]}>
      <Image
        style={styles.placeholderImage}
        source={require('../../../assets/images/icons/camera.png')}
        resizeMode="contain"
      />
      <Text>TODO</Text>
    </View>
  );
}

export function WhiteImagePicker({
  onImageSelect,
  style
}: {
  onImageSelect: (imageLocation: string) => any;
  style?: ViewStyle
}) {
  const backgroundColor = useThemeColor({}, 'white');
  return ImagePicker({ onImageSelect, backgroundColor, style });
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    borderRadius: 60,
    shadowColor: '#333333',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderImage: {
    width: 40,
    height: 40
  }
});
