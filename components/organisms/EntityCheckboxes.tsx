import Checkbox from 'components/molecules/Checkbox';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useGetAllTagsQuery } from 'reduxStore/services/api/tags';
import { CategoryName } from 'types/categories';

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
  categoryTitle: { fontSize: 22 },
  categoryCheckboxes: { marginBottom: 20 }
});

export default function EntityCheckboxes({
  value,
  setSelectedEntities,
  setSelectedTags
}: {
  value: {
    entities: number[];
    tags: string[];
  };
  setSelectedEntities: (entities: number[]) => void;
  setSelectedTags: (tags: string[]) => void;
}) {
  const { t } = useTranslation();
  const { data: memberEntities, isLoading: isLoadingMemberEntities } =
    useGetMemberEntitiesQuery(null as any);
  const { data: allEntities, isLoading: isLoadingAllEntities } =
    useGetAllEntitiesQuery(null as any);
  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();
  const { data: allTags, isLoading: isLoadingTags } = useGetAllTagsQuery();

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

  const infoCategoryTags: { [key in CategoryName]?: string } = {
    TRAVEL: 'TRAVEL__INFORMATION__PUBLIC',
    TRANSPORT: 'TRANSPORT__INFORMATION__PUBLIC',
    CAREER: 'CAREER__INFORMATION__PUBLIC',
    SOCIAL_INTERESTS: 'SOCIAL__INFORMATION__PUBLIC'
  };

  const infoCategoryIds = Object.keys(infoCategoryTags).map(
    (categoryName) => allCategories.byName[categoryName].id
  );

  return (
    <>
      {Array(
        ...new Set([
          ...Object.keys(memberEntities.byCategory).map((key) => parseInt(key)),
          ...infoCategoryIds
        ])
      ).map((categoryId) => {
        const category = allCategories.byId[categoryId];
        const entityIds = memberEntities.byCategory[category.id];
        const infoTag = infoCategoryTags[category.name];
        if (!entityIds && !infoTag) {
          return null;
        }

        const entityCheckboxes = (entityIds || []).map((entityId: number) => {
          const entity = memberEntities.byId[entityId];
          return (
            <TransparentView style={styles.entityCheckboxPair} key={entity.id}>
              <TransparentView style={styles.entityCheckboxLabel}>
                <Text>{entity.name}</Text>
              </TransparentView>
              <Checkbox
                checked={value.entities.includes(entity.id)}
                onValueChange={async () => {
                  if (value.entities.includes(entity.id)) {
                    const newEntities = value.entities.filter(
                      (id) => id !== entity.id
                    );
                    setSelectedEntities(newEntities);
                  } else {
                    setSelectedEntities([...value.entities, entity.id]);
                  }
                }}
              />
            </TransparentView>
          );
        });

        const tagCheckbox = infoTag ? (
          <TransparentView style={styles.entityCheckboxPair} key={infoTag}>
            <TransparentView style={styles.entityCheckboxLabel}>
              <Text>{t(`tags.${infoTag}`)}</Text>
            </TransparentView>
            <Checkbox
              checked={value.tags.includes(infoTag)}
              onValueChange={async () => {
                if (value.tags.includes(infoTag)) {
                  const newTags = value.tags.filter((tag) => tag !== infoTag);
                  setSelectedTags(newTags);
                } else {
                  setSelectedTags([...value.tags, infoTag]);
                }
              }}
            />
          </TransparentView>
        ) : null;

        return (
          <TransparentView key={categoryId}>
            <Text style={styles.categoryTitle}>
              {t(`categories.${category.name}`)}
            </Text>
            <TransparentView style={styles.categoryCheckboxes}>
              {entityCheckboxes}
              {tagCheckbox}
            </TransparentView>
          </TransparentView>
        );
      })}
    </>
  );
}
