import { Feather } from '@expo/vector-icons';
import EntityAndTagSelector from 'components/forms/components/TagSelector';
import { Button, LinkButton } from 'components/molecules/ButtonComponents';
import { Image } from 'components/molecules/ImageComponents';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { PaddedSpinner } from 'components/molecules/Spinners';
import UserCheckboxes from 'components/molecules/UserCheckboxes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredEntities,
  setFilteredUsers
} from 'reduxStore/slices/calendars/actions';
import {
  selectFilteredEntities,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';

const styles = StyleSheet.create({
  modal: {
    width: '100%'
  },
  tagSelectorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  filterTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  loadMoreButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    alignItems: 'center'
  },
  loadMoreButton: { marginRight: 30 },
  userFiltersTitle: { fontSize: 20, margin: 10 },
  userFiltersApplyButton: { marginTop: 10 },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'center' }
});

const UserFilterSelector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filteredUsers = useSelector(selectFilteredUsers);
  const [newFilteredUsers, setNewFilteredUsers] = useState<number[]>([
    ...(filteredUsers || [])
  ]);

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
          onPress={() => setFilteredUserIds(newFilteredUsers)}
          style={styles.userFiltersApplyButton}
        />
      </TransparentView>
    </TransparentView>
  );
};

const EntityFilterSelector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filteredEntities = useSelector(selectFilteredEntities);
  const [newFilteredEntities, setNewFilteredEntities] = useState<number[]>([
    ...(filteredEntities || [])
  ]);

  const setFilteredEntityIds = (entities: number[]) => {
    dispatch(setFilteredEntities({ entities }));
  };

  return (
    <TransparentView>
      <TransparentView style={styles.tagSelectorWrapper}>
        <EntityAndTagSelector
          value={{ entities: newFilteredEntities, tags: [] }}
          onChange={({ entities }) => setNewFilteredEntities(entities)}
        />
      </TransparentView>
      <TransparentView style={styles.buttonWrapper}>
        <Button
          title={t('common.apply')}
          onPress={() => setFilteredEntityIds(newFilteredEntities)}
          style={styles.userFiltersApplyButton}
        />
      </TransparentView>
    </TransparentView>
  );
};

const FiltersModal = ({
  visible,
  onRequestClose
}: {
  visible: boolean;
  onRequestClose: () => void;
}) => {
  const { t } = useTranslation();
  const filteredUsers = useSelector(selectFilteredUsers);
  const filteredEntities = useSelector(selectFilteredEntities);

  const [shownFilters, setShownFilters] = useState<'' | 'USERS' | 'ENTITIES'>(
    ''
  );
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
        {shownFilters === 'USERS' && <UserFilterSelector />}
      </TransparentView>
      <TransparentView>
        <SafePressable onPress={() => setShownFilters('ENTITIES')}>
          <SafePressable
            onPress={() =>
              setShownFilters(shownFilters === 'ENTITIES' ? '' : 'ENTITIES')
            }
            style={styles.filterTypeHeader}
          >
            <Text style={styles.userFiltersTitle}>
              {t('filters.entityFilters')}
              {filteredEntities?.length && filteredEntities.length > 0
                ? ` (${filteredEntities.length})`
                : ''}
            </Text>
            <Feather
              name={shownFilters === 'ENTITIES' ? 'chevron-up' : 'chevron-down'}
              size={25}
            />
          </SafePressable>
        </SafePressable>
        {shownFilters === 'ENTITIES' && <EntityFilterSelector />}
      </TransparentView>
    </Modal>
  );
};

export default function ListHeaderComponent({
  loading,
  showLoadMore,
  showFilters,
  onLoadMore
}: {
  loading: boolean;
  showLoadMore: boolean;
  showFilters: boolean;
  onLoadMore: () => void;
}) {
  const { t } = useTranslation();
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  if (loading) {
    return (
      <TransparentView style={styles.loadMoreButtonWrapper}>
        <PaddedSpinner spinnerColor="buttonDefault" />
      </TransparentView>
    );
  }
  return (
    <TransparentView style={styles.loadMoreButtonWrapper}>
      {showLoadMore && (
        <LinkButton
          title={t('common.loadOlder')}
          onPress={onLoadMore}
          style={styles.loadMoreButton}
        />
      )}
      {showFilters && (
        <SafePressable
          onPress={() => {
            setFiltersModalOpen(true);
          }}
        >
          <Image source={require('assets/images/icons/filter.png')} />
        </SafePressable>
      )}
      <FiltersModal
        visible={filtersModalOpen}
        onRequestClose={() => setFiltersModalOpen(false)}
      />
    </TransparentView>
  );
}
