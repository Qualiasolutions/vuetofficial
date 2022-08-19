import { MediumLightGreyText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { TextInput } from 'components/Themed';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { StyleSheet, ViewStyle } from 'react-native';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getDaysToAge } from 'utils/datesAndTimes';

dayjs.extend(customParseFormat);

const DEFAULT_YEAR = 1000; // A leapyear to allow Feb 29th

export type OptionalYearDateInputProps = {
  value?: Date;
  knownYear?: boolean;
  onValueChange: (date: Date, knownYear: boolean) => void;
  textInputStyle?: ViewStyle;
};

export function OptionalYearDateInput({
  value,
  knownYear,
  onValueChange = () => {},
  textInputStyle = {}
}: OptionalYearDateInputProps) {
  const [dateValue, setDateValue] = useState<string>(
    String(value?.getDate() || '')
  );
  const [monthValue, setMonthValue] = useState<string>(
    String(value?.getMonth() || '')
  );
  const [yearValue, setYearValue] = useState<string>(
    (knownYear && String(value?.getFullYear())) || ''
  );

  const [nextAge, setNextAge] = useState<number | null>(null);
  const [nextAnniversaryYear, setNextAnniversaryYear] = useState<number | null>(
    null
  );

  const validatedDate = () => {
    try {
      const dayJsDate = dayjs(
        `${yearValue || DEFAULT_YEAR}-${monthValue}-${dateValue}`,
        ['YYYY-M-D', 'YYYY-MM-DD', 'YYYY-MM-D', 'YYYY-M-DD'],
        true
      );
      if (dayJsDate.isValid()) {
        return dayJsDate.toDate();
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!value) {
      setDateValue('');
      setMonthValue('');
      setYearValue('');
    }
  }, [value]);

  useEffect(() => {
    const parsedDate = validatedDate();
    if (parsedDate) {
      onValueChange(parsedDate, !!yearValue);
      const { age, year } = getDaysToAge(parsedDate);
      setNextAge(age);
      setNextAnniversaryYear(year);
    }
  }, [dateValue, monthValue, yearValue]);

  return (
    <TransparentView style={styles.container}>
      <TransparentView style={styles.textInputWrapper}>
        <TextInput
          style={[styles.textInput, textInputStyle]}
          value={String(dateValue || '')}
          placeholder="DD"
          onChangeText={(val) => {
            setDateValue(val);
          }}
          maxLength={2}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.textInput, textInputStyle]}
          value={String(monthValue || '')}
          placeholder="MM"
          onChangeText={(val) => setMonthValue(val)}
          maxLength={2}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.yearTextInput, textInputStyle]}
          value={String(yearValue || '')}
          placeholder="????"
          onChangeText={(val) => setYearValue(val)}
          maxLength={4}
          keyboardType="numeric"
        />
      </TransparentView>
      {!!(dateValue && monthValue && validatedDate()) && (
        <TransparentView>
          <MediumLightGreyText
            text={t('misc.turnsAgeIn', {
              age: knownYear ? nextAge : 'XX',
              year: nextAnniversaryYear
            })}
            style={styles.ageText}
          />
        </TransparentView>
      )}
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInputWrapper: {
    flexDirection: 'row',
    flex: 1
  },
  textInput: {
    marginRight: 10,
    flex: 1,
    maxWidth: 60
  },
  yearTextInput: {
    flex: 2,
    maxWidth: 80
  },
  ageText: {
    fontSize: 16
  }
});
