import getUserFullDetails from 'hooks/useGetUserDetails';
import { StyleSheet } from 'react-native';
import Checkbox from './Checkbox';
import { PaddedSpinner } from './Spinners';
import UserWithColor from './UserWithColor';
import { TransparentView } from './ViewComponents';

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5
  },
  checkbox: { marginLeft: 20 }
});

export default function UserCheckboxes({
  value,
  onToggleUser
}: {
  value: number[];
  onToggleUser: (value: number) => void;
}) {
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    getUserFullDetails();
  if (isLoadingUserDetails || !userDetails) {
    return <PaddedSpinner />;
  }

  return (
    <TransparentView>
      {userDetails.family.users.map((user) => {
        return (
          <TransparentView style={styles.itemWrapper} key={user.id}>
            <UserWithColor
              name={`${user.first_name} ${user.last_name}`}
              memberColour={user.member_colour}
              userImage={user.presigned_profile_image_url}
              showUserImage={true}
            />
            <Checkbox
              checked={value && value.includes(user.id)}
              style={styles.checkbox}
              onValueChange={async () => onToggleUser(user.id)}
            />
          </TransparentView>
        );
      })}
    </TransparentView>
  );
}
