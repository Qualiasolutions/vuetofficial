import { RouteProp } from '@react-navigation/native';
import { NativeStackHeaderProps, NativeStackNavigationOptions, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import { ImageBackground, StyleSheet } from 'react-native';
import { EntityTabParamList } from 'types/base';
import { HeaderTitle, HeaderBackButton } from '@react-navigation/elements';

export const headerMapping = {
  cars: (props: NativeStackHeaderProps) => {
    console.log(props)
    const overlayColor = useThemeColor({}, 'overlay');
    return (
      <TransparentView style={styles.container}>
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('assets/images/header-backgrounds/cars.png')}
        >
          <View
            style={[styles.overlay, { backgroundColor: `${overlayColor}99` }]}
          >
            <HeaderBackButton tintColor={props.options.headerTintColor} onPress={props.navigation.goBack}/>
            <HeaderTitle tintColor={props.options.headerTintColor}>
              {props.options.title}
            </HeaderTitle>
            <View style={styles.sideSections}></View>
          </View>
        </ImageBackground>
      </TransparentView>
    );
  }
} as { [key: string]: React.ElementType | undefined };

const styles = StyleSheet.create({
  container: {
    height: 150
  },
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
