import { Button } from 'components/molecules/ButtonComponents';
import Checkbox from 'components/molecules/Checkbox';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useGetAllTagsQuery } from 'reduxStore/services/api/tags';
import { EntityResponseType } from 'types/entities';

const styles = StyleSheet.create({
  entityCheckboxPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  entityCheckboxLabel: {
    marginRight: 10
  },
  buttonWrapper: {
    flexDirection: 'row'
  },
  button: { marginHorizontal: 5 },
  requiredTagSection: { marginVertical: 10 }
});

type ValueType = {
  entities: number[];
  tags: string[];
};

type TagSelectorProps = {
  selectedEntities: number[];
  value: string[];
  onChange: (tags: string[]) => void;
};

const TagSelector = ({
  selectedEntities,
  value,
  onChange
}: TagSelectorProps) => {
  const { t } = useTranslation();

  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery();
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery();
  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();

  const { data: allTags, isLoading: isLoadingTags } = useGetAllTagsQuery();

  const isLoading =
    isLoadingMemberEntities ||
    !memberEntities ||
    isLoadingCategories ||
    !allCategories ||
    isLoadingAllEntities ||
    !allEntities ||
    isLoadingTags ||
    !allTags;

  if (isLoading) {
    return null;
  }

  const petCategoryId = allCategories.byName.PETS.id;
  const requiresPetTag = selectedEntities.some(
    (ent) => memberEntities.byId[ent].category === petCategoryId
  );

  const travelCategoryId = allCategories.byName.TRAVEL.id;
  const requiresTravelTag = selectedEntities.some(
    (ent) => memberEntities.byId[ent].category === travelCategoryId
  );

  return (
    <TransparentView>
      <Text>{t('components.tagSelector.selectedEntities')}:</Text>
      <Text>
        {selectedEntities.map((ent) => allEntities.byId[ent].name).join(', ')}
      </Text>
      {requiresPetTag && (
        <TransparentView style={styles.requiredTagSection}>
          <Text>{t('components.tagSelector.requiresPetTag')}:</Text>
          {allTags.PETS.map((petTagName) => (
            <TransparentView style={styles.entityCheckboxPair} key={petTagName}>
              <TransparentView style={styles.entityCheckboxLabel}>
                <Text>{t(`tags.${petTagName}`)}</Text>
              </TransparentView>
              <Checkbox
                checked={value.includes(petTagName)}
                onValueChange={async () => {
                  if (value.includes(petTagName)) {
                    const newValue = value.filter(
                      (tagName) => tagName !== petTagName
                    );
                    onChange(newValue);
                  } else {
                    onChange([...value, petTagName]);
                  }
                }}
              />
            </TransparentView>
          ))}
        </TransparentView>
      )}
      {requiresTravelTag && (
        <TransparentView style={styles.requiredTagSection}>
          <Text>{t('components.tagSelector.requiresTravelTag')}:</Text>
          {allTags.TRAVEL.map((petTagName) => (
            <TransparentView style={styles.entityCheckboxPair} key={petTagName}>
              <TransparentView style={styles.entityCheckboxLabel}>
                <Text>{t(`tags.${petTagName}`)}</Text>
              </TransparentView>
              <Checkbox
                checked={value.includes(petTagName)}
                onValueChange={async () => {
                  if (value.includes(petTagName)) {
                    const newValue = value.filter(
                      (tagName) => tagName !== petTagName
                    );
                    onChange(newValue);
                  } else {
                    onChange([...value, petTagName]);
                  }
                }}
              />
            </TransparentView>
          ))}
        </TransparentView>
      )}
    </TransparentView>
  );
};

type EntityAndTagSelectorModalProps = {
  open: boolean;
  value: ValueType;
  onChange: (newValue: ValueType) => void;
  onRequestClose: () => void;
};

const EntityAndTagSelectorModal = ({
  open,
  value,
  onChange,
  onRequestClose
}: EntityAndTagSelectorModalProps) => {
  const [isSettingTags, setIsSettingTags] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState(value.entities);
  const [selectedTags, setSelectedTags] = useState(value.tags);
  const { t } = useTranslation();
  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery();

  const isLoading = isLoadingMemberEntities || !memberEntities;

  if (isLoading) {
    return <PaddedSpinner />;
  }

  return (
    <Modal visible={open} onRequestClose={onRequestClose}>
      {isSettingTags ? (
        <TransparentPaddedView>
          <TagSelector
            selectedEntities={selectedEntities}
            onChange={setSelectedTags}
            value={selectedTags}
          />
        </TransparentPaddedView>
      ) : (
        <TransparentScrollView>
          {Object.values(memberEntities.byId).map(
            (entity: EntityResponseType) => (
              <TransparentView
                style={styles.entityCheckboxPair}
                key={entity.id}
              >
                <TransparentView style={styles.entityCheckboxLabel}>
                  <Text>{entity.name}</Text>
                </TransparentView>
                <Checkbox
                  checked={selectedEntities.includes(entity.id)}
                  onValueChange={async () => {
                    if (selectedEntities.includes(entity.id)) {
                      const newEntities = selectedEntities.filter(
                        (id) => id !== entity.id
                      );
                      setSelectedEntities(newEntities);
                    } else {
                      setSelectedEntities([...selectedEntities, entity.id]);
                    }
                  }}
                />
              </TransparentView>
            )
          )}
        </TransparentScrollView>
      )}
      {isSettingTags ? (
        <TransparentView style={styles.buttonWrapper}>
          <Button
            title={t('common.back')}
            onPress={() => setIsSettingTags(false)}
            style={styles.button}
          />
          <Button
            title={t('common.finish')}
            onPress={() => {
              onChange({
                entities: selectedEntities,
                tags: selectedTags
              });
            }}
            style={styles.button}
          />
        </TransparentView>
      ) : (
        <TransparentView style={styles.buttonWrapper}>
          <Button
            title={t('common.next')}
            onPress={() => setIsSettingTags(true)}
            style={styles.button}
          />
        </TransparentView>
      )}
    </Modal>
  );
};

type Props = {
  value: ValueType;
  onChange: (value: ValueType) => void;
};
export default function EntityAndTagSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery();

  const isLoading = isLoadingAllEntities || !allEntities;

  if (isLoading) {
    return <PaddedSpinner />;
  }

  return (
    <TransparentView>
      <SafePressable onPress={() => setOpen(true)}>
        {value.entities.length > 0 ? (
          <TransparentView>
            {value.entities.map((entityId) => (
              <Text key={entityId}>{allEntities.byId[entityId].name}</Text>
            ))}
            {value.tags.map((tagName) => (
              <Text key={tagName}>{t(`tags.${tagName}`)}</Text>
            ))}
          </TransparentView>
        ) : (
          <Text>ADD ENTITIES</Text>
        )}
      </SafePressable>
      <EntityAndTagSelectorModal
        open={open}
        onRequestClose={() => setOpen(false)}
        value={value}
        onChange={onChange}
      />
    </TransparentView>
  );
}
