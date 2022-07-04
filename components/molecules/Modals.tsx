import { Text, useThemeColor, View } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Modal as DefaultModal, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AlmostBlackText, PageTitle, PrimaryText } from './TextComponents';
import { TransparentContainerView, TransparentView, WhiteBox } from './ViewComponents';

export type ModalProps = DefaultModal['props'] & { boxStyle?: ViewStyle };

export function Modal(props: ModalProps) {
  const { style, children, boxStyle, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, 'white');
  const borderColor = useThemeColor({}, 'grey');

  return (
    <DefaultModal
      animationType="fade"
      transparent={true}
      {...otherProps}
    >
      <View style={styles.opaqueBackground}>
      </View>
      <TransparentContainerView>
        <WhiteBox style={boxStyle}>
          {children}
        </WhiteBox>
      </TransparentContainerView>
    </DefaultModal>
  );
}

type YesNoModalProps = ModalProps & {
  title?: string;
  question: string;
  onYes: (event: GestureResponderEvent) => void;
  onNo: (event: GestureResponderEvent) => void;
}

export function YesNoModal(props: YesNoModalProps) {
  const backgroundColor = useThemeColor({}, 'white');
  const borderColor = useThemeColor({}, 'grey');
  const { t } = useTranslation()

  const { title, question, onYes, onNo, boxStyle, ...otherProps } = props
  const titleView = title ? <PrimaryText text={title} style={[styles.text, styles.yesNoTitle]}/> : null

  return (
    <Modal boxStyle={StyleSheet.flatten([styles.yesNoBoxStyle, boxStyle])} {...otherProps}>
      <TransparentView style={styles.textWrapper}>
        {titleView}
        <AlmostBlackText style={styles.text} text={question}/>
      </TransparentView>
      <TransparentView style={[{ borderColor }, styles.yesNoButtons]}>
        <Pressable onPress={onYes} style={[{ borderColor }, styles.yesNoButton, styles.yesButton]}>
          <TransparentView>
            <AlmostBlackText text={t('common.yes')}/>
          </TransparentView>
        </Pressable>
        <Pressable onPress={onNo} style={styles.yesNoButton}>
          <TransparentView>
            <AlmostBlackText text={t('common.no')}/>
          </TransparentView>
        </Pressable>
      </TransparentView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  opaqueBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: '#000000',
    opacity: 0.5
  },
  textWrapper: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  },
  yesNoTitle: {
    fontSize: 16,
    marginBottom: 5
  },
  yesNoBoxStyle: {
    padding: 0
  },
  yesNoButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  yesNoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  yesButton: {
    borderRightWidth: 1
  }
})