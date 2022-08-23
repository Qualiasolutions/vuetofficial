import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import { ImageBackground, StyleSheet } from 'react-native';

export const headerBackgroundMapping = {
  Holiday: (props) => {
    const overlayColor = useThemeColor({}, 'overlay');
    return (
      <TransparentView>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          source={require('assets/images/header-backgrounds/holidays.png')}
        >
          <View
            style={[styles.overlay, { backgroundColor: `${overlayColor}99` }]}
          >
          </View>
        </ImageBackground>
      </TransparentView>
    )
  },
} as { [key: string]: (React.ElementType | undefined) };



const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  }
});