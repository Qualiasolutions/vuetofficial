import InputWithLabel from 'components/molecules/InputWithLabel';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { PrimaryText } from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import dayjs from 'dayjs';
import { t } from 'i18next';
import ordinal from 'ordinal';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Recurrence, RecurrenceType } from 'types/tasks';
import { getUTCValuesFromDateTimeString } from 'utils/datesAndTimes';
import DateTimeTextInput from './DateTimeTextInput';

const recurrenceToName = (
  recurrence: Recurrence,
  firstOccurrence: Date,
  reverse?: boolean
) => {
  const { interval_length: intervalLength, recurrence: type } = recurrence;

  const latestOccurenceUtcValues = recurrence.latest_occurrence
    ? getUTCValuesFromDateTimeString(recurrence.latest_occurrence)
    : null;
  const latestOccurrenceString = latestOccurenceUtcValues
    ? `${latestOccurenceUtcValues.day} ${latestOccurenceUtcValues.monthName} ${latestOccurenceUtcValues.year}`
    : '';
  const untilString = latestOccurrenceString
    ? reverse
      ? `${t(
          'components.recurrenceSelector.from'
        ).toLowerCase()} ${latestOccurrenceString}`
      : `${t(
          'components.recurrenceSelector.until'
        ).toLowerCase()} ${latestOccurrenceString}`
    : reverse
    ? `${t('components.recurrenceSelector.from').toLowerCase()} ${t(
        'components.recurrenceSelector.now'
      ).toLowerCase()}`
    : t('components.recurrenceSelector.forever').toLowerCase();

  if (['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'WEEKDAILY'].includes(type)) {
    const typeMap: { [key in RecurrenceType]: string } = {
      DAILY: 'day',
      WEEKLY: 'week',
      MONTHLY: 'month',
      YEARLY: 'year',
      WEEKDAILY: 'weekday',
      MONTHLY_LAST_WEEK: '',
      MONTH_WEEKLY: '',
      YEAR_MONTH_WEEKLY: ''
    };

    if (intervalLength === 1) {
      return `Every ${typeMap[type]} ${untilString}`;
    }
    if (intervalLength === 2) {
      return `Every other ${typeMap[type]} ${untilString}`;
    }
    return `Every ${intervalLength} ${typeMap[type]}s ${untilString}`;
  }

  const firstOccDayJs = dayjs(firstOccurrence);
  const dayNumber = parseInt(firstOccDayJs.format('D'));
  const dayName = firstOccDayJs.format('dddd');
  const monthName = firstOccDayJs.format('MMMM');
  const weekNumber = Math.floor((dayNumber - 1) / 7) + 1;

  if (type === 'MONTH_WEEKLY') {
    if (intervalLength === 1) {
      return `Every month on the ${ordinal(
        weekNumber
      )} ${dayName} ${untilString}`;
    }
    if (intervalLength === 2) {
      return `Every other month on the ${ordinal(
        weekNumber
      )} ${dayName} ${untilString}`;
    }
    return `Every ${ordinal(intervalLength)} month on the ${ordinal(
      weekNumber
    )} ${dayName} ${untilString}`;
  }

  if (type === 'MONTHLY_LAST_WEEK') {
    if (intervalLength === 1) {
      return `Every month on the last ${dayName} ${untilString}`;
    }
    if (intervalLength === 2) {
      return `Every other month on the last ${dayName} ${untilString}`;
    }
    return `Every ${ordinal(
      intervalLength
    )} month on the last ${dayName} ${untilString}`;
  }

  if (type === 'YEAR_MONTH_WEEKLY') {
    if (intervalLength === 1) {
      return `Every year on the ${ordinal(
        weekNumber
      )} ${dayName} in ${monthName} ${untilString}`;
    }
    if (intervalLength === 2) {
      return `Every other year on the ${ordinal(
        weekNumber
      )} ${dayName} in ${monthName} ${untilString}`;
    }
    return `Every ${intervalLength} years on the ${ordinal(
      weekNumber
    )} ${dayName} in ${monthName} ${untilString}`;
  }

  return '';
};

const INTERVAL_ITEMS = [
  {
    value: '1',
    label: 'Every'
  },
  {
    value: '2',
    label: 'Every other'
  }
];

for (let i = 3; i <= 30; i++) {
  INTERVAL_ITEMS.push({ value: `${i}`, label: `Every ${ordinal(i)}` });
}

const IntervalSelector = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <WhiteView>
      <DropDownPicker
        value={value}
        items={INTERVAL_ITEMS}
        multiple={false}
        setValue={(item) => {
          if (item(null)) {
            onChange(item(null));
          }
        }}
        open={open}
        setOpen={setOpen}
        listMode="MODAL"
        placeholder={t('common.frequency')}
      />
    </WhiteView>
  );
};

