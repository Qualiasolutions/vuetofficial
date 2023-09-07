import { Text } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import {
  useCreateStoreDelegationsMutation,
  useDeleteStoreDelegationMutation,
  useGetAllShoppingListsQuery,
  useGetAllStoreDelegationsQuery
} from 'reduxStore/services/api/lists';
import { selectListsForStoreId } from 'reduxStore/slices/lists/selectors';
import { ShoppingListDelegation } from 'types/lists';
import { SmallButton } from './ButtonComponents';
import { Modal } from './Modals';
import UserWithColor from './UserWithColor';
import { TransparentView } from './ViewComponents';
import { UserResponse } from 'types/users';
import DropDown from 'components/forms/components/DropDown';
import { TouchableOpacity } from './TouchableOpacityComponents';
import { Feather } from '@expo/vector-icons';
import { PaddedSpinner } from './Spinners';

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row'
  },
  memberSelector: {
    marginBottom: 20
  },
  listCheckboxes: {
    marginBottom: 20
  },
  dropdownContainer: { maxWidth: 150 },
  familyMemberDelegations: {
    marginBottom: 20
  },
  listedDelegationWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userWithColourWrapper: {
    marginBottom: 5
  }
});

const ListedDelegation = ({
  delegation
}: {
  delegation: ShoppingListDelegation;
}) => {
  const { data: userDetails } = useGetUserFullDetails();
  const [deleteDelegation] = useDeleteStoreDelegationMutation();

  if (!userDetails) {
    return null;
  }
  return (
    <TransparentView style={styles.listedDelegationWrapper}>
      <Text>{delegation.list_name}</Text>
      <TouchableOpacity
        onPress={() => {
          deleteDelegation(delegation.id);
        }}
      >
        <Feather name="x" color="red" size={24} />
      </TouchableOpacity>
    </TransparentView>
  );
};

const FamilyMemberDelegations = ({
  user,
  storeId
}: {
  user: UserResponse;
  storeId: number;
}) => {
  const { data: delegations } = useGetAllStoreDelegationsQuery();
  const { data: shoppingLists } = useGetAllShoppingListsQuery();
  const [createDelegations, createDelegationsResult] =
    useCreateStoreDelegationsMutation();
  const storeLists = useSelector(selectListsForStoreId(storeId));
  const { data: userDetails } = useGetUserFullDetails();
  const { t } = useTranslation();

  if (!delegations || !shoppingLists || !userDetails) {
    return null;
  }

  const userDelegations = delegations.ids
    .filter((id) => delegations.byId[id].delegatee === user.id)
    .map((id) => delegations.byId[id])
    .filter((delegation) => delegation.store === storeId);

  const assignedLists = userDelegations.map((delegation) => delegation.list);
  const unassignedLists = storeLists.filter(
    (id) => !assignedLists.includes(id)
  );
  const dropdownOptions = unassignedLists.map((listId) => {
    const list = shoppingLists.byId[listId];
    return {
      label: list.name,
      value: list.id
    };
  });
  return (
    <TransparentView style={styles.familyMemberDelegations}>
      <TransparentView style={styles.userWithColourWrapper}>
        <UserWithColor
          name={`${user.first_name} ${user.last_name}`}
          memberColour={user.member_colour}
          showUserImage={false}
        />
      </TransparentView>
      {userDelegations.map((delegation) => (
        <ListedDelegation delegation={delegation} key={delegation.id} />
      ))}
      {createDelegationsResult.isLoading ? (
        <PaddedSpinner />
      ) : (
        <DropDown
          items={dropdownOptions}
          value={''}
          setFormValues={(val) => {
            createDelegations([
              {
                store: storeId,
                list: val,
                delegatee: user.id,
                delegator: userDetails.id
              }
            ]);
          }}
          containerStyle={styles.dropdownContainer}
          dropdownPlaceholder={t(
            'components.shoppingLists.delegationButton.delegate'
          )}
          listMode={'MODAL'}
        />
      )}
    </TransparentView>
  );
};

export default function StoreDelegationButton({
  storeId,
  style
}: {
  storeId: number;
  style?: ViewStyle;
}) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserFullDetails();

  if (!userDetails) {
    return null;
  }

  return (
    <TransparentView style={style || {}}>
      <TransparentView style={styles.buttonWrapper}>
        <SmallButton
          title={t('components.shoppingLists.delegationButton.delegations')}
          onPress={() => setShowModal(true)}
        />
      </TransparentView>
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)}>
        {userDetails.family.users
          .filter((user) => user.id !== userDetails.id)
          .map((user) => (
            <FamilyMemberDelegations
              user={user}
              storeId={storeId}
              key={user.id}
            />
          ))}
      </Modal>
    </TransparentView>
  );
}
