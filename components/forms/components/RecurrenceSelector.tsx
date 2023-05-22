import { Modal } from "components/molecules/Modals";
import { TransparentView, WhiteView } from "components/molecules/ViewComponents";
import { Text } from "components/Themed";
import dayjs from "dayjs";
import ordinal from "ordinal";
import { useState } from "react";
import { Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Recurrence, RecurrenceType } from "types/tasks";


const recurrenceToName = (recurrence: Recurrence, firstOccurrence: Date) => {
  const { interval_length: intervalLength, recurrence: type } = recurrence
  if (["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(type)) {
    const typeMap: { [key in RecurrenceType]: string } = {
      DAILY: "day",
      WEEKLY: "week",
      MONTHLY: "month",
      YEARLY: "year",
      WEEKDAILY: "weekday",
      MONTHLY_LAST_WEEK: "",
      MONTH_WEEKLY: "",
      YEAR_MONTH_WEEKLY: ""
    }

    if (intervalLength === 1) {
      return `Every ${typeMap[type]}`
    }
    if (intervalLength === 2) {
      return `Every other ${typeMap[type]}`
    }
    return `Every ${intervalLength} ${typeMap[type]}s`
  }

  const firstOccDayJs = dayjs(firstOccurrence)
  const dayNumber = parseInt(firstOccDayJs.format("D"))
  const dayName = firstOccDayJs.format("dddd")
  const monthName = firstOccDayJs.format("MMMM")
  const weekNumber = Math.floor((dayNumber - 1) / 7) + 1

  if (type === "MONTH_WEEKLY") {
    if (intervalLength === 1) {
      return `Every month on the ${ordinal(weekNumber)} ${dayName}`
    }
    if (intervalLength === 2) {
      return `Every other month on the ${ordinal(weekNumber)} ${dayName}`
    }
    return `Every ${ordinal(intervalLength)} month on the ${ordinal(weekNumber)} ${dayName}`
  }

  if (type === "MONTHLY_LAST_WEEK") {
    if (intervalLength === 1) {
      return `Every month on the last ${dayName}`
    }
    if (intervalLength === 2) {
      return `Every other month on the last ${dayName}`
    }
    return `Every ${ordinal(intervalLength)} month on the last ${dayName}`
  }

  if (type === "YEAR_MONTH_WEEKLY") {
    if (intervalLength === 1) {
      return `Every year on the ${ordinal(weekNumber)} ${dayName} in ${monthName}`
    }
    if (intervalLength === 2) {
      return `Every other year on the ${ordinal(weekNumber)} ${dayName} in ${monthName}`
    }
    return `Every ${intervalLength} years on the ${ordinal(weekNumber)} ${dayName} in ${monthName}`
  }

  return ""
}


const INTERVAL_ITEMS = [
  {
    value: "1",
    label: "Every"
  },
  {
    value: "2",
    label: "Every other"
  },
]

for (let i = 3; i <= 30; i++) {
  INTERVAL_ITEMS.push({ value: `${i}`, label: `Every ${ordinal(i)}` })
}

const IntervalSelector = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false)
  return <WhiteView>
    <DropDownPicker
      value={value}
      items={INTERVAL_ITEMS}
      multiple={false}
      setValue={(item) => {
        if (item(null)) {
          onChange(item(null))
        }
      }}
      open={open}
      setOpen={setOpen}
      listMode="MODAL"
    />
  </WhiteView>
}


