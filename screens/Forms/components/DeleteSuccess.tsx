import { Text } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default ({ name }: { name: string }) => {
  const { t } = useTranslation();
  return (
    <Text style={styles.message}>
      {t('components.deleteSuccess.successfullyDeleted', { name })}
    </Text>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 30,
    textAlign: 'center',
    fontSize: 20
  }
});
