import { useThemeColor } from 'components/Themed';
import {
  StyleSheet,
  View,
  Image,
  ViewStyle,
  Pressable,
  GestureResponderEvent
} from 'react-native';
import Constants from 'expo-constants';
import * as ExpoImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { parsePresignedUrl } from 'utils/urls';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export type CustomFile = {
  height: number;
  width: number;
  uri: string;
  type: string;
  cancelled: boolean;
};

export type PickedFile = File | CustomFile;

type ImagePickerProps = {
  onImageSelect: (image: PickedFile) => any;
  backgroundColor: string;
  defaultImageUrl?: string;
  style?: ViewStyle;
  displayInternalImage?: boolean;
  aspect?: [number, number];
  PressableComponent?: React.ElementType;
};

export function ImagePicker({
  onImageSelect,
  backgroundColor = '#ffffff',
  defaultImageUrl = '',
  style = {},
  displayInternalImage = true,
  aspect = undefined,
  PressableComponent = undefined
}: ImagePickerProps) {
  /*

  displayInternalImage: this is true if we want to show the component's
    internally selected image when it exists rather than the default
    image URL. This should be avoided where possible and parent components
    should instead pass `defaultImageUrl` to prevent the data from getting
    out of sync with the parent. It defaults to `true` to support old code.
  */
  const [selectedImage, setSelectedImage] =
    useState<ExpoImagePicker.ImageInfo | null>(null);

  const borderColor = useThemeColor({}, 'grey');

  useEffect(() => {
    if (selectedImage && selectedImage.type === 'image') {
      if (selectedImage.uri && selectedImage.width && selectedImage.height) {
        const { uri } = selectedImage;
        const nameParts = uri.split('.');
        const fileType = nameParts[nameParts.length - 1];

        onImageSelect({
          ...selectedImage,
          name: uri,
          type: 'application/' + fileType
        });
      }
    }
  }, [selectedImage]);

  const chooseImage = async () => {
    const res = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: aspect,
      quality: 1
    });

    if (res.cancelled) {
      setSelectedImage(null);
    } else {
      setSelectedImage(res as ExpoImagePicker.ImageInfo);
    }
  };

  const imageSource =
    (displayInternalImage &&
      selectedImage?.type === 'image' &&
      selectedImage?.uri && { uri: selectedImage.uri }) ||
    (defaultImageUrl && {
      uri: parsePresignedUrl(defaultImageUrl)
    }) ||
    require('assets/images/icons/camera.png');

  if (PressableComponent) {
    return <PressableComponent onPress={chooseImage} />;
  }

  return (
    <Pressable onPress={chooseImage}>
      <View style={[{ backgroundColor, borderColor }, styles.container, style]}>
        <Image
          style={
            selectedImage || defaultImageUrl
              ? styles.selectedImage
              : styles.placeholderImage
          }
          source={imageSource}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}

export function WhiteImagePicker(
  props: Omit<ImagePickerProps, 'backgroundColor'>
) {
  const backgroundColor = useThemeColor({}, 'white');
  const { style, ...otherProps } = props;

  return ImagePicker({
    style: [style] as ViewStyle,
    backgroundColor,
    ...otherProps
  });
}

export function FullWidthImagePicker(
  props: Omit<ImagePickerProps, 'backgroundColor'>
) {
  const backgroundColor = useThemeColor({}, 'grey');
  const { style, ...otherProps } = props;

  return ImagePicker({
    style: [styles.fullWidth, style] as ViewStyle,
    backgroundColor,
    ...otherProps
  });
}

export function SmallImagePicker(
  props: Omit<ImagePickerProps, 'PressableComponent' | 'backgroundColor'>
) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'transparent');

  const PressableComponent = (props: {
    onPress: (event: GestureResponderEvent) => void;
  }) => (
    <Pressable onPress={props.onPress}>
      <Image
        style={styles.smallCameraIcon}
        source={require('assets/images/icons/small-camera.png')}
      />
    </Pressable>
  );

  return ImagePicker({
    style: [style] as ViewStyle,
    backgroundColor,
    PressableComponent,
    ...otherProps
  });
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 1,
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
    height: '100%',
    flex: 1
  },
  fullWidth: {
    borderRadius: 0,
    height: 160,
    width: '100%'
  },
  smallCameraIcon: {
    marginBottom: 10
  }
});
