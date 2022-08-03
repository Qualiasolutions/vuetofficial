import { useThemeColor } from 'components/Themed';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ViewStyle,
  Pressable
} from 'react-native';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import { useEffect, useState } from 'react';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export type CustomFile = {
  name: string;
  size: number;
  uri: string;
  type: string;
};

export type PickedFile = CustomFile;

type ImagePickerProps = {
  onImageSelect: (image: PickedFile) => any;
  backgroundColor: string;
  defaultImageUrl?: string;
  style?: ViewStyle;
};

export function ImagePicker({
  onImageSelect,
  backgroundColor = '#ffffff',
  defaultImageUrl = '',
  style = {}
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] =
    useState<DocumentPicker.DocumentResult | null>(null);

  useEffect(() => {
    if (selectedImage && selectedImage.type === 'success') {
      if (selectedImage.file) {
        onImageSelect(selectedImage.file);
      } else if (selectedImage.uri && selectedImage.size) {
        const { name, size, uri } = selectedImage;
        const nameParts = name.split('.');
        const fileType = nameParts[nameParts.length - 1];

        FileSystem.readAsStringAsync(selectedImage.uri).then((res) => {
          onImageSelect({
            name,
            size,
            uri,
            type: 'application/' + fileType
          });
        });
      }
    }
  }, [selectedImage]);

  const chooseImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'image/*'
    });
    if (res.type === 'success') {
      setSelectedImage(res);
    } else {
      setSelectedImage(null);
    }
  };

  const imageSource =
    (selectedImage?.type === 'success' &&
      selectedImage?.uri && { uri: selectedImage.uri }) ||
    (defaultImageUrl && {
      uri: defaultImageUrl.replace('localstack', vuetApiUrl.split(':')[0])
    }) ||
    require('../../../assets/images/icons/camera.png');

  return (
    <Pressable onPress={chooseImage}>
      <View style={[{ backgroundColor }, styles.container, style]}>
        <Image
          style={
            selectedImage || defaultImageUrl
              ? styles.selectedImage
              : styles.placeholderImage
          }
          // Some hacky string replacement for local dev (ensure can access localstack S3)
          source={imageSource}
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

export function FullWidthImagePicker({
  onImageSelect,
  defaultImageUrl = '',
  style = {}
}: Omit<ImagePickerProps, 'backgroundColor'>) {
  const backgroundColor = useThemeColor({}, 'grey');

  return ImagePicker({
    onImageSelect,
    backgroundColor,
    defaultImageUrl,
    style: [styles.fullWidth, style] as ViewStyle
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
  },
  fullWidth: {
    borderRadius: 0,
    height: 160,
    width: '100%'
  },
  smallCameraIcon: {
    marginBottom: 10,
  }
});





export function SmallImagePicker({
  onImageSelect,
  style = {}
}: Omit<ImagePickerProps, 'backgroundColor'> ) {
  const [selectedImage, setSelectedImage] =
    useState<DocumentPicker.DocumentResult | null>(null);

  useEffect(() => {
    if (selectedImage && selectedImage.type === 'success') {
      if (selectedImage.file) {
        onImageSelect(selectedImage.file);
      } else if (selectedImage.uri && selectedImage.size) {
        const { name, size, uri } = selectedImage;
        const nameParts = name.split('.');
        const fileType = nameParts[nameParts.length - 1];

        FileSystem.readAsStringAsync(selectedImage.uri).then((res) => {
          onImageSelect({
            name,
            size,
            uri,
            type: 'application/' + fileType
          });
        });
      }
    }
  }, [selectedImage]);

  const chooseImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'image/*'
    });
    if (res.type === 'success') {
      setSelectedImage(res);
    } else {
      setSelectedImage(null);
    }
  };

  const imageSource =
    require('../../../assets/images/icons/small-camera.png');

  return (
    <Pressable onPress={chooseImage}>
        <Image
          style={styles.smallCameraIcon}
          // Some hacky string replacement for local dev (ensure can access localstack S3)
          source={imageSource}
        />
    </Pressable>
  );
}