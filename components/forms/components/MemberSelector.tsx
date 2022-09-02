import { ListingModal } from 'components/molecules/Modals';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { UserFullResponse, UserResponse } from 'types/users';
import { Text, View } from 'components/Themed';
import Checkbox from 'components/molecules/Checkbox';
import { useTranslation } from 'react-i18next';

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

export default function MemberSelector({
  data,
  values,
  onValueChange
}: {
  data: {
    family: UserResponse[],
    friends: UserResponse[],
  };
  values: number[];
  onValueChange: (val: number[]) => void;
}) {
  const [showMembersList, setShowMembersList] = useState<boolean>(false);
  const { t } = useTranslation()

  const onSelectMember = (member: UserResponse) => {
    if (values.includes(member.id)) {
      onValueChange([...values.filter((i) => member.id != i)]);
    } else {
      onValueChange([...values, member.id]);
    }
  };

  const onCloseMembersList = useCallback(() => {
    setShowMembersList(false);
  }, [setShowMembersList]);

  const selectedMembersList = useCallback(() => {
    return [...data.family, ...data.friends]
      .filter((member) => values.includes(member.id))
      .map((member: any) => {
        return (
          <TransparentView key={member.id} style={{ marginTop: 11 }}>
            <UserWithColor
              name={`${member.first_name} ${member.last_name}`}
              memberColour={member.member_colour}
              userImage={member.presigned_profile_image_url}
            />
          </TransparentView>
        )
      });
  }, [values]);

  const preparedData = useCallback(() => {
    return {
      [t('components.memberSelector.family')]: data.family.map((member: UserResponse) => ({
        ...member,
        selected: values.includes(member.id)
      })),
      [t('components.memberSelector.friends')]: data.friends.map((member: UserResponse) => ({
        ...member,
        selected: values.includes(member.id)
      }))
    }
  }, [values]);

  const sectionSettings = {
    [t('components.memberSelector.family')]: {
      minimisable: false
    },
    [t('components.memberSelector.friends')]: {
      minimisable: true,
      initOpen: false 
    },
  }

  return (
    <TransparentView>
      {selectedMembersList()}
      <Pressable
        onPress={() => setShowMembersList(true)}
        style={styles.addMemberButton}
      >
        <Image
          source={require('assets/images/icons/plus.png')}
          style={styles.addIcon}
        />
        <PrimaryText text="Add new member" />
      </Pressable>
      <ListingModal
        visible={showMembersList}
        onClose={onCloseMembersList}
        data={preparedData()}
        sectionSettings={sectionSettings}
        onSelect={onSelectMember}
        ListItemComponent={ModalListing}
      />
    </TransparentView>
  );
}

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
    justifyContent: 'space-between'
  },
  memberColour: {
    height: 9,
    width: 78,
    marginTop: 5
  }
});
