import {
  PickedFile,
  SmallImagePicker
} from 'components/forms/components/ImagePicker';
import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ListEntryResponse } from 'types/lists';
import Checkbox from 'components/molecules/Checkbox';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import {
  useDeleteListEntryMutation,
  useUpdateListEntryMutation,
  useFormUpdateListEntryMutation
} from 'reduxStore/services/api/lists';
import { Autosave } from 'hooks/autoSave';
import { Swipeable, TouchableHighlight } from 'react-native-gesture-handler';
import { TextInput } from 'components/molecules/TextInputComponents';
import { parsePresignedUrl } from 'utils/urls';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Image } from 'components/molecules/ImageComponents';
import { useThemeColor } from 'components/Themed';

export default function ListEntry({
  listEntry
}: {
  listEntry: ListEntryResponse;
}) {
  const [deleteListEntry, deleteListEntryResult] = useDeleteListEntryMutation();
  const [updateListEntry, updateListEntryResult] = useUpdateListEntryMutation();
  const [formUpdateListEntry, formUpdateListEntryResult] =
    useFormUpdateListEntryMutation();
  const [note, updateNote] = useState<string>(listEntry.notes);
  const [phoneNumber, updatePhoneNumber] = useState<string>(
    listEntry.phone_number
  );
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>('');
  const primaryColor = useThemeColor({}, 'primary');
  const trashImage = require('assets/images/icons/trash.png');

  const styles = StyleSheet.create({
    listEntryContainer: {
      width: '100%',
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: useThemeColor({}, 'grey'),
      backgroundColor: useThemeColor({}, 'white'),
      flexDirection: 'row'
    },
    listEntrySwipeable: {
      paddingRight: 40,
      paddingLeft: 40,
      paddingTop: 10,
      paddingBottom: 40,
      flexGrow: 1
    },
    title: {
      fontSize: 16,
      paddingLeft: 10
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'row'
    },
    image: {
      width: 100,
      height: 100
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingLeft: 20,
      paddingTop: 20
    },
    icon: {
      marginBottom: 10,
      width: 30,
      height: 30
    },
    content: {
      width: 200
    },
    input: {
      color: useThemeColor({}, 'almostBlack'),
      fontSize: 14,
      marginTop: 2
    },
    errorMessage: {
      color: useThemeColor({}, 'errorText')
    }
  });

  const updateSelected = (selected: boolean) => {
    updateListEntry({
      id: listEntry.id,
      selected: selected
    });
  };

  const updateNoteInDb = (note: string) => {
    updateListEntry({
      id: listEntry.id,
      notes: note
    });
  };

  const updatePhoneNumberInDb = (number: string) => {
    updateListEntry({
      id: listEntry.id,
      phone_number: number
    })
      .unwrap()
      .then((payload) => setPhoneNumberErrorMessage(''))
      .catch((error) =>
        setPhoneNumberErrorMessage(
          'Please enter a valid phone number (starting with +44)'
        )
      );
  };

  const onImageSelect = (image: PickedFile) => {
    const data = new FormData();
    data.append('image', image as any);

    formUpdateListEntry({
      id: listEntry.id,
      formData: data
    });
  };

  const imageSource = parsePresignedUrl(listEntry?.presigned_image_url);

  const renderRightActions = () => {
    return (
      <TouchableHighlight
        style={{
          width: 35,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}
        onPress={() => {
          deleteListEntry(listEntry.id);
        }}
      >
        <TransparentView
          style={{
            backgroundColor: primaryColor,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 35
          }}
        >
          <Image source={trashImage} style={{ margin: 'auto' }}></Image>
        </TransparentView>
      </TouchableHighlight>
    );
  };

  return (
    <TransparentView style={styles.listEntryContainer}>
      <TransparentView style={styles.iconContainer}>
        <SmallImagePicker onImageSelect={onImageSelect} style={styles.icon} />
      </TransparentView>
      <Swipeable
        useNativeAnimations={true}
        overshootRight={false}
        renderRightActions={renderRightActions}
        containerStyle={styles.listEntrySwipeable}
      >
        <>
          <TransparentView style={styles.content}>
            <TransparentView style={styles.titleWrapper}>
              <Pressable onPress={() => updateSelected(!listEntry.selected)}>
                <Checkbox checked={listEntry.selected} />
              </Pressable>
              <AlmostBlackText text={listEntry.title} style={styles.title} />
            </TransparentView>
            {imageSource ? (
              <Image source={{ uri: imageSource }} style={styles.image} />
            ) : (
              <></>
            )}
            <TextInput
              style={styles.input}
              placeholder="Notes"
              onChangeText={(note) => updateNote(note)}
              defaultValue={listEntry.notes}
              multiline
            />
            <>
              {phoneNumberErrorMessage !== '' ? (
                <AlmostBlackText
                  style={styles.errorMessage}
                  text={phoneNumberErrorMessage}
                />
              ) : (
                <></>
              )}
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                onChangeText={(num) => updatePhoneNumber(num)}
                defaultValue={listEntry.phone_number}
                keyboardType={'phone-pad'}
              />
            </>
          </TransparentView>
          <Autosave experimentData={note} saveDataToDb={updateNoteInDb} />
          <Autosave
            experimentData={phoneNumber}
            saveDataToDb={updatePhoneNumberInDb}
          />
        </>
      </Swipeable>
    </TransparentView>
  );
}
