import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';
import { useNavigation } from '@react-navigation/native';
import { parsePresignedUrl } from 'utils/urls';
import SafePressable from 'components/molecules/SafePressable';

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderWidth: 1
  },
  listEntryText: {
    fontSize: 20,
    marginLeft: 15
  }
});

export default function GenericEntityWithImageCard({
  entity
}: {
  entity: EntityResponseType;
}) {
  const blackColor = useThemeColor({}, 'black');
  const greyColor = useThemeColor({}, 'grey');
  const navigation = useNavigation();

  const imageSource = parsePresignedUrl(entity.presigned_image_url);
  return (
    <SafePressable
      onPress={() => {
        (navigation as any).push('EntityScreen', { entityId: entity.id });
      }}
    >
      <WhiteView style={[styles.listEntry, { borderColor: blackColor }]}>
        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            style={[styles.image, { borderColor: blackColor }]}
          />
        ) : (
          <Feather name="image" size={40} color={greyColor} />
        )}
        <BlackText text={`${entity.name}`} style={styles.listEntryText} />
      </WhiteView>
    </SafePressable>
  );
}