const TypeSelector = ({ value, firstOccurrence, onChange }: { value: string; firstOccurrence: Date; onChange: (value: RecurrenceType) => void }) => {
  const [open, setOpen] = useState(false)

  const firstOccDayJs = dayjs(firstOccurrence)
  const dayName = firstOccDayJs.format("dddd")
  const dayNumber = parseInt(firstOccDayJs.format("D"))
  const weekdayNumber = parseInt(firstOccDayJs.format("d"))
  const weekNumber = Math.floor((dayNumber - 1) / 7) + 1
  const monthName = firstOccDayJs.format("MMMM")

  const firstOccurrenceCopy = new Date(firstOccurrence);
  firstOccurrenceCopy.setDate(firstOccurrenceCopy.getDate() + 7);
  const isLastWeek = firstOccurrence.getMonth() !== firstOccurrenceCopy.getMonth()

  const typeItems: {
    value: RecurrenceType,
    label: string
  }[] = [
      {
        value: "DAILY",
        label: "Day"
      }
    ]

  if (weekdayNumber < 5) {
    typeItems.push({
      value: "WEEKDAILY",
      label: "Weekday"
    })
  }

  typeItems.push({
    value: "WEEKLY",
    label: "Week"
  })


  typeItems.push({
    value: "MONTHLY",
    label: "Month"
  })

  typeItems.push({
    value: "YEARLY",
    label: "Year"
  })

  if (weekNumber < 5) {
    typeItems.push({
      value: "MONTH_WEEKLY",
      label: `month on the ${ordinal(weekNumber)} ${dayName}`
    })
  }

  if (isLastWeek) {
    typeItems.push({
      value: "MONTHLY_LAST_WEEK",
      label: `month on the last ${dayName}`
    })
  }

  typeItems.push({
    value: "YEAR_MONTH_WEEKLY",
    label: `year on the ${ordinal(weekNumber)} ${dayName} in ${monthName}`
  })

  return <TransparentView>
    <DropDownPicker
      value={value}
      items={typeItems}
      multiple={false}
      setValue={(item) => {
        if (item(null)) {
          onChange(item(null))
        }
      }}
      open={open}
      setOpen={setOpen}
      listMode="MODAL"
    />
  </TransparentView>
}

type RecurrenceFormProps = {
  value: Recurrence | null;
  onChange: (newValue: Recurrence | null) => void;
  firstOccurrence: Date;
}
const RecurrenceForm = ({ value, onChange, firstOccurrence }: RecurrenceFormProps) => {
  const valueString = (value && firstOccurrence) ? recurrenceToName(value, firstOccurrence) : "None"
  return <TransparentView style={{ width: '100%' }}>
    <TransparentView style={{ flexDirection: 'row' }}>
      <TransparentView style={{ margin: 5, flex: 1 }}>
        <IntervalSelector
          value={String(value?.interval_length) || ""}
          onChange={(intervalLength) => {
            if (value) {
              onChange({
                ...value,
                interval_length: parseInt(intervalLength)
              })
            } else {
              onChange({
                recurrence: 'DAILY',
                earliest_occurrence: firstOccurrence.toISOString(),
                latest_occurrence: null,
                interval_length: parseInt(intervalLength)
              })
            }
          }}
        />
      </TransparentView>
      <TransparentView style={{ margin: 5, flex: 1 }}>
        <TypeSelector
          value={value?.recurrence || ""}
          firstOccurrence={firstOccurrence}
          onChange={(type) => {
            if (value) {
              onChange({
                ...value,
                recurrence: type
              })
            } else {
              onChange({
                recurrence: type,
                earliest_occurrence: firstOccurrence.toISOString(),
                latest_occurrence: null,
                interval_length: 1
              })
            }
          }}
        />
      </TransparentView>
    </TransparentView>
    <Text style={{ margin: 10, fontSize: 20 }}>{valueString}</Text>
  </TransparentView>
}

type RecurrenceSelectorProps = {
  value: Recurrence | null;
  onChange: (newValue: Recurrence | null) => void;
  firstOccurrence: Date | null;
  disabled: boolean;
}
export default function RecurrenceSelector({ value, onChange, firstOccurrence, disabled }: RecurrenceSelectorProps) {
  const [editing, setEditing] = useState(false)
  const valueString = (value && firstOccurrence) ? recurrenceToName(value, firstOccurrence) : "None"

  return <TransparentView>
    <Pressable onPress={() => {
      if (!disabled) {
        setEditing(true)
      }
    }}>
      <Text>{valueString}</Text>
    </Pressable>
    <Modal visible={editing} onRequestClose={() => setEditing(false)} boxStyle={{ width: '100%' }}>
      {
        firstOccurrence
          ? <RecurrenceForm value={value} onChange={onChange} firstOccurrence={firstOccurrence} />
          : <Text>Please set the first task occurence</Text>
      }
    </Modal>
  </TransparentView>
}