import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafePressable from './SafePressable';
import { TransparentView, WhitePaddedView } from './ViewComponents';
import { elevation } from 'styles/elevation';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { parsePresignedUrl } from 'utils/urls';
import { Image } from './ImageComponents';
import { useThemeColor } from 'components/Themed';
import { Feather } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from 'types/base';
import { TouchableOpacity } from './TouchableOpacityComponents';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: 'space-between',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightButtons: {
    flexDirection: 'row',
    paddingRight: 30
  },
  drawerPressableSize: {
    height: 60,
    width: 60,
    borderRadius: 15
  },
  drawerPressable: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
  drawerImage: {},
  drawerNullImage: {
    height: 30,
    width: 30
  },
  button: {
    marginLeft: 20
  }
});

export default function TopNav() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { data: userDetails } = useGetUserFullDetails();
  const whiteColor = useThemeColor({}, 'white');
  const primaryColor = useThemeColor({}, 'primary');

  const imageSource = userDetails?.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/camera.png');

  return (
    <WhitePaddedView style={[styles.container, elevation.elevated]}>
      <SafePressable
        onPress={() => (navigation as any).openDrawer()}
        style={[
          styles.drawerPressable,
          styles.drawerPressableSize,
          elevation.elevated,
          {
            backgroundColor: whiteColor
          }
        ]}
      >
        <Image
          source={imageSource}
          style={[
            ...(!userDetails?.presigned_profile_image_url
              ? [styles.drawerNullImage]
              : [styles.drawerImage, styles.drawerPressableSize]),
            {
              backgroundColor: whiteColor
            }
          ]}
        />
      </SafePressable>
      <TransparentView style={styles.rightButtons}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Alerts');
          }}
          style={styles.button}
        >
          <Feather name="alert-triangle" size={32} color={primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NewItems');
          }}
          style={styles.button}
        >
          <Feather name="bell" size={32} color={primaryColor} />
        </TouchableOpacity>
      </TransparentView>
    </WhitePaddedView>
  );
}
