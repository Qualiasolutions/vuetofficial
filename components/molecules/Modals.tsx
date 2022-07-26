import React, { useEffect, useRef } from 'react';
import { Text, useThemeColor, View } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  GestureResponderEvent,
  Modal as DefaultModal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { AlmostBlackText, PageTitle, PrimaryText } from './TextComponents';
import {
  TransparentContainerView,
  TransparentView,
  WhiteBox,
  WhiteView
} from './ViewComponents';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../../constants/Colors';
import Search from './Search';
import Checkbox from 'components/molecules/Checkbox';

export type ModalProps = DefaultModal['props'] & { boxStyle?: ViewStyle };

export function Modal(props: ModalProps) {
  const { style, children, boxStyle, ...otherProps } = props;

  return (
    <DefaultModal animationType="fade" transparent={true} {...otherProps}>
      <View style={styles.opaqueBackground}></View>
      <TransparentContainerView>
        <WhiteBox style={boxStyle}>{children}</WhiteBox>
      </TransparentContainerView>
    </DefaultModal>
  );
}

type YesNoModalProps = ModalProps & {
  title?: string;
  question: string;
  onYes: (event: GestureResponderEvent) => void;
  onNo: (event: GestureResponderEvent) => void;
};

export function YesNoModal(props: YesNoModalProps) {
  const borderColor = useThemeColor({}, 'grey');
  const { t } = useTranslation();

  const { title, question, onYes, onNo, boxStyle, ...otherProps } = props;
  const titleView = title ? (
    <PrimaryText text={title} style={[styles.text, styles.yesNoTitle]} />
  ) : null;

  return (
    <Modal
      boxStyle={StyleSheet.flatten([styles.yesNoBoxStyle, boxStyle])}
      {...otherProps}
    >
      <TransparentView style={styles.textWrapper}>
        {titleView}
        <AlmostBlackText style={styles.text} text={question} />
      </TransparentView>
      <TransparentView style={[{ borderColor }, styles.yesNoButtons]}>
        <Pressable
          onPress={onYes}
          style={[{ borderColor }, styles.yesNoButton, styles.yesButton]}
        >
          <TransparentView>
            <AlmostBlackText text={t('common.yes')} />
          </TransparentView>
        </Pressable>
        <Pressable onPress={onNo} style={styles.yesNoButton}>
          <TransparentView>
            <AlmostBlackText text={t('common.no')} />
          </TransparentView>
        </Pressable>
      </TransparentView>
    </Modal>
  );
}

function DefaultListItemComponent ({ item, itemToName }: {
  item: any,
  itemToName: (item: any) => string
}){
  return (
    <TransparentView>
      <TransparentView>
        <Text> {itemToName(item)} </Text>
      </TransparentView>
    </TransparentView>
  )
}

export function ListingModal(props: ListingModalProps) {
  const bottomSheetRef = useRef<RBSheet>(null);
  const {
    visible,
    data = [],
    itemToName = item => item.name,
    onClose,
    onSelect,
    ListItemComponent = DefaultListItemComponent,
  } = props;

  useEffect(() => {
    if (visible) bottomSheetRef?.current?.open();
    else bottomSheetRef?.current?.close();
  }, [visible]);

  return (
    <RBSheet
      ref={bottomSheetRef}
      height={600}
      onClose={onClose}
      customStyles={{
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }
      }}
      dragFromTopOnly={true}
      closeOnDragDown={true}
    >
      <ScrollView>
        <WhiteView style={styles.bottomContainer}>
          <Search />
          <SafeAreaView>
            {data?.length > 0 &&
              data.map((item: any, index: Number) => {
                return (
                  <Pressable
                    style={styles.listItem}
                    key={`item_${item.id}_${item.name}_${index}`}
                    onPress={() => onSelect(item)}
                  >
                    <ListItemComponent item={item} itemToName={itemToName}/>
                  </Pressable>
                );
              })}
          </SafeAreaView>
        </WhiteView>
      </ScrollView>
    </RBSheet>
  );
}

type ListingModalProps = {
  visible: boolean;
  data: any;
  itemToName?: (item: any) => string
  onClose: () => void;
  onSelect: (category: any) => void;
  ListItemComponent?: React.ElementType;
};

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
    borderTopWidth: 1
  },
  yesNoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  yesButton: {
    borderRightWidth: 1
  },
  modalView: {
    flex: 1,
    padding: 0
  },
  bottomContainer: {
    width: '100%',
    padding: 23
  },
  listItem: {
    paddingVertical: 17,
    borderBottomColor: Colors['light'].disabledGrey,
    borderBottomWidth: 1
  }
})
