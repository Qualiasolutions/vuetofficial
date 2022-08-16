import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { PrimaryText } from './TextComponents';
import { TransparentView } from './ViewComponents';

export function Header({ title = '', backPress = () => {} }) {
  return (
    <TransparentView style={styles.header}>
      <Pressable onPress={backPress} style={styles.left}>
        <Feather
          name="chevron-left"
          color={useThemeColor({}, 'primary')}
          size={25}
        />
      </Pressable>
      <TransparentView style={styles.body}>
        <PrimaryText text={title} style={styles.title} />
      </TransparentView>

      <TransparentView style={styles.right}></TransparentView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50
  },
  body: { flex: 1, alignItems: 'center' },
  left: { flex: 1 },
  right: { flex: 1 },
  title: {
    fontSize: 20
  }
});
