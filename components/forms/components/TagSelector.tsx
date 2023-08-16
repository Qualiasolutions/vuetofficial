import { Button } from 'components/molecules/ButtonComponents';
import Checkbox from 'components/molecules/Checkbox';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentView } from 'components/molecules/ViewComponents';
import EntityCheckboxes from 'components/organisms/EntityCheckboxes';
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
import { CategoryName } from 'types/categories';
import { EntityTypeName } from 'types/entities';

const styles = StyleSheet.create({
  checkboxContainer: { flexGrow: 0 },
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
  requiredTagSection: { marginVertical: 10 },
  selectedEntitiesSummary: { marginBottom: 10 }
});

type ValueType = {
  entities: number[];
  tags: string[];
};

type TagSelectorProps = {
  selectedEntities: number[];
  selectedTags: string[];
  value: string[];
  requiredTags: {
    PET: boolean;
  };
  requiredEntityTypes: {
    name: string;
    resourceTypes: EntityTypeName[];
  }[];
  permittedEntityTypes: {
    name: string;
    resourceTypes: EntityTypeName[];
  }[];
  onChange: (tags: string[]) => void;
  onChangeEntities: (entities: number[]) => void;
};

const StepTwoSelector = ({
  selectedEntities,
  selectedTags,
  requiredTags,
  requiredEntityTypes,
  permittedEntityTypes,
  onChange,
  onChangeEntities
}: TagSelectorProps) => {
  const { t } = useTranslation();

  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery(null as any);
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery();

  const { data: allTags, isLoading: isLoadingTags } = useGetAllTagsQuery(
    null as any
  );

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
    if (selectedTags.includes(currentTagName)) {
      const newValue = selectedTags.filter(
        (tagName) => tagName !== currentTagName
      );
      onChange(newValue);
    } else {
      onChange([...selectedTags, currentTagName]);
    }
  };

  const entityCheckboxOnChange = (currentEntityId: number) => async () => {
    if (selectedEntities.includes(currentEntityId)) {
      const newValue = selectedEntities.filter(
        (tagName) => tagName !== currentEntityId
      );
      onChangeEntities(newValue);
    } else {
      onChangeEntities([...selectedEntities, currentEntityId]);
    }
  };

  return (
    <TransparentView>
      {selectedEntities.length > 0 && (
        <TransparentView style={styles.selectedEntitiesSummary}>
          <Text bold={true}>
            {t('components.tagSelector.selectedEntities')}:
          </Text>
          <Text>
            {selectedEntities
              .filter((ent) => allEntities.byId[ent])
              .map((ent) => allEntities.byId[ent].name)
              .join(', ')}
          </Text>
        </TransparentView>
      )}
      {selectedTags.length > 0 && (
        <TransparentView style={styles.selectedEntitiesSummary}>
          <Text bold={true}>{t('components.tagSelector.selectedTags')}:</Text>
          <Text>{selectedTags.map((tag) => t(`tags.${tag}`)).join(', ')}</Text>
        </TransparentView>
      )}

      {requiredTags.PET && (
        <TransparentView style={styles.requiredTagSection}>
          <Text>{t('components.tagSelector.requiresPetTag')}:</Text>
          {allTags.PETS &&
            allTags.PETS.map((petTagName) => (
              <TransparentView
                style={styles.entityCheckboxPair}
                key={petTagName}
              >
                <TransparentView style={styles.entityCheckboxLabel}>
                  <Text>{t(`tags.${petTagName}`)}</Text>
                </TransparentView>
                <Checkbox
                  checked={selectedTags.includes(petTagName)}
                  onValueChange={checkboxOnValueChange(petTagName)}
                />
              </TransparentView>
            ))}
        </TransparentView>
      )}
      {[
        ...requiredEntityTypes.map((opts) => ({ ...opts, type: 'REQUIRED' })),
        ...permittedEntityTypes.map((opts) => ({ ...opts, type: 'PERMITTED' }))
      ].map(({ name, resourceTypes, type }) => {
        const matchingEntities = Object.values(memberEntities.byId).filter(
          (entity) => resourceTypes.includes(entity.resourcetype)
        );
        return (
          <TransparentView style={styles.requiredTagSection} key={name}>
            <Text>
              {type === 'REQUIRED'
                ? t('components.tagSelector.requiresTag', {
                    requirementName: name
                  })
                : t('components.tagSelector.allowedTag', {
                    requirementName: name
                  })}
              :
            </Text>
            {matchingEntities.length > 0 ? (
              matchingEntities.map((entity) => (
                <TransparentView
                  style={styles.entityCheckboxPair}
                  key={entity.id}
                >
                  <TransparentView style={styles.entityCheckboxLabel}>
                    <Text>{entity.name}</Text>
                  </TransparentView>
                  <Checkbox
                    checked={selectedEntities.includes(entity.id)}
                    onValueChange={entityCheckboxOnChange(entity.id)}
                  />
                </TransparentView>
              ))
            ) : (
              <Text bold={true}>
                {t('components.tagSelector.noEntities', {
                  entityType: name
                })}
              </Text>
            )}
          </TransparentView>
        );
      })}
    </TransparentView>
  );
};

type EntityAndTagSelectorModalProps = {
  open: boolean;
  value: ValueType;
  onChange: (newValue: ValueType) => void;
  onRequestClose: () => void;
  extraTagOptions?: {
    [key in CategoryName]?: { value: string; label: string }[];
  };
};

