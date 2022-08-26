import { ListingModal } from 'components/molecules/Modals';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { UserFullResponse, UserResponse } from 'types/users';
import { Text, View } from 'components/Themed';
import Checkbox from 'components/molecules/Checkbox';

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
  data: any[];
  values: number[];
  onValueChange: (val: number[]) => void;
}) {
  const [showMembersList, setShowMembersList] = useState<boolean>(false);

  const onSelectMember = (member: UserFullResponse) => {
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
    console.log(data[0].presigned_profile_image_url);
    console.log(data[1].presigned_profile_image_url);
    return data
      .filter((member) => values.includes(member.id))
      .map((member: any) => (
        <TransparentView key={member.id} style={{ marginTop: 11 }}>
          <UserWithColor
            name={`${member.first_name} ${member.last_name}`}
            memberColour={member.member_colour}
            userImage={member.presigned_profile_image_url}
          />
        </TransparentView>
      ));
  }, [values]);

  const preparedData = useCallback(() => {
    return data.map((member: UserFullResponse) => ({
      ...member,
      selected: values.includes(member.id)
    }));
  }, [values]);

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