const TypeSelector = ({
  value,
  firstOccurrence,
  onChange
}: {
  value: string;
  firstOccurrence: Date;
  onChange: (value: RecurrenceType) => void;
}) => {
  const [open, setOpen] = useState(false);

  const firstOccDayJs = dayjs(firstOccurrence);
  const dayName = firstOccDayJs.format('dddd');
  const dayNumber = parseInt(firstOccDayJs.format('D'));
  const weekdayNumber = parseInt(firstOccDayJs.format('d'));
  const weekNumber = Math.floor((dayNumber - 1) / 7) + 1;
  const monthName = firstOccDayJs.format('MMMM');

  const firstOccurrenceCopy = new Date(firstOccurrence);
  firstOccurrenceCopy.setDate(firstOccurrenceCopy.getDate() + 7);
  const isLastWeek =
    firstOccurrence.getMonth() !== firstOccurrenceCopy.getMonth();

  const typeItems: {
    value: RecurrenceType;
    label: string;
  }[] = [
    {
      value: 'DAILY',
      label: 'Day'
    }
  ];

  if (weekdayNumber < 5) {
    typeItems.push({
      value: 'WEEKDAILY',
      label: 'Weekday'
    });
  }

  typeItems.push({
    value: 'WEEKLY',
    label: 'Week'
  });

  typeItems.push({
    value: 'MONTHLY',
    label: 'Month'
  });

  typeItems.push({
    value: 'YEARLY',
    label: 'Year'
  });

  if (weekNumber < 5) {
    typeItems.push({
      value: 'MONTH_WEEKLY',
      label: `month on the ${ordinal(weekNumber)} ${dayName}`
    });
  }

  if (isLastWeek) {
    typeItems.push({
      value: 'MONTHLY_LAST_WEEK',
      label: `month on the last ${dayName}`
    });
  }

  typeItems.push({
    value: 'YEAR_MONTH_WEEKLY',
    label: `year on the ${ordinal(weekNumber)} ${dayName} in ${monthName}`
  });

  return (
    <TransparentView>
      <DropDownPicker
        value={value}
        items={typeItems}
        multiple={false}
        setValue={(item) => {
          if (item(null)) {
            onChange(item(null));
          }
        }}
        open={open}
        setOpen={setOpen}
        listMode="MODAL"
        placeholder={t('common.timePeriod')}
      />
    </TransparentView>
  );
};

type RecurrenceFormProps = {
  value: Recurrence | null;
  onChange: (newValue: Recurrence | null) => void;
  firstOccurrence: Date;
  reverse?: boolean;
};
const RecurrenceForm = ({
  value,
  onChange,
  firstOccurrence,
  reverse
}: RecurrenceFormProps) => {
  const valueString =
    value && firstOccurrence
      ? recurrenceToName(value, firstOccurrence, reverse)
      : null;
  const defaultValues: Recurrence = {
    earliest_occurrence: firstOccurrence.toISOString(),
    latest_occurrence: null,
    interval_length: 1,
    recurrence: 'DAILY'
  };
  return (
    <TransparentView style={{ width: '100%' }}>
      <TransparentView style={{ flexDirection: 'row' }}>
        <TransparentView style={{ marginRight: 5, flex: 1 }}>
          <IntervalSelector
            value={String(value?.interval_length) || ''}
            onChange={(intervalLength) => {
              if (value) {
                onChange({
                  ...value,
                  interval_length: parseInt(intervalLength)
                });
              } else {
                onChange({
                  recurrence: 'DAILY',
                  earliest_occurrence: firstOccurrence.toISOString(),
                  latest_occurrence: null,
                  interval_length: parseInt(intervalLength)
                });
              }
            }}
          />
        </TransparentView>
        <TransparentView style={{ marginLeft: 5, flex: 1 }}>
          <TypeSelector
            value={value?.recurrence || ''}
            firstOccurrence={firstOccurrence}
            onChange={(type) => {
              if (value) {
                onChange({
                  ...value,
                  recurrence: type
                });
              } else {
                onChange({
                  ...defaultValues,
                  recurrence: type
                });
              }
            }}
          />
        </TransparentView>
      </TransparentView>
      <InputWithLabel
        label={
          reverse
            ? t('components.recurrenceSelector.from')
            : t('components.recurrenceSelector.until')
        }
        inlineFields={true}
        style={{ marginTop: 10 }}
      >
        <DateTimeTextInput
          value={
            value?.latest_occurrence ? new Date(value.latest_occurrence) : null
          }
          minimumDate={new Date()}
          onValueChange={(newValue: Date | null) => {
            if (value) {
              onChange({
                ...value,
                latest_occurrence: newValue ? newValue.toISOString() : null
              });
            } else {
              onChange({
                ...defaultValues,
                latest_occurrence: newValue ? newValue.toISOString() : null
              });
            }
          }}
          mode="date"
          placeholder={
            reverse
              ? t('components.recurrenceSelector.now')
              : t('components.recurrenceSelector.forever')
          }
        />
      </InputWithLabel>
      <TransparentView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 10,
          width: '100%'
        }}
      >
        <Text style={{ margin: 10, fontSize: 18, width: '70%' }}>
          {valueString || t('common.none')}
        </Text>
        {valueString && (
          <SafePressable
            onPress={() => {
              onChange(null);
            }}
          >
            <PrimaryText text={t('common.clear')} />
          </SafePressable>
        )}
      </TransparentView>
    </TransparentView>
  );
};

type RecurrenceSelectorProps = {
  value: Recurrence | null;
  onChange: (newValue: Recurrence | null) => void;
  firstOccurrence: Date | null;
  disabled?: boolean;
  reverse?: boolean;
};
export default function RecurrenceSelector({
  value,
  onChange,
  firstOccurrence,
  disabled,
  reverse
}: RecurrenceSelectorProps) {
  const [editing, setEditing] = useState(false);
  const valueString =
    value && firstOccurrence
      ? recurrenceToName(value, firstOccurrence, reverse)
      : 'None';

  return (
    <TransparentView>
      <SafePressable
        onPress={() => {
          if (!disabled) {
            setEditing(true);
          }
        }}
      >
        <Text>{valueString}</Text>
      </SafePressable>
      <Modal
        visible={editing}
        onRequestClose={() => setEditing(false)}
        boxStyle={{ width: '100%' }}
      >
        {firstOccurrence ? (
          <RecurrenceForm
            value={value}
            onChange={onChange}
            firstOccurrence={firstOccurrence}
            reverse={reverse}
          />
        ) : (
          <Text>Please set the first occurence</Text>
        )}
      </Modal>
    </TransparentView>
  );
}
