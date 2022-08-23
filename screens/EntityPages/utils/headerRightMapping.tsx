import { WhiteText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

export const headerRightMapping = {
  Holiday: ({ route, navigation }) => {
    const { t } = useTranslation()
    return <Pressable onPress={() => navigation.navigate('HolidayList')}>
      <WhiteText text={t('misc.editCountryList')}/>
    </Pressable>
  },
} as { [key: string]: (React.ElementType | undefined) };
