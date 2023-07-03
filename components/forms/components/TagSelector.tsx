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
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
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
  requiredTags: {
    PET: boolean;
    TRAVEL: boolean;
  };
  onChange: (tags: string[]) => void;
};

const TagSelector = ({
  selectedEntities,
  value,
  requiredTags,
  onChange
}: TagSelectorProps) => {
  const { t } = useTranslation();

  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery();
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery();

  const { data: allTags, isLoading: isLoadingTags } = useGetAllTagsQuery();

  const isLoading =
    isLoadingMemberEntities ||
    !memberEntities ||
    isLoadingAllEntities ||
    !allEntities ||
    isLoadingTags ||
    !allTags;

  if (isLoading) {
    return null;
  }

  const checkboxOnValueChange = (currentTagName: string) => async () => {
    if (value.includes(currentTagName)) {
      const newValue = value.filter((tagName) => tagName !== currentTagName);
      onChange(newValue);
    } else {
      onChange([...value, currentTagName]);
    }
  };

  return (
    <TransparentView>
      <Text>{t('components.tagSelector.selectedEntities')}:</Text>
      <Text>
        {selectedEntities.map((ent) => allEntities.byId[ent].name).join(', ')}
      </Text>
      {requiredTags.PET && (
        <TransparentView style={styles.requiredTagSection}>
          <Text>{t('components.tagSelector.requiresPetTag')}:</Text>
          {allTags.PETS.map((petTagName) => (
            <TransparentView style={styles.entityCheckboxPair} key={petTagName}>
              <TransparentView style={styles.entityCheckboxLabel}>
                <Text>{t(`tags.${petTagName}`)}</Text>
              </TransparentView>
              <Checkbox
                checked={value.includes(petTagName)}
                onValueChange={checkboxOnValueChange(petTagName)}
              />
            </TransparentView>
          ))}
        </TransparentView>
      )}
      {requiredTags.TRAVEL && (
        <TransparentView style={styles.requiredTagSection}>
          <Text>{t('components.tagSelector.requiresTravelTag')}:</Text>
          {allTags.TRAVEL.map((travelTagName) => (
            <TransparentView
              style={styles.entityCheckboxPair}
              key={travelTagName}
            >
              <TransparentView style={styles.entityCheckboxLabel}>
                <Text>{t(`tags.${travelTagName}`)}</Text>
              </TransparentView>
              <Checkbox
                checked={value.includes(travelTagName)}
                onValueChange={checkboxOnValueChange(travelTagName)}
              />
            </TransparentView>
          ))}
        </TransparentView>
      )}
      <TransparentView style={styles.requiredTagSection}>
        {[
          'TRAVEL__INFORMATION__PUBLIC',
          'TRANSPORT__INFORMATION__PUBLIC',
          'CAREER__INFORMATION__PUBLIC',
          'SOCIAL__INFORMATION__PUBLIC'
        ].map((infoTagName) => (
          <TransparentView style={styles.entityCheckboxPair} key={infoTagName}>
            <TransparentView style={styles.entityCheckboxLabel}>
              <Text>{t(`tags.${infoTagName}`)}</Text>
            </TransparentView>
            <Checkbox
              checked={value.includes(infoTagName)}
              onValueChange={checkboxOnValueChange(infoTagName)}
            />
          </TransparentView>
        ))}
      </TransparentView>
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
    useGetMemberEntitiesQuery(null as any);
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery(null as any);
  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();
  const { data: allTags, isLoading: isLoadingTags } = useGetAllTagsQuery();

  const resetValues = useCallback(() => {
    setSelectedEntities(value.entities);
    setIsSettingTags(false);
  }, [value]);

  useEffect(() => {
    resetValues();
  }, [resetValues, open]);

  const isLoading =
    isLoadingMemberEntities ||
    isLoadingAllEntities ||
    isLoadingCategories ||
    isLoadingTags ||
    !memberEntities ||
    !allEntities ||
    !allTags ||
    !allCategories;

  if (isLoading) {
    return <PaddedSpinner />;
  }

  const petCategoryId = allCategories.byName.PETS.id;
  const requiresPetTag = selectedEntities.some(
    (ent) => allEntities.byId[ent].category === petCategoryId
  );
  const hasPetTag = selectedTags.some((tag) => allTags.PETS.includes(tag));

  const travelCategoryId = allCategories.byName.TRAVEL.id;
  const requiresTravelTag = selectedEntities.some(
    (ent) => allEntities.byId[ent].category === travelCategoryId
  );
  const hasTravelTag = selectedTags.some((tag) => allTags.TRAVEL.includes(tag));

  return (
    <Modal visible={open} onRequestClose={onRequestClose}>
      {isSettingTags ? (
        <TransparentPaddedView>
          <TagSelector
            selectedEntities={selectedEntities}
            onChange={setSelectedTags}
            value={selectedTags}
            requiredTags={{
              PET: requiresPetTag,
              TRAVEL: requiresTravelTag
            }}
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
              onRequestClose();
            }}
            style={styles.button}
            disabled={
              (requiresPetTag && !hasPetTag) ||
              (requiresTravelTag && !hasTravelTag)
            }
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
        {value.entities.length > 0 || value.tags.length > 0 ? (
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
