import { useTranslation } from "react-i18next"
import { useGetAllTaskLimitsQuery } from "reduxStore/services/api/taskLimits"
import { TransparentPaddedView, TransparentView } from "components/molecules/ViewComponents";
import { FullPageSpinner } from "components/molecules/Spinners";
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';
import { useGetAllCategoriesQuery } from "reduxStore/services/api/api";
import { Pressable, StyleSheet } from "react-native";
import { Modal } from "components/molecules/Modals";
import { TaskLimitInterval, TaskLimitLimitFields, TaskLimitResponseType } from "types/taskLimits";
import { Text } from "components/Themed";
import { useEffect, useState } from "react";


const EditTaskLimitForm = ({
  value,
  onChange
}: {
  value: TaskLimitLimitFields,
  onChange: (val: TaskLimitLimitFields) => void
}) => {
  return <TransparentView>
    <Text>EDITTTTTT</Text>
  </TransparentView>
}

type EditTaskLimitModalProps = {
  categoryId: number;
  interval: TaskLimitInterval;
  visible: boolean;
  onRequestClose: () => void;
}
const EditTaskLimitModal = ({ categoryId, interval, visible, onRequestClose }: EditTaskLimitModalProps) => {
  const {
    data: taskLimits,
    isLoading: isLoadingTaskLimits
  } = useGetAllTaskLimitsQuery()

  const [newLimits, setNewLimits] = useState<TaskLimitLimitFields>({
    minutes_limit: 120,
    tasks_limit: null
  })

  useEffect(() => {
    if (taskLimits) {
      const taskLimitToEdit = Object.values(taskLimits.byId).find(taskLimit => (
        (taskLimit.category === categoryId)
        && (taskLimit.interval === interval)
      ))
      if (taskLimitToEdit) {
        setNewLimits({
          ...taskLimitToEdit
        })
      }
    }
  })

  const isLoading = isLoadingTaskLimits || !taskLimits
  if (isLoading) {
    return null
  }

  return <Modal visible={visible} onRequestClose={onRequestClose}>
    <EditTaskLimitForm
      value={newLimits}
      onChange={setNewLimits}
    />
  </Modal>
}

export default function TaskLimitsScreen() {
  const {
    data: allCategories,
    isLoading: isLoadingCategories
  } = useGetAllCategoriesQuery()

  const {
    data: taskLimits,
    isLoading: isLoadingTaskLimits
  } = useGetAllTaskLimitsQuery()

  const [taskLimitToEdit, setTaskLimitToEdit] = useState<
    {
      categoryId: number;
      interval: TaskLimitInterval;
    } | null
  >(null)

  const { t } = useTranslation()

  const isLoading = isLoadingTaskLimits || isLoadingCategories || !allCategories || !taskLimits

  if (isLoading) {
    return <FullPageSpinner />
  }


  const TaskLimitPressable = ({ categoryId, text, interval }: { categoryId: number; text: string; interval: TaskLimitInterval; }) => {
    return <Pressable
      onPress={() => setTaskLimitToEdit({
        categoryId,
        interval
      })}
    >
      <Text style={styles.tableText}>
        {text}
      </Text>
    </Pressable>
  }


  const DailyPressable = ({ categoryId, text }: { categoryId: number; text: string; }) => {
    return <TaskLimitPressable
      categoryId={categoryId}
      text={text}
      interval={'DAILY'}
    />
  }

  const MonthlyPressable = ({ categoryId, text }: { categoryId: number; text: string; }) => {
    return <TaskLimitPressable
      categoryId={categoryId}
      text={text}
      interval={'MONTHLY'}
    />
  }

  const categoryIds = allCategories.ids
  const dailyLimitCells: { [key: number]: React.ReactNode } = {}
  const monthlyLimitCells: { [key: number]: React.ReactNode } = {}
  for (const id of categoryIds) {
    const categoryDayLimit = Object.values(taskLimits.byId)
      .find(limit => (
        (limit.interval === "DAILY")
        && (limit.category === id)
      ))

    if (!categoryDayLimit) {
      dailyLimitCells[id] = <DailyPressable
        categoryId={id}
        text={t("common.none")}
      />
    }

    if (categoryDayLimit?.minutes_limit) {
      dailyLimitCells[id] = <DailyPressable
        categoryId={id}
        text={`${categoryDayLimit?.minutes_limit} ${t("common.minutes")}`}
      />
    }

    if (categoryDayLimit?.tasks_limit) {
      dailyLimitCells[id] = <DailyPressable
        categoryId={id}
        text={`${categoryDayLimit?.minutes_limit} ${t("common.tasks")}`}
      />
    }

    const categoryMonthLimit = Object.values(taskLimits.byId)
      .find(limit => (
        (limit.interval === "MONTHLY")
        && (limit.category === id)
      ))

    if (!categoryMonthLimit) {
      monthlyLimitCells[id] = <MonthlyPressable
        categoryId={id}
        text={t("common.none")}
      />
    }

    if (categoryMonthLimit?.minutes_limit) {
      monthlyLimitCells[id] = <MonthlyPressable
        categoryId={id}
        text={`${categoryMonthLimit?.minutes_limit} ${t("common.minutes")}`}
      />
    }

    if (categoryMonthLimit?.tasks_limit) {
      monthlyLimitCells[id] = <MonthlyPressable
        categoryId={id}
        text={`${categoryMonthLimit?.minutes_limit} ${t("common.tasks")}`}
      />
    }
  }

  const rowHeight = 44
  const headerHeight = 60

  return <TransparentPaddedView style={{ flex: 1 }}>
    <Table borderStyle={{ borderWidth: 1 }} >
      <Row
        data={["", "Daily", "Monthly"]}
        style={{ width: '100%', height: headerHeight }}
        textStyle={StyleSheet.flatten([styles.tableText, styles.tableHeaderText])}
      />
      {/* <TransparentFullPageScrollView> */}
      <TableWrapper style={{ flexDirection: 'row' }}>
        <Col
          heightArr={categoryIds.map(id => rowHeight)}
          data={categoryIds.map(id => allCategories.byId[id].readable_name)}
          textStyle={StyleSheet.flatten([styles.tableText, styles.tableHeaderText])}
        />
        <Col
          heightArr={categoryIds.map(id => rowHeight)}
          data={categoryIds.map(id => dailyLimitCells[id])}
          textStyle={styles.tableText}
        />
        <Col
          heightArr={categoryIds.map(id => rowHeight)}
          data={categoryIds.map(id => monthlyLimitCells[id])}
          textStyle={styles.tableText}
        />
      </TableWrapper>
    </Table>
    <EditTaskLimitModal
      visible={!!taskLimitToEdit}
      interval={taskLimitToEdit?.interval || 'DAILY'}
      categoryId={taskLimitToEdit?.categoryId || 0}
      onRequestClose={() => setTaskLimitToEdit(null)}
    />
  </TransparentPaddedView>
}

const styles = StyleSheet.create({
  tableText: {
    textAlign: 'center',
    margin: 4
  },
  tableHeaderText: {
    fontWeight: 'bold'
  }
})