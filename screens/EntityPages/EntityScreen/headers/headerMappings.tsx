import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import { ImageBackground, ImageSourcePropType, StyleSheet } from 'react-native';
import { HeaderTitle, HeaderBackButton } from '@react-navigation/elements';

const headerWithBackground = (
  backgroundImage: ImageSourcePropType,
  height: number = 150
) => {
  return (props: NativeStackHeaderProps) => {
    const overlayColor = useThemeColor({}, 'overlay');
    return (
      <TransparentView style={{ height: height }}>
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={backgroundImage}
        >
          <View
            style={[styles.overlay, { backgroundColor: `${overlayColor}99` }]}
          >
            <HeaderBackButton
              tintColor={props.options.headerTintColor}
              onPress={props.navigation.goBack}
            />
            <HeaderTitle tintColor={props.options.headerTintColor}>
              {props.options.title}
            </HeaderTitle>
            <View style={styles.sideSections}>
              {props.options.headerRight ? props.options.headerRight({...props, canGoBack: false}) : null}
            </View>
          </View>
        </ImageBackground>
      </TransparentView>
    );
  };
};

export const headerMapping = {
  default: headerWithBackground(
    require('assets/images/header-backgrounds/cars.png'),
    150
  )
} as { [key: string]: React.ElementType | undefined };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sideSections: {
    width: 100,
    backgroundColor: 'transparent'
  }
});
