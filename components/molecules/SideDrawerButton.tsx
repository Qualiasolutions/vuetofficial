import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafePressable from './SafePressable';
import { WhitePaddedView } from './ViewComponents';
import { elevation } from 'styles/elevation';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { parsePresignedUrl } from 'utils/urls';
import { Image } from './ImageComponents';
import { useThemeColor } from 'components/Themed';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'visible'
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
  }
});

export default function SideDrawerButton() {
  const navigation = useNavigation();
  const { data: userDetails } = useGetUserFullDetails();
  const whiteColor = useThemeColor({}, 'white');

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
    </WhitePaddedView>
  );
}
