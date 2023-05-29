import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import { ImageBackground, ImageSourcePropType, StyleSheet } from 'react-native';
import { HeaderTitle, HeaderBackButton } from '@react-navigation/elements';

export const headerWithBackgroundColor = (
  backgroundColor: string,
  height: number = 150
) => {
  return (props: NativeStackHeaderProps) => {
    const headerRight = props.options.headerRight;
    const borderColor = useThemeColor({}, 'grey');
    return (
      <TransparentView style={{ height: height }}>
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: backgroundColor || '#444444',
              borderBottomWidth: 4,
              borderBottomColor: borderColor
            }
          ]}
        >
          <HeaderBackButton
            tintColor={props.options.headerTintColor}
            onPress={props.navigation.goBack}
          />
          <HeaderTitle tintColor={props.options.headerTintColor}>
            {props.options.title}
          </HeaderTitle>
          <View style={styles.sideSections}>
            {headerRight ? headerRight({ canGoBack: true }) : null}
          </View>
        </View>
      </TransparentView>
    );
  };
};

export const headerWithBackground = (
  backgroundImage: ImageSourcePropType,
  height: number = 150
) => {
  return (props: NativeStackHeaderProps) => {
    const overlayColor = useThemeColor({}, 'overlay');
    const borderColor = useThemeColor({}, 'grey');
    const headerRight = props.options.headerRight;
    return (
      <TransparentView style={{ height: height }}>
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
            borderBottomWidth: 4,
            borderBottomColor: borderColor
          }}
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
              {headerRight ? headerRight({ canGoBack: true }) : null}
            </View>
          </View>
        </ImageBackground>
      </TransparentView>
    );
  };
};

// TODO - set correct images
export const headerMapping = {
  entities: {
    default: headerWithBackgroundColor('#444444'),
    Car: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    )
  },
  entityTypes: {
    cars: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    boats: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'public-transport': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    events: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    anniversaries: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    hobbies: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    trips: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    pets: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'days-off': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    holidays: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    schools: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'academic-plans': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'extracurricular-plans': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'career-goals': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    homes: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    food: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    clothing: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'social-plans': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'social-media': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'school-breaks': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    'health-beauty': headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    finance: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    SchoolBreak: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    TripActivity: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    Flight: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    TrainBusFerry: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    RentalCar: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    TaxiOrTransfer: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    DriveTime: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    HotelOrRental: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    StayWithFriend: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    Birthday: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    Anniversary: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    FAMILY: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    PETS: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    SOCIAL_INTERESTS: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    EDUCATION_CAREER: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    TRAVEL: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    HEALTH_BEAUTY: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    HOME_GARDEN: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    FINANCE: headerWithBackground(
      require('assets/images/header-backgrounds/holidays.png')
    ),
    TRANSPORT: headerWithBackground(
      require('assets/images/header-backgrounds/cars.png')
    ),
    default: headerWithBackgroundColor('#444444')
  }
} as {
  entities: { [key: string]: React.ElementType | undefined };
  entityTypes: { [key: string]: React.ElementType | undefined };
};

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
