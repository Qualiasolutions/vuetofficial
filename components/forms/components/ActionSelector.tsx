import { Feather } from '@expo/vector-icons';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TaskAction } from 'types/taskActions';

type IntervalType = 'DAY' | 'WEEK';
type TaskActionFields = Pick<TaskAction, 'action_timedelta'>;

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

const TIME_INTERVAL_ITEMS: { value: IntervalType; label: string }[] = [
  {
    value: 'DAY',
    label: 'Days'
  },
  {
    value: 'WEEK',
    label: 'Weeks'
  }
];
const TimeIntervalSelector = ({
  value,
  onChange
}: {
  value: IntervalType | null;
  onChange: (val: IntervalType) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      value={value}
      items={TIME_INTERVAL_ITEMS}
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
  value: TaskActionFields[];
  onChange: (newValue: TaskActionFields[]) => void;
  onRequestClose: () => void;
  max?: number;
};

const actionSelectorModalStyles = StyleSheet.create({
  container: { width: '100%' },
  dropdownContainer: { flex: 1 },
  selectionRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  exisitingValueRow: { flexDirection: 'row' },
  deleteActionCross: { marginLeft: 10 }
});

const ActionSelectorModal = ({
  open,
  value,
  onChange,
  onRequestClose,
  max
}: ActionSelectorModalProps) => {
  const [newNumIntervals, setNewNumIntervals] = useState<number | null>(null);
  const [newIntervalType, setNewIntervalType] = useState<IntervalType | null>(
    null
  );

  const resetVals = () => {
    setNewNumIntervals(null);
    setNewIntervalType(null);
  };
  return (
    <Modal
      visible={open}
      onRequestClose={onRequestClose}
      boxStyle={actionSelectorModalStyles.container}
    >
      <TransparentView style={actionSelectorModalStyles.container}>
        {value.map((action, i) => (
          <TransparentView
            key={i}
            style={actionSelectorModalStyles.exisitingValueRow}
          >
            <Text>{action.action_timedelta}</Text>
            <SafePressable
              onPress={() => {
                onChange(value.filter((valueAction) => valueAction !== action));
              }}
            >
              <Feather
                name="delete"
                color={'red'}
                size={25}
                style={actionSelectorModalStyles.deleteActionCross}
              />
            </SafePressable>
          </TransparentView>
        ))}
        {(!max || value.length < max) && (
          <TransparentView style={actionSelectorModalStyles.selectionRow}>
            <TransparentView
              style={actionSelectorModalStyles.dropdownContainer}
            >
              <NumberSelector
                value={newNumIntervals}
                onChange={setNewNumIntervals}
              />
            </TransparentView>
            <TransparentView
              style={actionSelectorModalStyles.dropdownContainer}
            >
              <TimeIntervalSelector
                value={newIntervalType}
                onChange={setNewIntervalType}
              />
            </TransparentView>
            <SafePressable
              onPress={() => {
                if (newNumIntervals) {
                  if (newIntervalType === 'DAY') {
                    onChange([
                      ...value,
                      {
                        action_timedelta: `${newNumIntervals} 00:00:00`
                      }
                    ]);
                    resetVals();
                  } else if (newIntervalType === 'WEEK') {
                    onChange([
                      ...value,
                      {
                        action_timedelta: `${7 * newNumIntervals} 00:00:00`
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

export default function ActionSelector({
  value,
  onChange,
  max
}: {
  value: TaskActionFields[];
  onChange: (actions: TaskActionFields[]) => void;
  max?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TransparentView>
      <SafePressable onPress={() => setOpen(true)}>
        {value.length > 0 ? (
          <TransparentView>
            {value.map((action, i) => (
              <Text key={i}>{action.action_timedelta}</Text>
            ))}
          </TransparentView>
        ) : (
          <Text>ADD ACTIONS</Text>
        )}
      </SafePressable>
      <ActionSelectorModal
        open={open}
        onRequestClose={() => setOpen(false)}
        value={value}
        onChange={onChange}
        max={max}
      />
    </TransparentView>
  );
}
