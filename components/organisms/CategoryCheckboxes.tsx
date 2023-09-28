import Checkbox from 'components/molecules/Checkbox';
import SafePressable from 'components/molecules/SafePressable';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 3
  }
});
export default function CategoryCheckboxes({
  value,
  onChange
}: {
  value: number[];
  onChange: (newValue: number[]) => void;
}) {
  const { t } = useTranslation();
  const { data: allCategories } = useGetAllCategoriesQuery();

  if (!allCategories) {
    return null;
  }

  return (
    <>
      <SafePressable
        style={styles.listItem}
        onPress={() => {
          onChange(allCategories.ids);
        }}
      >
        <Text bold={true}>{t(`common.selectAll`)}</Text>
        <Checkbox
          checked={value.length === allCategories?.ids.length}
          disabled={true}
        />
      </SafePressable>
      {allCategories?.ids.map((id) => (
        <SafePressable
          key={id}
          style={styles.listItem}
          onPress={() => {
            if (value.includes(id)) {
              onChange(value.filter((categoryId) => categoryId !== id));
            } else {
              onChange([...value, id]);
            }
          }}
        >
          <Text>{t(`categories.${allCategories.byId[id].name}`)}</Text>
          <Checkbox checked={value.includes(id)} disabled={true} />
        </SafePressable>
      ))}
    </>
  );
}