const EntityAndTagSelectorModal = ({
  open,
  value,
  onChange,
  onRequestClose,
  extraTagOptions
}: EntityAndTagSelectorModalProps) => {
  const [isStepTwo, setIsStepTwo] = useState(false);
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

  useEffect(() => {
    setSelectedEntities(value.entities);
    setSelectedTags(value.tags);
  }, [value]);

  const resetValues = useCallback(() => {
    setSelectedEntities(value.entities);
    setIsStepTwo(false);
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
    (ent) =>
      allEntities.byId[ent] && allEntities.byId[ent].category === petCategoryId
  );
  const hasPetTag = selectedTags.some((tag) => allTags.PETS?.includes(tag));

  const requiresAppointmentTag = selectedEntities.some(
    (ent) =>
      allEntities.byId[ent] && allEntities.byId[ent].resourcetype === 'Patient'
  );
  // const requiresPatientTag = selectedEntities.some(
  //   (ent) =>
  //     allEntities.byId[ent] &&
  //     allEntities.byId[ent].resourcetype === 'Appointment'
  // );
  // const requiresStudentTag = selectedEntities.some(
  //   (ent) =>
  //     allEntities.byId[ent] &&
  //     ['School', 'AcademicPlan', 'ExtracurricularPlan'].includes(
  //       allEntities.byId[ent].resourcetype
  //     )
  // );
  const requiresMatchingStudentTag = selectedEntities.some(
    (ent) =>
      allEntities.byId[ent] &&
      ['Student'].includes(allEntities.byId[ent].resourcetype)
  );

  // const requiresEmployeeTag = selectedEntities.some(
  //   (ent) =>
  //     allEntities.byId[ent] &&
  //     ['DaysOff', 'CareerGoal'].includes(allEntities.byId[ent].resourcetype)
  // );
  const allowedMatchingEmployeeTag = selectedEntities.some(
    (ent) =>
      allEntities.byId[ent] &&
      ['Employee'].includes(allEntities.byId[ent].resourcetype)
  );

  const requiredEntityTypes: {
    name: string;
    resourceTypes: EntityTypeName[];
  }[] = [];
  if (requiresAppointmentTag) {
    requiredEntityTypes.push({
      name: 'Appointment or Health Goal',
      resourceTypes: ['Appointment', 'HealthGoal']
    });
  }
  // if (requiresPatientTag) {
  //   requiredEntityTypes.push({
  //     name: 'Patient',
  //     resourceTypes: ['Patient']
  //   });
  // }
  // if (requiresStudentTag) {
  //   requiredEntityTypes.push({
  //     name: 'Student',
  //     resourceTypes: ['Student']
  //   });
  // }
  if (requiresMatchingStudentTag) {
    requiredEntityTypes.push({
      name: 'School, Extracurricular or Academic Plan',
      resourceTypes: ['School', 'ExtracurricularPlan', 'AcademicPlan']
    });
  }
  // if (requiresEmployeeTag) {
  //   requiredEntityTypes.push({
  //     name: 'Employee',
  //     resourceTypes: ['Employee']
  //   });
  // }

  const permittedEntityTypes: {
    name: string;
    resourceTypes: EntityTypeName[];
  }[] = [];
  if (allowedMatchingEmployeeTag) {
    permittedEntityTypes.push({
      name: 'Days off or Career goal',
      resourceTypes: ['DaysOff', 'CareerGoal']
    });
  }

  let hasRequiredEntityTags = true;
  for (const requiredType of requiredEntityTypes) {
    if (
      !selectedEntities.some(
        (ent) =>
          allEntities.byId[ent] &&
          requiredType.resourceTypes.includes(
            allEntities.byId[ent].resourcetype
          )
      )
    ) {
      hasRequiredEntityTags = false;
      break;
    }
  }

  return (
    <Modal visible={open} onRequestClose={onRequestClose}>
      {isStepTwo ? (
        <TransparentScrollView style={styles.checkboxContainer}>
          <StepTwoSelector
            selectedEntities={selectedEntities}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
            onChangeEntities={setSelectedEntities}
            value={selectedTags}
            requiredTags={{
              PET: requiresPetTag
            }}
            requiredEntityTypes={requiredEntityTypes}
            permittedEntityTypes={permittedEntityTypes}
          />
        </TransparentScrollView>
      ) : (
        <TransparentScrollView style={styles.checkboxContainer}>
          <EntityCheckboxes
            value={{
              entities: selectedEntities,
              tags: selectedTags
            }}
            setSelectedEntities={setSelectedEntities}
            setSelectedTags={setSelectedTags}
            extraTagOptions={extraTagOptions}
          />
        </TransparentScrollView>
      )}
      {isStepTwo ? (
        <TransparentView style={styles.buttonWrapper}>
          <Button
            title={t('common.back')}
            onPress={() => setIsStepTwo(false)}
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
            disabled={(requiresPetTag && !hasPetTag) || !hasRequiredEntityTags}
          />
        </TransparentView>
      ) : (
        <TransparentView style={styles.buttonWrapper}>
          <Button
            title={t('common.next')}
            onPress={() => setIsStepTwo(true)}
            style={styles.button}
            disabled={
              !(selectedEntities && selectedEntities.length > 0) &&
              !(selectedTags && selectedTags.length > 0)
            }
          />
        </TransparentView>
      )}
    </Modal>
  );
};

type Props = {
  value: ValueType;
  onChange: (value: ValueType) => void;
  extraTagOptions?: {
    [key in CategoryName]?: { value: string; label: string }[];
  };
};
export default function EntityAndTagSelector({
  value,
  onChange,
  extraTagOptions
}: Props) {
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
        {(value.entities && value.entities.length > 0) ||
        (value.tags && value.tags.length > 0) ? (
          <TransparentView>
            {value.entities.map((entityId) =>
              allEntities.byId[entityId] ? (
                <Text key={entityId}>{allEntities.byId[entityId].name}</Text>
              ) : null
            )}
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
        extraTagOptions={extraTagOptions}
      />
    </TransparentView>
  );
}
