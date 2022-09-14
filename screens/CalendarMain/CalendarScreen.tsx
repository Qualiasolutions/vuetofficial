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
import { View } from 'components/Themed';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { BlackText } from 'components/molecules/TextComponents';

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

  if (!userDetails) {
    return null;
  }

  const imageSource = userDetails.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/camera.png');

  return (
    <Pressable onPress={() => (navigation as any).openDrawer()}>
      <Image source={imageSource} style={styles.headerProfileImage} />
    </Pressable>
  );
}

type Props = RootTabScreenProps<'CalendarScreen'>;
function CalendarScreen({ navigation }: Props) {
  return <Calendar filters={[]} />;
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
  headerProfileImage: {
    height: 60,
    width: 60,
    marginLeft: 40,
    borderRadius: 30
  },
  sideSections: {
    width: 100,
    backgroundColor: 'transparent'
  }
});

export default CalendarScreen;
