import MemberSelector, { ModalListing } from 'components/forms/components/MemberSelector';
import { useThemeColor } from 'components/Themed';
import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import { block } from 'react-native-reanimated';
import { useUpdateEntityMutation } from 'reduxStore/services/api/entities';
import { UserFullResponse, UserResponse } from 'types/users';
import MemberCircle from './MemberCircle';
import { ListingModal } from './Modals';

export default function MemberList({ userFullDetails, members, onChange }: {userFullDetails: UserFullResponse, members: UserResponse[], onChange: (members: UserResponse[]) => void}) {

    //ewe pass through the user respons eof the owner which contains the family information
    //we also pass through the list of members associated with the entity
    //we store the members in state 

    const styles = StyleSheet.create({
        container: {
        height: 60,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row' ,
        backgroundColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderColor: '#D9D9D9',
        paddingRight: 30,
        paddingLeft: 30,
        },
        addMemberButton: {

        },
        addIcon: {
            height: 40,
            width: 40,
            marginRight: 12,
        }
    });

    const [showmodal, setshowmodal] = useState<boolean>(false);
    const [selectedMembers, setSelectedMembers] = useState<UserResponse[]>([]);



    const onSelectMember = (member: UserResponse) => {
      if (selectedMembers.some((i) => i.id == member.id)) {
        setSelectedMembers([
          ...selectedMembers.filter((i) => i.id != member.id)
        ]);
        onChange([...selectedMembers.filter((i) => i.id != member.id)]);
      } else {
        setSelectedMembers([...selectedMembers, member]);
        onChange([...selectedMembers, member]);
      }
    }

    const onClose = () => {
        setshowmodal(false);
    }


    const preparedData = useCallback(
        () => {
          return userFullDetails.family.users.map((member: UserResponse) => ({
            ...member,
            selected: selectedMembers.map(m => m.id).includes(member.id)
          }))
        },
        [selectedMembers]
      );


  return (
    <View style={styles.container}>
        <Pressable
            onPress={() => {setshowmodal(true)}}
            style={styles.addMemberButton}
        >
            <Image
                source={require('assets/images/icons/plus.png')}
                style={styles.addIcon}
            />
        </Pressable>
        {
            members.map((member) => {
                return <MemberCircle member={member} />
            })
        }
        <ListingModal
            visible={showmodal}
            onClose={onClose} 
            data={preparedData()}
            onSelect={onSelectMember}
            ListItemComponent={ModalListing}
        />

    </View>
  );
}