import { BlackText, PrimaryText } from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { UserFullResponse, UserResponse } from 'types/users';
import { Text, View } from 'components/Themed';
import Checkbox from 'components/molecules/Checkbox';
import { useTranslation } from 'react-i18next';
import SafePressable from 'components/molecules/SafePressable';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhoneNumberInput from './PhoneNumberInput';
import { Button } from 'components/molecules/ButtonComponents';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { Feather } from '@expo/vector-icons';
import {
  useGetUserMinimalDetailsFromIdQuery,
  useLazyGetUserMinimalDetailsQuery
} from 'reduxStore/services/api/user';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { PaddedSpinner } from 'components/molecules/Spinners';

const styles = StyleSheet.create({
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22
  },
  addIcon: {
    height: 27,
    width: 27,
    marginRight: 12
  },
  membersItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 15,
    borderBottomWidth: 1
  },
  memberColour: {
    height: 9,
    width: 78,
    marginTop: 5
  },
  bottomContainer: {
    width: '100%',
    height: '100%',
    padding: 23,
    justifyContent: 'space-between'
  },
  phoneNumberInput: {
    marginTop: 30
  },
  phoneNumberAddButton: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  externalNumberListing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1
  },
  externalNumberListingText: {
    marginRight: 10
  },
  externalNumberSection: {
    marginTop: 40
  },
  okButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 2
  },
  externalMembersList: { marginTop: 30 },
  selectedMemberListing: { marginTop: 11 }
});

export function ModalListing({
  item
}: {
  item: (UserFullResponse | UserResponse) & { selected: boolean };
}) {
  return (
    <TransparentView style={styles.membersItem}>
      <TransparentView>
        <Text> {`${item.first_name} ${item.last_name}`} </Text>
        <View
          style={[
            styles.memberColour,
            { backgroundColor: `#${item.member_colour}` }
          ]}
        />
      </TransparentView>
      <Checkbox checked={item.selected} disabled={true} />
    </TransparentView>
  );
}

const ExternalListing = ({ memberId }: { memberId: number }) => {
  const { data: memberDetails, isLoading } =
    useGetUserMinimalDetailsFromIdQuery(memberId);

  if (isLoading || !memberDetails) {
    return <PaddedSpinner />;
  }

  return (
    <BlackText
      text={memberDetails.phone_number}
      style={styles.externalNumberListingText}
      bold={true}
    />
  );
};

