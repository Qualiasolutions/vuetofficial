import { ListingModal } from 'components/molecules/Modals';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { UserFullResponse } from 'types/users';

export default function MemberSelector({ data, onValueChange }: any) {
  const [showMembersList, setShowMembersList] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<UserFullResponse[]>([]);

  const onSelectMember = useCallback(
    (member) => {
      if (selectedMembers.some((i) => i.id == member.id)) {
        setSelectedMembers([
          ...selectedMembers.filter((i) => i.id != member.id)
        ]);
        onValueChange([...selectedMembers.filter((i) => i.id != member.id)]);
      } else {
        setSelectedMembers([...selectedMembers, member]);
        onValueChange([...selectedMembers, member]);
      }
    },
    [setSelectedMembers, selectedMembers]
  );

  const onCloseMembersList = useCallback(() => {
    setShowMembersList(false);
  }, [setShowMembersList]);

  const selectedMembersList = useCallback(() => {
    return selectedMembers.map((member: any) => (
      <TransparentView key={member.id} style={{ marginLeft: 70, marginTop: 11 }}>
        <UserWithColor name={`${member.first_name} ${member.last_name}`} memberColour={member.member_colour} />
      </TransparentView>
    ));
  }, [selectedMembers]);

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
        data={data}
        onSelect={onSelectMember}
        type="members"
        selectedMembers={selectedMembers}
        translate={false}
      />
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginLeft: 70
  },
  addIcon: {
    height: 27,
    width: 27,
    marginRight: 12
  }
});
