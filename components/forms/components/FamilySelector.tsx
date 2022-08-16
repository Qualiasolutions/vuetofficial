import { ListingModal } from 'components/molecules/Modals';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { UserFullResponse, UserResponse } from 'types/users';
import { Text, View } from 'components/Themed';
import Checkbox from 'components/molecules/Checkbox';

export default function FamilySelector({ data, onValueChange }: any) {
  const [selectedMembers, setSelectedMembers] = useState<UserFullResponse[]>(
    []
  );

  const onSelectMember = (member: UserFullResponse) => {
    if (selectedMembers.some((i) => i.id == member.id)) {
      setSelectedMembers([...selectedMembers.filter((i) => i.id != member.id)]);
      onValueChange([...selectedMembers.filter((i) => i.id != member.id)]);
    } else {
      setSelectedMembers([...selectedMembers, member]);
      onValueChange([...selectedMembers, member]);
    }
  };

  const membersList = () => {
    return data.map((member: any) => (
      <TransparentView
        key={member.id}
        style={styles.memberContainer}
      >
        <Checkbox
          checked={selectedMembers.includes(member)}
          onValueChange={async () => {
            onSelectMember(member)
          }}
          style={styles.checkbox}
        />
        <UserWithColor
          name={`${member.first_name} ${member.last_name}`}
          memberColour={member.member_colour}
          showUserImage={false}
        />
      </TransparentView>
    ));
  }

  return (
    <TransparentView>
      {membersList()}
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    marginRight: 10
  }
});
