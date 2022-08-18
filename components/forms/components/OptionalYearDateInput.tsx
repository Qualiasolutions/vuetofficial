import { LightBlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { TextInput, useThemeColor } from 'components/Themed';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { StyleSheet } from 'react-native';

export type OptionalYearDateInputProps = {
  value?: Date;
  knownYear?: boolean;
  onValueChange: (date: Date, knownYear: boolean) => void
}

export function OptionalYearDateInput({
  value,
  knownYear,
  onValueChange = () => {}
}: OptionalYearDateInputProps) {
  const [dateValue, setDateValue] = useState<number | null>(value?.getDate() || null)
  const [monthValue, setMonthValue] = useState<number | null>(value?.getMonth() || null)
  const [yearValue, setYearValue] = useState<number | null>(
    (knownYear && value?.getFullYear()) || null
  )

  const validatedDate = () => {
    try {
      const dayJsDate = dayjs(`${dateValue}-${monthValue}-${yearValue}`)
      if (dayJsDate.isValid()) {
        return dayJsDate.toDate()
      } else {
        return false
      }
    } catch {
      return false
    }
  }

  useEffect(() => {
    console.log(dateValue, monthValue, yearValue)
    const parsedDate = validatedDate()
    console.log(parsedDate)
    if (parsedDate) {
      onValueChange(parsedDate, !!yearValue)
    } else {
      // TODO
      console.log("err")
    }
  }, [dateValue, monthValue, yearValue])
  

  return (
    <>
      <TransparentView>
        <TextInput
          value={String(dateValue || '')}
          placeholder='DD'
          onChangeText={(val) => setDateValue(parseInt(val))}
        />
        <TextInput
          value={String(monthValue || '')}
          placeholder='MM'
          onChangeText={(val) => setMonthValue(parseInt(val))}
        />
        <TextInput
          value={String(yearValue || '')}
          placeholder='????'
          onChangeText={(val) => setYearValue(parseInt(val))}
        />
      </TransparentView>
      {/* { dateValue && monthValue && yearValue && validatedDate() &&
        <TransparentView>
          <LightBlackText text={t('translation.here')} />
        </TransparentView>
      } */}
    </>
  );
}