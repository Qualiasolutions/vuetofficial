import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { Image, StyleSheet } from 'react-native';
import { getDatesPeriodString } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { EntityResponseType } from 'types/entities';
import { parsePresignedUrl } from 'utils/urls';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';

type Props = {
  entity: EntityResponseType;
  startDateField: string;
  endDateField: string;
  utc: boolean;
};
export default function EntityWithDateAndImageCard({
  entity,
  startDateField,
  endDateField,
  utc
}: Props) {
  const styles = StyleSheet.create({
    card: {
      marginTop: 10,
      borderColor: useThemeColor({}, 'almostBlack')
    },
    cardInner: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    listEntryText: {
      fontSize: 20
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

  const startDate = new Date(entity[startDateField]);
  const endDate = new Date(entity[endDateField]);

  const imageSource = parsePresignedUrl(entity.presigned_image_url);

  return (
    <WhiteBox style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          (navigation as any).navigate('EntityScreen', { entityId: entity.id });
        }}
        style={styles.cardInner}
      >
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
            text={getDatesPeriodString(startDate, endDate, utc)}
          />
        </TransparentView>
      </TouchableOpacity>
    </WhiteBox>
  );
}
