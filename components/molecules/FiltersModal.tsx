import { Feather } from '@expo/vector-icons';
import { Button } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import UserCheckboxes from 'components/molecules/UserCheckboxes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredCategories,
  setFilteredUsers
} from 'reduxStore/slices/calendars/actions';
import {
  selectFilteredCategories,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import CategoryCheckboxes from 'components/organisms/CategoryCheckboxes';

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    maxHeight: '100%'
  },
  entitiesSelector: { flexShrink: 1, overflow: 'hidden' },
  checkboxContainer: { height: '100%', flexShrink: 1 },
  filterTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userFiltersTitle: { fontSize: 20, margin: 10 },
  userFiltersApplyButton: { marginTop: 10 },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  filtersButton: { alignItems: 'center' },
  filtersButtonText: { fontSize: 11 }
});

const UserFilterSelector = ({ onApply }: { onApply: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filteredUsers = useSelector(selectFilteredUsers);
  const [newFilteredUsers, setNewFilteredUsers] = useState<number[]>(
    filteredUsers || []
  );

  const setFilteredUserIds = (users: number[]) => {
    dispatch(setFilteredUsers({ users }));
  };

  return (
    <TransparentView>
      <UserCheckboxes
        value={newFilteredUsers}
        onToggleUser={(userId) => {
          if (newFilteredUsers.includes(userId)) {
            setNewFilteredUsers(newFilteredUsers.filter((id) => id !== userId));
          } else {
            setNewFilteredUsers([...newFilteredUsers, userId]);
          }
        }}
      />
      <TransparentView style={styles.buttonWrapper}>
        <Button
          title={t('common.apply')}
          onPress={() => {
            setFilteredUserIds(newFilteredUsers);
            onApply();
          }}
          style={styles.userFiltersApplyButton}
        />
      </TransparentView>
    </TransparentView>
  );
};

const CategoryFilterSelector = ({ onApply }: { onApply: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filteredCategories = useSelector(selectFilteredCategories);
  const [newFilteredCategories, setNewFilteredCategories] = useState<number[]>([
    ...(filteredCategories || [])
  ]);

  const setFilteredCategoryIds = (categories: number[]) => {
    dispatch(setFilteredCategories({ categories }));
  };

  return (
    <TransparentView style={styles.checkboxContainer}>
      <TransparentScrollView>
        <CategoryCheckboxes
          value={newFilteredCategories}
          onChange={setNewFilteredCategories}
        />
      </TransparentScrollView>
      <TransparentView style={styles.buttonWrapper}>
        <Button
          title={t('common.apply')}
          onPress={() => {
            setFilteredCategoryIds(newFilteredCategories);
            onApply();
          }}
          style={styles.userFiltersApplyButton}
        />
      </TransparentView>
    </TransparentView>
  );
};

export default function FiltersModal({
  visible,
  onRequestClose
}: {
  visible: boolean;
  onRequestClose: () => void;
}) {
  const { t } = useTranslation();
  const filteredUsers = useSelector(selectFilteredUsers);
  const filteredCategories = useSelector(selectFilteredCategories);

  const [shownFilters, setShownFilters] = useState<
    '' | 'USERS' | 'ENTITIES' | 'CATEGORIES'
  >('');
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      boxStyle={styles.modal}
    >
      <TransparentView>
        <SafePressable
          onPress={() =>
            setShownFilters(shownFilters === 'USERS' ? '' : 'USERS')
          }
          style={styles.filterTypeHeader}
        >
          <Text style={styles.userFiltersTitle}>
            {t('filters.userFilters')}
            {filteredUsers?.length && filteredUsers.length > 0
              ? ` (${filteredUsers.length})`
              : ''}
          </Text>
          <Feather
            name={shownFilters === 'USERS' ? 'chevron-up' : 'chevron-down'}
            size={25}
          />
        </SafePressable>
        {shownFilters === 'USERS' && (
          <UserFilterSelector
            onApply={() => {
              setShownFilters('');
              onRequestClose();
            }}
          />
        )}
      </TransparentView>
      <TransparentView style={styles.entitiesSelector}>
        <SafePressable onPress={() => setShownFilters('CATEGORIES')}>
          <SafePressable
            onPress={() =>
              setShownFilters(shownFilters === 'CATEGORIES' ? '' : 'CATEGORIES')
            }
            style={styles.filterTypeHeader}
          >
            <Text style={styles.userFiltersTitle}>
              {t('filters.categoryFilters')}
              {filteredCategories && filteredCategories.length > 0
                ? ` (${filteredCategories.length})`
                : ''}
            </Text>
            <Feather
              name={
                shownFilters === 'CATEGORIES' ? 'chevron-up' : 'chevron-down'
              }
              size={25}
            />
          </SafePressable>
        </SafePressable>
        {shownFilters === 'CATEGORIES' && (
          <CategoryFilterSelector
            onApply={() => {
              setShownFilters('');
              onRequestClose();
            }}
          />
        )}
      </TransparentView>
    </Modal>
  );
}
