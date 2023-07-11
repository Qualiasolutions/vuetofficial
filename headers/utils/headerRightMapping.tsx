import { WhiteText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'components/molecules/ImageComponents';
import SafePressable from 'components/molecules/SafePressable';
import { useSelector } from 'react-redux';
import { selectMemberEntityById } from 'reduxStore/slices/entities/selectors';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },
  editImage: {
    height: 27,
    width: 31
  },
  pressable: {
    padding: 10,
    borderRadius: 10,
    flex: 0,
    width: 'auto'
  }
});

const EditPressable: React.ElementType = ({ route, navigation }) => {
  const backgroundColor = useThemeColor({}, 'lightPrimary');
  const isMemberEntity = !!useSelector(
    selectMemberEntityById(route.params.entityId)
  );
  return (
    <TransparentView style={styles.wrapper}>
      {isMemberEntity && (
        <SafePressable
          onPress={() =>
            navigation.navigate('EditEntity', {
              entityId: route.params.entityId
            })
          }
          style={[styles.pressable, { backgroundColor }]}
        >
          <Image
            source={require('assets/images/edit.png')}
            style={styles.editImage}
          />
        </SafePressable>
      )}
    </TransparentView>
  );
};

export const headerRightMapping = {
  entities: {
    default: () => null
  },
  entityTypes: {
    holidays: ({ route, navigation }) => {
      const { t } = useTranslation();
      return (
        <SafePressable onPress={() => navigation.navigate('HolidayList')}>
          <WhiteText text={t('misc.editCountryList')} />
        </SafePressable>
      );
    },
    default: () => null
  }
} as {
  entities: {
    [key: string]: React.ElementType | undefined;
  };
  entityTypes: {
    [key: string]: React.ElementType | undefined;
  };
};
