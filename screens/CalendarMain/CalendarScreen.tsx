import Calendar from 'components/calendars/TaskCalendar';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { Image, Pressable, StyleSheet } from 'react-native';
import { RootTabScreenProps } from 'types/base';
import { parsePresignedUrl } from 'utils/urls';
import { HeaderBackButton } from '@react-navigation/elements';
import { useThemeColor, View } from 'components/Themed';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { BlackText } from 'components/molecules/TextComponents';
import HomeCalendar from 'components/calendars/HomeCalendar';

export function CalendarScreenHeader(props: BottomTabHeaderProps) {
  return (
    <WhiteView style={styles.headerWrapper}>
      <TransparentView style={styles.headerInnerWrapper}>
        <View style={styles.sideSections}>
          {props.options.headerLeft ? (
            props.options.headerLeft({})
          ) : (
            <HeaderBackButton
              tintColor={props.options.headerTintColor}
              onPress={props.navigation.goBack}
            />
          )}
        </View>
        <BlackText
          text={props.options.title || ''}
          bold={true}
          style={styles.headerTitle}
        />
        <View style={styles.sideSections}>
          {props.options.headerRight ? props.options.headerRight({}) : null}
        </View>
      </TransparentView>
    </WhiteView>
  );
}

export function CalendarScreenHeaderLeft() {
  const { data: userDetails } = getUserFullDetails();
  const navigation = useNavigation();
  const whiteColor = useThemeColor({}, 'white');

  if (!userDetails) {
    return null;
  }

  const imageSource = userDetails.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/camera.png');

  return (
    <Pressable
      onPress={() => (navigation as any).openDrawer()}
      style={[
        styles.profileImageWrapper,
        styles.elevated,
        {
          backgroundColor: whiteColor
        }
      ]}
    >
      <Image
        source={imageSource}
        style={[
          styles.headerProfileImage,
          !userDetails.presigned_profile_image_url && styles.defaultProfileImage
        ]}
      />
    </Pressable>
  );
}

type Props = RootTabScreenProps<'CalendarScreen'>;
function CalendarScreen({ navigation }: Props) {
  return <HomeCalendar />
  // return <Calendar taskFilters={[]} periodFilters={[]} reminderFilters={[]} />;
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    height: 120,
    paddingBottom: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    elevation: 3
  },
  headerTitle: {
    fontSize: 20
  },
  headerInnerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImageWrapper: {
    height: 60,
    width: 60,
    marginLeft: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    elevation: 3
  },
  defaultProfileImage: {
    height: 30,
    width: 30
  },
  headerProfileImage: {
    height: '100%',
    width: '100%'
  },
  sideSections: {
    width: 100,
    backgroundColor: 'transparent'
  }
});

export default CalendarScreen;
