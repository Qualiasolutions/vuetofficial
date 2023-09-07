import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import {
  useGetAllDelegatedShoppingListItemsQuery,
  useGetAllStoreDelegationsQuery,
  useUpdateDelegatedShoppingListItemsMutation
} from 'reduxStore/services/api/lists';
import { ShoppingListDelegation } from 'types/lists';
import { Text } from 'components/Themed';
import Checkbox from 'components/molecules/Checkbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  receivedDelegation: {
    marginBottom: 20
  }
});

const ReceivedDelegation = ({
  delegation
}: {
  delegation: ShoppingListDelegation;
}) => {
  const { data: allDelegatedItems } =
    useGetAllDelegatedShoppingListItemsQuery();

  const [updateItem] = useUpdateDelegatedShoppingListItemsMutation();
  const { t } = useTranslation();

  if (!allDelegatedItems) {
    return <PaddedSpinner />;
  }

  const delegationItemIds = allDelegatedItems.byStore[delegation.store].filter(
    (id) => allDelegatedItems.byList[delegation.list].includes(id)
  );

  const delegatedItems = delegationItemIds
    .map((id) => allDelegatedItems.byId[id])
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      return 1;
    });

  return (
    <TransparentView style={styles.receivedDelegation}>
      <Text>{delegation.store_name}</Text>
      <Text>{delegation.list_name}</Text>
      {delegatedItems.map((item) => (
        <Checkbox
          label={item.title}
          key={item.id}
          checked={item.checked}
          onValueChange={async () => {
            try {
              await updateItem({
                checked: !item.checked,
                id: item.id
              }).unwrap();
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
        />
      ))}
    </TransparentView>
  );
};
export default function DelegatedLists() {
  const { data: delegations } = useGetAllStoreDelegationsQuery();
  const { data: userDetails } = useGetUserFullDetails();

  if (!delegations || !userDetails) {
    return <FullPageSpinner />;
  }

  const receivedDelegations = delegations.ids
    .filter((id) => delegations.byId[id].delegatee === userDetails.id)
    .map((id) => delegations.byId[id])
    .sort((delA, delB) => {
      if (`${delA.store} ${delA.list}` < `${delB.store} ${delB.list}`) {
        return -1;
      } else {
        return 1;
      }
    });

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView>
        {receivedDelegations.map((delegation) => (
          <ReceivedDelegation delegation={delegation} key={delegation.id} />
        ))}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}
