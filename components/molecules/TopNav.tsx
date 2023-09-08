import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafePressable from './SafePressable';
import { TransparentView, WhitePaddedView } from './ViewComponents';
import { elevation } from 'styles/elevation';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { parsePresignedUrl } from 'utils/urls';
import { Image } from './ImageComponents';
import { Text, useThemeColor } from 'components/Themed';
import { Feather } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from 'types/base';
import { TouchableOpacity } from './TouchableOpacityComponents';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: 'space-between',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  rightButtons: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingTop: 10
  },
  myAccountSize: {
    height: 50,
    width: 50,
    borderRadius: 15
  },
  drawerPressable: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
  myAccountNullImage: {
    height: 24,
    width: 24
  },
  button: {
    marginLeft: 20,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 11
  }
});

const PageLink = ({
  pageName,
  iconName,
  title
}: {
  pageName: keyof RootTabParamList;
  iconName: keyof typeof Feather.glyphMap;
  title: string;
}) => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(pageName);
      }}
      style={styles.button}
    >
      <Feather name={iconName} size={32} color={primaryColor} />
      <Text style={[styles.buttonText, { color: primaryColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TopNav() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { data: userDetails } = useGetUserFullDetails();
  const whiteColor = useThemeColor({}, 'white');
  const primaryColor = useThemeColor({}, 'primary');
  const { t } = useTranslation();

  const imageSource = userDetails?.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/user-head.png');

  return (
    <WhitePaddedView style={[styles.container, elevation.elevated]}>
      <TouchableOpacity onPress={() => (navigation as any).openDrawer()}>
        <Feather name="align-justify" size={32} color={primaryColor} />
      </TouchableOpacity>
      <TransparentView style={styles.rightButtons}>
        <PageLink
          pageName="Alerts"
          iconName="alert-triangle"
          title={t('pageTitles.alerts')}
        />
        <PageLink
          pageName="NewItems"
          iconName="bell"
          title={t('pageTitles.newItems')}
        />
        <PageLink
          pageName="QuickJot"
          iconName="edit"
          title={t('pageTitles.quickJot')}
        />
        <PageLink
          pageName="OverdueTasks"
          iconName="flag"
          title={t('pageTitles.overdue')}
        />
      </TransparentView>
      {/* <TouchableOpacity
        onPress={() => (navigation as any).navigate('MyAccountNavigator')}
        style={[
          styles.drawerPressable,
          styles.myAccountSize,
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
              ? [styles.myAccountNullImage]
              : [styles.myAccountSize]),
            {
              backgroundColor: whiteColor
            }
          ]}
        />
      </TouchableOpacity> */}
    </WhitePaddedView>
  );
}
