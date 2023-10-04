import { Feather } from '@expo/vector-icons';
import { Button } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import UserCheckboxes from 'components/molecules/UserCheckboxes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredCategories,
  setFilteredTaskTypes,
  setFilteredUsers
} from 'reduxStore/slices/calendars/actions';
import {
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import CategoryCheckboxes from 'components/organisms/CategoryCheckboxes';
import { TaskType } from 'types/tasks';
import CheckboxesList from 'components/molecules/CheckboxesList';

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    maxHeight: '100%'
  },
  filterTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterTypeTitle: { fontSize: 20, margin: 10 },
  userFiltersApplyButton: { marginTop: 10 },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  filtersButton: { alignItems: 'center' },
  filtersButtonText: { fontSize: 11 }
});

const UserFilterSelector = ({
  value,
  onValueChange
}: {
  value: number[];
  onValueChange: (newUsers: number[]) => void;
}) => {
  return (
    <TransparentView>
      <UserCheckboxes
        value={value}
        onToggleUser={(userId) => {
          if (value.includes(userId)) {
            onValueChange(value.filter((id) => id !== userId));
          } else {
            onValueChange([...value, userId]);
          }
        }}
      />
    </TransparentView>
  );
};

const TaskTypeSelector = ({
  value,
  onValueChange
}: {
  value: (TaskType | 'OTHER')[];
  onValueChange: (taskTypes: (TaskType | 'OTHER')[]) => void;
}) => {
  const { t } = useTranslation();
  const taskTypeOptions: {
    value: TaskType | 'OTHER';
    label: string;
    checked: boolean;
  }[] = [
    {
      value: 'TASK',
      label: t('taskTypes.TASK'),
      checked: value.includes('TASK')
    },
    {
      value: 'APPOINTMENT',
      label: t('taskTypes.APPOINTMENT'),
      checked: value.includes('APPOINTMENT')
    },
    {
      value: 'OTHER',
      label: t('common.other'),
      checked: value.includes('OTHER')
    }
  ];
  return (
    <CheckboxesList
      options={taskTypeOptions}
      onToggleItem={(taskType: TaskType | 'OTHER') => {
        if (value.includes(taskType)) {
          onValueChange(value.filter((val) => val !== taskType));
        } else {
          onValueChange([...value, taskType]);
        }
      }}
    />
  );
};

const ExpandableSection = ({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TransparentView>
      <SafePressable
        onPress={() => setExpanded(!expanded)}
        style={styles.filterTypeHeader}
      >
        <Text style={styles.filterTypeTitle}>{title}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={25} />
      </SafePressable>
      {expanded && children}
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
  const dispatch = useDispatch();
  const filteredUsers = useSelector(selectFilteredUsers);
  const filteredCategories = useSelector(selectFilteredCategories);
  const filteredTaskTypes = useSelector(selectFilteredTaskTypes);

  const [newFilteredUsers, setNewFilteredUsers] = useState(filteredUsers);
  const [newFilteredCategories, setNewFilteredCategories] =
    useState(filteredCategories);
  const [newFilteredTaskTypes, setNewFilteredTaskTypes] =
    useState(filteredTaskTypes);

  const onUsersValueChange = useCallback(
    (newUsers: number[]) => {
      setNewFilteredUsers(newUsers);
    },
    [setNewFilteredUsers]
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      boxStyle={styles.modal}
    >
      <TransparentScrollView>
        <ExpandableSection
          title={`${t('filters.userFilters')}${
            filteredUsers && filteredUsers.length > 0
              ? ` (${filteredUsers.length})`
              : ''
          }`}
        >
          <UserFilterSelector
            value={newFilteredUsers || []}
            onValueChange={onUsersValueChange}
          />
        </ExpandableSection>
        <ExpandableSection
          title={`${t('filters.categoryFilters')}${
            filteredCategories && filteredCategories.length > 0
              ? ` (${filteredCategories.length})`
              : ''
          }`}
        >
          <CategoryCheckboxes
            value={newFilteredCategories || []}
            onChange={setNewFilteredCategories}
          />
        </ExpandableSection>
        <ExpandableSection
          title={`${t('filters.taskTypeFilters')}${
            filteredTaskTypes && filteredTaskTypes.length > 0
              ? ` (${filteredTaskTypes.length})`
              : ''
          }`}
        >
          <TaskTypeSelector
            value={newFilteredTaskTypes || []}
            onValueChange={setNewFilteredTaskTypes}
          />
        </ExpandableSection>
      </TransparentScrollView>
      <TransparentView>
        <TransparentView style={styles.buttonWrapper}>
          <Button
            title={t('common.apply')}
            onPress={() => {
              if (newFilteredCategories) {
                dispatch(
                  setFilteredCategories({ categories: newFilteredCategories })
                );
              }
              if (newFilteredUsers) {
                dispatch(setFilteredUsers({ users: newFilteredUsers }));
              }
              if (newFilteredTaskTypes) {
                dispatch(
                  setFilteredTaskTypes({ taskTypes: newFilteredTaskTypes })
                );
              }
              onRequestClose();
            }}
            style={styles.userFiltersApplyButton}
          />
        </TransparentView>
      </TransparentView>
    </Modal>
  );
}
