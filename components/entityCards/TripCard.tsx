import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { Image, Pressable, StyleSheet } from 'react-native';
import {
  getDatesPeriodString,
  getDateWithoutTimezone,
  getDaysToAge,
  getLongDateFromDateObject
} from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { EntityResponseType } from 'types/entities';
import { parsePresignedUrl } from 'utils/urls';
import { Feather } from '@expo/vector-icons';

export default function TripCard({ entity }: { entity: EntityResponseType }) {
  const styles = StyleSheet.create({
    card: {
      marginTop: 10,
      alignItems: 'center',
      borderColor: useThemeColor({}, 'almostBlack'),
      flexDirection: 'row'
    },
    listEntryText: {
      fontSize: 20
      // width: 200
    },
    imageOrPlaceholder: {
      marginRight: 20
    },
    image: {
      height: 40,
      width: 40,
      borderRadius: 10,
      borderWidth: 1
    },
    textContainer: {
      flex: 1
    }
  });

  const navigation = useNavigation();
  const blackColor = useThemeColor({}, 'black');
  const greyColor = useThemeColor({}, 'grey');

  const startDate = getDateWithoutTimezone(entity?.start_date);
  const endDate = getDateWithoutTimezone(entity?.end_date);

  const imageSource = parsePresignedUrl(entity.presigned_image_url);

  return (
    <Pressable
      onPress={() => {
        (navigation as any).push('EntityScreen', { entityId: entity.id });
      }}
    >
      <WhiteBox style={styles.card}>
        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            style={[
              styles.image,
              styles.imageOrPlaceholder,
              { borderColor: blackColor }
            ]}
          />
        ) : (
          <Feather
            name="image"
            size={40}
            color={greyColor}
            style={styles.imageOrPlaceholder}
          />
        )}
        <TransparentView style={styles.textContainer}>
          <LightBlackText
            text={entity.name || ''}
            style={styles.listEntryText}
            numberOfLines={1}
          />
          <AlmostBlackText
            style={{ fontSize: 18 }}
            text={getDatesPeriodString(startDate, endDate)}
          />
        </TransparentView>
      </WhiteBox>
    </Pressable>
  );
}
