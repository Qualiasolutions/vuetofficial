import {
  CustomFile,
  PickedFile,
  SmallImagePicker
} from 'components/forms/components/ImagePicker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Animated
} from 'react-native';
import { ListEntryResponse } from 'types/lists';
import Checkbox from 'components/molecules/Checkbox';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import {
  useDeleteListEntryMutation,
  useUpdateListEntryMutation,
  useFormUpdateListEntryMutation
} from 'reduxStore/services/api/lists';
import { Autosave } from 'hooks/autoSave';
import GestureRecognizer from 'react-native-swipe-gestures';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useThemeColor } from 'components/Themed';
import Constants from 'expo-constants';
import { parsePresignedUrl } from 'utils/urls';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export default function ListEntry({
  listEntry
}: {
  listEntry: ListEntryResponse;
}) {
  const [deleteListEntry, deleteListEntryResult] = useDeleteListEntryMutation();
  const [updateListEntry, updateListEntryResult] = useUpdateListEntryMutation();
  const [formUpdateListEntry, formUpdateListEntryResult] =
    useFormUpdateListEntryMutation();
  const [showIcons, updateShowIcons] = useState<boolean>(false);
  const [addingNote, setAddingNote] = useState<boolean>(false);
  const [addingPhoneNumber, setAddingPhoneNumber] = useState<boolean>(false);
  const [note, updateNote] = useState<string>(listEntry.notes);
  const [phoneNumber, updatePhoneNumber] = useState<string>(
    listEntry.phone_number
  );
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>('');
  const [showDeleteAndArchive, setShowDeleteAndArchive] =
    useState<boolean>(false);

  const phoneImage = require('assets/images/icons/phone.png');
  const locationImage = require('assets/images/icons/location.png');
  const noteImage = require('assets/images/icons/note.png');
  const trashImage = require('assets/images/icons/trash.png');

  //animations
  const listEntryTranslateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showDeleteAndArchive) {
      Animated.timing(listEntryTranslateX, {
        toValue: -35,
        duration: 500,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(listEntryTranslateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [showDeleteAndArchive]);

  const styles = StyleSheet.create({
    listEntryContainer: {
      width: '100%',
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: useThemeColor({}, 'grey'),
      backgroundColor: useThemeColor({}, 'white'),
      paddingRight: 40,
      paddingLeft: 40,
      paddingTop: 10,
      paddingBottom: 40
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
      position: 'absolute',
      top: 20,
      right: 25,
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      marginBottom: 10
    },
    content: {
      minHeight: 100
    },
    input: {
      color: useThemeColor({}, 'almostBlack'),
      fontSize: 14,
      marginTop: 10
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

  const imageSource = parsePresignedUrl(listEntry?.presigned_image_url)

  return (
    <Animated.View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        minHeight: 100,
        transform: [{ translateX: listEntryTranslateX }]
      }}
    >
      <GestureRecognizer
        onSwipeLeft={(state) => {
          setShowDeleteAndArchive(true);
        }}
        onSwipeRight={(state) => {
          setShowDeleteAndArchive(false);
        }}
        style={styles.listEntryContainer}
      >
        {showIcons ? (
          <View style={styles.iconContainer}>
            <Pressable onPress={() => setAddingNote(!addingNote)}>
              <Image source={noteImage} style={styles.icon} />
            </Pressable>
            <SmallImagePicker
              onImageSelect={onImageSelect}
              style={styles.icon}
            />
            <Pressable onPress={() => setAddingPhoneNumber(!addingPhoneNumber)}>
              <Image source={phoneImage} style={styles.icon} />
            </Pressable>
            <Image source={locationImage} style={styles.icon} />
          </View>
        ) : (
          <></>
        )}
        <Pressable
          onPress={() => {
            updateShowIcons(!showIcons);
          }}
        >
          <View style={styles.content}>
            <View style={styles.titleWrapper}>
              <Pressable onPress={() => updateSelected(!listEntry.selected)}>
                <Checkbox checked={listEntry.selected} />
              </Pressable>
              <AlmostBlackText text={listEntry.title} style={styles.title} />
            </View>
            {imageSource ? (
              <Image source={{ uri: imageSource }} style={styles.image} />
            ) : (
              <></>
            )}
            {listEntry.notes || addingNote ? (
              <TextInput
                style={styles.input}
                placeholder="Enter a new note"
                onChangeText={(note) => updateNote(note)}
                defaultValue={listEntry.notes}
              />
            ) : (
              <></>
            )}
            {listEntry.phone_number || addingPhoneNumber ? (
              <>
                {phoneNumberErrorMessage !== '' ? (
                  <Text style={styles.errorMessage}>
                    {phoneNumberErrorMessage}
                  </Text>
                ) : (
                  <></>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Enter a phonenumber"
                  onChangeText={(num) => updatePhoneNumber(num)}
                  defaultValue={listEntry.phone_number}
                />
              </>
            ) : (
              <></>
            )}
          </View>
          <Autosave experimentData={note} saveDataToDb={updateNoteInDb} />
          <Autosave
            experimentData={phoneNumber}
            saveDataToDb={updatePhoneNumberInDb}
          />
        </Pressable>
      </GestureRecognizer>

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
        <View
          style={{
            backgroundColor: useThemeColor({}, 'primary'),
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 35
          }}
        >
          <Image source={trashImage} style={{ margin: 'auto' }}></Image>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
}
