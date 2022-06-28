import { useThemeColor } from 'components/Themed';
import { StyleSheet, View, Image, Text } from 'react-native';

export function ImagePicker({
  onImageSelect,
  backgroundColor = '#ffffff'
}: {
  onImageSelect: (imageLocation: string) => any;
  backgroundColor: string;
}) {
  return (
    <View style={[{ backgroundColor }, styles.container]}>
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
  onImageSelect
}: {
  onImageSelect: (imageLocation: string) => any;
}) {
  const backgroundColor = useThemeColor({}, 'white');
  return ImagePicker({ onImageSelect, backgroundColor });
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