export default function MemberSelector({
  data,
  values,
  onValueChange,
  changeMembersText
}: {
  data: {
    family: UserResponse[];
    friends: UserResponse[];
  };
  values: number[];
  onValueChange: (val: number[]) => void;
  changeMembersText?: string;
}) {
  const bottomSheetRef = useRef<RBSheet>(null);
  const [showMembersList, setShowMembersList] = useState<boolean>(false);
  const [newExternalNumber, setNewExternalNumber] = useState('');
  const { t } = useTranslation();

  const [getMinimalDetails, getMinimalDetailsResult, lastMinimalDetails] =
    useLazyGetUserMinimalDetailsQuery();

  const onSelectMember = (member: UserResponse) => {
    if (values.includes(member.id)) {
      onValueChange([...values.filter((i) => member.id !== i)]);
    } else {
      onValueChange([...values, member.id]);
    }
  };

  const onCloseMembersList = useCallback(() => {
    setShowMembersList(false);
  }, [setShowMembersList]);

  const allMembers = [...data.family];
  for (const member of data.friends) {
    if (!data.family.map((user) => user.id).includes(member.id)) {
      allMembers.push(member);
    }
  }

  const selectedMembersList = useMemo(() => {
    return allMembers
      .filter((member) => values.includes(member.id))
      .map((member: any) => {
        return (
          <TransparentView key={member.id} style={styles.selectedMemberListing}>
            <UserWithColor
              name={`${member.first_name} ${member.last_name}`}
              memberColour={member.member_colour}
              userImage={member.presigned_profile_image_url}
            />
          </TransparentView>
        );
      });
  }, [values]);

  const externalMembers = useMemo(() => {
    return values.filter(
      (memberId) => !allMembers.map((member) => member.id).includes(memberId)
    );
  }, [values, allMembers]);

  const externalMembersList = useMemo(() => {
    return (
      <TransparentView style={styles.externalMembersList}>
        {externalMembers.map((memberId: number, i: number) => {
          return (
            <TransparentView key={i} style={styles.selectedMemberListing}>
              <ExternalListing memberId={memberId} />
            </TransparentView>
          );
        })}
      </TransparentView>
    );
  }, [externalMembers]);

  useEffect(() => {
    if (showMembersList) bottomSheetRef?.current?.open();
    else bottomSheetRef?.current?.close();
  }, [showMembersList]);

  return (
    <TransparentView>
      {selectedMembersList}
      {externalMembers.length > 0 && externalMembersList}
      <SafePressable
        onPress={() => setShowMembersList(true)}
        style={styles.addMemberButton}
      >
        <Image
          source={require('assets/images/icons/plus.png')}
          style={styles.addIcon}
        />
        <PrimaryText
          text={
            changeMembersText || t('components.memberSelector.changeMembers')
          }
        />
      </SafePressable>
      <RBSheet
        ref={bottomSheetRef}
        height={600}
        onClose={onCloseMembersList}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }
        }}
        dragFromTopOnly={true}
        closeOnDragDown={true}
      >
        <WhiteView style={styles.bottomContainer}>
          <TransparentScrollView>
            <SafeAreaView>
              {data.family.map((user) => (
                <SafePressable
                  onPress={() => onSelectMember(user)}
                  key={user.id}
                >
                  <ModalListing
                    item={{
                      ...user,
                      selected: values.includes(user.id)
                    }}
                  />
                </SafePressable>
              ))}
              <TransparentView style={styles.externalNumberSection}>
                {values
                  .filter(
                    (memberId) =>
                      !allMembers.map((member) => member.id).includes(memberId)
                  )
                  .map((memberId: number, i) => (
                    <TransparentView
                      style={styles.externalNumberListing}
                      key={i}
                    >
                      <ExternalListing memberId={memberId} />
                      <SafePressable
                        onPress={() => {
                          onValueChange(
                            values.filter((number) => number !== memberId)
                          );
                        }}
                      >
                        <Feather name="trash" size={20} color="red" />
                      </SafePressable>
                    </TransparentView>
                  ))}
                <TransparentView style={styles.phoneNumberInput}>
                  <PhoneNumberInput
                    onChangeFormattedText={(newPhoneNumber) => {
                      setNewExternalNumber(newPhoneNumber);
                    }}
                  />
                  <TransparentView style={styles.phoneNumberAddButton}>
                    {getMinimalDetailsResult.isLoading ? (
                      <PaddedSpinner />
                    ) : (
                      <>
                        <Button
                          onPress={async () => {
                            try {
                              const res = await getMinimalDetails(
                                newExternalNumber
                              ).unwrap();
                              if (!values.includes(res.id)) {
                                onValueChange([...values, res.id]);
                              }
                              // TODO - we want to put the
                            } catch (err) {
                              // This doesn't show under modal
                              Toast.show({
                                type: 'error',
                                text1: t(
                                  'components.memberSelector.noMemberError'
                                )
                              });
                            }
                          }}
                          title={t('common.add')}
                        />
                        {getMinimalDetailsResult.isError && (
                          <TransparentView style={styles.phoneNumberAddButton}>
                            <Feather name="x" color="red" size={40} />
                            <PrimaryText
                              text={t(
                                'components.memberSelector.noMemberError'
                              )}
                            />
                          </TransparentView>
                        )}
                      </>
                    )}
                  </TransparentView>
                </TransparentView>
              </TransparentView>
            </SafeAreaView>
          </TransparentScrollView>
          <TransparentView style={styles.okButton}>
            <Button
              title={t('common.ok')}
              onPress={() => bottomSheetRef.current?.close()}
            />
          </TransparentView>
        </WhiteView>
      </RBSheet>
    </TransparentView>
  );
}
