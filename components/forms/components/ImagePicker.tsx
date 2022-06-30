import { useThemeColor } from 'components/Themed';
import { StyleSheet, View, Image, Text, ViewStyle, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';

type ImagePickerProps = {
  onImageSelect: (image: File) => any;
  backgroundColor: string;
  defaultImageUrl?: string;
  style?: ViewStyle;
}

export function ImagePicker({
  onImageSelect,
  backgroundColor = '#ffffff',
  defaultImageUrl = '',
  style = {}
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<DocumentPicker.DocumentResult | null>(null)

  useEffect(() => {
    if (selectedImage && selectedImage.type === 'success' && selectedImage.file) {
      onImageSelect(selectedImage.file)
    }
  }, [selectedImage])

  const chooseImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'image/*'
    })
    if (res.type === 'success') {
      setSelectedImage(res)
    } else {
      setSelectedImage(null)
    }
  }
  return (
    <Pressable onPress = { chooseImage }>
      <View style={[{ backgroundColor }, styles.container, style]}>
        <Image
          style={(selectedImage || defaultImageUrl) ? styles.selectedImage : styles.placeholderImage}
          source={selectedImage || defaultImageUrl || require('../../../assets/images/icons/camera.png')}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}

export function WhiteImagePicker({
  onImageSelect,
  defaultImageUrl = '',
  style = {}
}: Omit<ImagePickerProps, 'backgroundColor'>) {
  const backgroundColor = useThemeColor({}, 'white');
  return ImagePicker({
    onImageSelect,
    backgroundColor,
    defaultImageUrl,
    style
  });
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
    justifyContent: 'center',
    overflow: 'hidden'
  },
  placeholderImage: {
    width: 40,
    height: 40
  },
  selectedImage: {
    width: '100%',
    height: '100%'
  }
});
