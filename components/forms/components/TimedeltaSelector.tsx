import { Feather } from '@expo/vector-icons';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type IntervalType = 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK';
type TimeDeltaObject = { timedelta: string };

const NUMBER_ITEMS: { value: number; label: string }[] = [];
for (let i = 1; i < 31; i++) {
  NUMBER_ITEMS.push({
    value: i,
    label: `${i}`
  });
}
const NumberSelector = ({
  value,
  onChange
}: {
  value: number | null;
  onChange: (val: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      value={value}
      items={NUMBER_ITEMS}
      multiple={false}
      setValue={(item) => {
        if (item(null)) {
          onChange(item(null));
        }
      }}
      open={open}
      setOpen={setOpen}
      listMode="MODAL"
      placeholder={''}
    />
  );
};

const TIME_INTERVAL_ITEMS: {
  [key in IntervalType]: { value: IntervalType; label: string };
} = {
  MINUTE: {
    value: 'MINUTE',
    label: 'Minutes'
  },
  HOUR: {
    value: 'HOUR',
    label: 'Hours'
  },
  DAY: {
    value: 'DAY',
    label: 'Days'
  },
  WEEK: {
    value: 'WEEK',
    label: 'Weeks'
  }
};
const TimeIntervalSelector = ({
  value,
  onChange,
  intervalTypes
}: {
  value: IntervalType | null;
  onChange: (val: IntervalType) => void;
  intervalTypes: IntervalType[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      value={value}
      items={intervalTypes.map((type) => TIME_INTERVAL_ITEMS[type])}
      multiple={false}
      setValue={(item) => {
        if (item(null)) {
          onChange(item(null));
        }
      }}
      open={open}
      setOpen={setOpen}
      listMode="MODAL"
      placeholder={''}
    />
  );
};

type ActionSelectorModalProps = {
  open: boolean;
  value: TimeDeltaObject[];
  onChange: (newValue: TimeDeltaObject[]) => void;
  onRequestClose: () => void;
  max?: number;
  intervalTypes?: IntervalType[];
};

const modalStyles = StyleSheet.create({
  container: { width: '100%' },
  dropdownContainer: { flex: 1 },
  selectionRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  exisitingValueRow: { flexDirection: 'row' },
  deleteActionCross: { marginLeft: 10 }
});

const TimedeltaSelectorModal = ({
  open,
  value,
  onChange,
  onRequestClose,
  max,
  intervalTypes = ['MINUTE', 'HOUR', 'DAY', 'WEEK']
}: ActionSelectorModalProps) => {
  const [newNumIntervals, setNewNumIntervals] = useState<number | null>(null);
  const [newIntervalType, setNewIntervalType] = useState<IntervalType | null>(
    null
  );

  const { t } = useTranslation();

  const resetVals = () => {
    setNewNumIntervals(null);
    setNewIntervalType(null);
  };
  return (
    <Modal
      visible={open}
      onRequestClose={onRequestClose}
      boxStyle={modalStyles.container}
    >
      <TransparentView style={modalStyles.container}>
        {value.map((timedeltaObj, i) => (
          <TransparentView key={i} style={modalStyles.exisitingValueRow}>
            <Text>
              {timedeltaObj.timedelta.split(' ')[0]} {t('common.days')}
            </Text>
            <SafePressable
              onPress={() => {
                onChange(
                  value.filter((valueAction) => valueAction !== timedeltaObj)
                );
              }}
            >
              <Feather
                name="delete"
                color={'red'}
                size={25}
                style={modalStyles.deleteActionCross}
              />
            </SafePressable>
          </TransparentView>
        ))}
        {(!max || value.length < max) && (
          <TransparentView style={modalStyles.selectionRow}>
            <TransparentView style={modalStyles.dropdownContainer}>
              <NumberSelector
                value={newNumIntervals}
                onChange={setNewNumIntervals}
              />
            </TransparentView>
            <TransparentView style={modalStyles.dropdownContainer}>
              <TimeIntervalSelector
                value={newIntervalType}
                onChange={setNewIntervalType}
                intervalTypes={intervalTypes}
              />
            </TransparentView>
            <SafePressable
              onPress={() => {
                if (newNumIntervals) {
                  if (newIntervalType === 'MINUTE') {
                    onChange([
                      ...value,
                      {
                        timedelta: `0 00:00:${newNumIntervals}`
                      }
                    ]);
                    resetVals();
                  } else if (newIntervalType === 'HOUR') {
                    onChange([
                      ...value,
                      {
                        timedelta: `0 00:${newNumIntervals}:00`
                      }
                    ]);
                    resetVals();
                  } else if (newIntervalType === 'DAY') {
                    onChange([
                      ...value,
                      {
                        timedelta: `${newNumIntervals} 00:00:00`
                      }
                    ]);
                    resetVals();
                  } else if (newIntervalType === 'WEEK') {
                    onChange([
                      ...value,
                      {
                        timedelta: `${7 * newNumIntervals} 00:00:00`
                      }
                    ]);
                    resetVals();
                  }
                }
              }}
            >
              <Feather name="check" color={'green'} size={25} />
            </SafePressable>
          </TransparentView>
        )}
      </TransparentView>
    </Modal>
  );
};

export default function TimedeltaSelector({
  value,
  onChange,
  max,
  placeholder,
  intervalTypes = ['MINUTE', 'HOUR', 'DAY', 'WEEK']
}: {
  value: TimeDeltaObject[];
  onChange: (actions: TimeDeltaObject[]) => void;
  max?: number;
  placeholder?: string;
  intervalTypes?: IntervalType[];
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <TransparentView>
      <SafePressable onPress={() => setOpen(true)}>
        {value.length > 0 ? (
          <TransparentView>
            {value.map((timedeltaObj, i) => (
              <Text key={i}>
                {timedeltaObj.timedelta.split(' ')[0]} {t('common.days')}
              </Text>
            ))}
          </TransparentView>
        ) : (
          <Text>{placeholder || 'ADD TIMEDELTAS'}</Text>
        )}
      </SafePressable>
      <TimedeltaSelectorModal
        open={open}
        onRequestClose={() => setOpen(false)}
        value={value}
        onChange={onChange}
        max={max}
        intervalTypes={intervalTypes}
      />
    </TransparentView>
  );
}
