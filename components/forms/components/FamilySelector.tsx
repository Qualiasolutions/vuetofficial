import { TransparentView } from 'components/molecules/ViewComponents';
import UserWithColor from 'components/molecules/UserWithColor';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { UserFullResponse } from 'types/users';
import Checkbox from 'components/molecules/Checkbox';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';

export default function FamilySelector({ data, onValueChange }: {
  data: UserFullResponse[],
  onValueChange: (val: UserFullResponse[]) => void
}) {
  const [selectedMembers, setSelectedMembers] = useState<UserFullResponse[]>(
    []
  );

  const { t } = useTranslation()

  const onSelectMember = (member: UserFullResponse) => {
    if (selectedMembers.some((i) => i.id == member.id)) {
      setSelectedMembers([...selectedMembers.filter((i) => i.id != member.id)]);
      onValueChange([...selectedMembers.filter((i) => i.id != member.id)]);
    } else {
      setSelectedMembers([...selectedMembers, member]);
      onValueChange([...selectedMembers, member]);
    }
  };

  const selectAllButton = <TransparentView style={styles.memberContainer}>
    <Checkbox
      checked={data.length === selectedMembers.length}
      onValueChange={async () => {
        if (selectedMembers.length === data.length) {
          setSelectedMembers([])
        } else {
          setSelectedMembers(data)
        }
      }}
      style={styles.checkbox}
    />
    <AlmostBlackText text={t('common.selectAll')} style={styles.selectAllText} />
  </TransparentView>

  const membersList = () => {
    return data.map((member: any) => (
      <TransparentView key={member.id} style={styles.memberContainer}>
        <Checkbox
          checked={selectedMembers.includes(member)}
          onValueChange={async () => {
            onSelectMember(member);
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
  };

  return <TransparentView>
    {selectAllButton}
    {membersList()}
  </TransparentView>;
}

const styles = StyleSheet.create({
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    marginRight: 10
  },
  selectAllText: {
    fontSize: 18
  }
});
