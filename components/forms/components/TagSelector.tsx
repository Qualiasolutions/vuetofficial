import Checkbox from 'components/molecules/Checkbox';
import { ListingModal } from 'components/molecules/Modals';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery
} from 'reduxStore/services/api/entities';
import { EntityResponseType } from 'types/entities';

const styles = StyleSheet.create({
  membersItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export function ModalListing({
  item
}: {
  item: EntityResponseType & { selected: boolean };
}) {
  return (
    <TransparentView style={styles.membersItem}>
      <TransparentView>
        <Text>{item.name}</Text>
      </TransparentView>
      <Checkbox checked={item.selected} disabled={true} />
    </TransparentView>
  );
}

type ValueType = {
  entities: number[];
};

type Props = {
  value: ValueType;
  onChange: (value: ValueType) => void;
};
export default function TagSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    getUserFullDetails();

  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery(userDetails?.id || -1, {
      skip: !userDetails?.id
    });

  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery(userDetails?.id || -1, {
      skip: !userDetails?.id
    });

  const preparedData = {
    entities: memberEntities
      ? Object.values(memberEntities.byId).map(
          (entity: EntityResponseType) => ({
            ...entity,
            selected: value.entities.includes(entity.id)
          })
        )
      : []
  };

  const isLoading =
    isLoadingUserDetails ||
    isLoadingMemberEntities ||
    isLoadingAllEntities ||
    !allEntities ||
    !memberEntities;

  if (isLoading) {
    return <PaddedSpinner />;
  }

  return (
    <TransparentView>
      <Pressable onPress={() => setOpen(true)}>
        {value.entities.length > 0 ? (
          value.entities.map((entityId) => (
            <Text key={entityId}>{allEntities.byId[entityId].name}</Text>
          ))
        ) : (
          <Text>ADD ENTITIES</Text>
        )}
      </Pressable>
      <ListingModal
        visible={open}
        data={preparedData}
        itemToName={(item) => item.name}
        onClose={() => setOpen(false)}
        onSelect={(selectedEntity) => {
          if (value.entities.includes(selectedEntity.id)) {
            const newEntities = value.entities.filter(
              (id) => id !== selectedEntity.id
            );
            onChange({
              entities: newEntities
            });
          } else {
            onChange({
              entities: [...value.entities, selectedEntity.id]
            });
          }
        }}
        ListItemComponent={ModalListing}
      />
    </TransparentView>
  );
}
