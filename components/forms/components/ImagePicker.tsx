import { useThemeColor } from 'components/Themed';
import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  GestureResponderEvent
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { parsePresignedUrl } from 'utils/urls';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Image } from 'components/molecules/ImageComponents';

export type CustomFile = {
  height: number;
  width: number;
  uri: string;
  type: string;
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
    useState<ExpoImagePicker.ImagePickerResult | null>(null);

  const borderColor = useThemeColor({}, 'grey');

  useEffect(() => {
    if (selectedImage && !selectedImage?.canceled) {
      const imageAsset = selectedImage?.assets[0];
      if (
        imageAsset &&
        imageAsset.uri &&
        imageAsset.width &&
        imageAsset.height
      ) {
        const { uri } = imageAsset;
        const nameParts = uri.split('.');
        const fileType = nameParts[nameParts.length - 1];

        onImageSelect({
          ...imageAsset,
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

    if (res.canceled) {
      setSelectedImage(null);
    } else {
      setSelectedImage(res);
    }
  };

  const imageSource =
    (displayInternalImage &&
      selectedImage &&
      (selectedImage as any)?.assets[0] &&
      (selectedImage as any)?.assets[0].uri &&
      !((selectedImage as any).assets as any)[0].canceled) ||
    (defaultImageUrl && {
      uri: parsePresignedUrl(defaultImageUrl)
    }) ||
    require('assets/images/icons/camera.png');

  if (PressableComponent) {
    return <PressableComponent onPress={chooseImage} />;
  }

  return (
    <Pressable onPress={chooseImage}>
      <TransparentView
        style={[{ backgroundColor, borderColor }, styles.container, style]}
      >
        <Image
          style={
            selectedImage || defaultImageUrl
              ? styles.selectedImage
              : styles.placeholderImage
          }
          source={imageSource}
          resizeMode="cover"
        />
      </TransparentView>
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
    <Pressable onPress={props.onPress} style={style}>
      <Image source={require('assets/images/icons/small-camera.png')} />
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
  }
});
