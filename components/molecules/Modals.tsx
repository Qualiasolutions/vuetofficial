import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, useThemeColor, View } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  GestureResponderEvent,
  Modal as DefaultModal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { AlmostBlackText, PrimaryText } from './TextComponents';
import {
  TransparentContainerView,
  TransparentView,
  WhiteBox,
  WhiteView
} from './ViewComponents';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../../constants/Colors';
import Search from './Search';
import { Feather } from '@expo/vector-icons';
import SafePressable from './SafePressable';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  opaqueBackground: {
    color: '#000000',
    opacity: 0.8
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
    padding: 0,
    overflow: 'hidden'
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
  }
});

const listingModalStyles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    padding: 23
  },
  listItem: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: Colors.light.disabledGrey,
    borderBottomWidth: 1
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionHeaderText: {
    fontSize: 20
  },
  sectionHeaderFeather: {
    marginRight: 20
  },
  section: {
    marginTop: 10,
    marginBottom: 10
  }
});

export type ModalProps = DefaultModal['props'] & { boxStyle?: ViewStyle };

export function Modal(props: ModalProps) {
  const { children, boxStyle, onRequestClose, ...otherProps } = props;

  return (
    <DefaultModal
      animationType="fade"
      transparent={true}
      onRequestClose={onRequestClose}
      {...otherProps}
    >
      <TransparentContainerView>
        <SafePressable
          style={[styles.background, styles.opaqueBackground]}
          onPress={onRequestClose}
        >
          <View style={[styles.background, styles.opaqueBackground]} />
        </SafePressable>
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
        <SafePressable
          onPress={onYes}
          style={({ pressed }) => [
            {
              borderColor,
              backgroundColor: pressed ? borderColor : ''
            },
            styles.yesNoButton,
            styles.yesButton
          ]}
        >
          <TransparentView>
            <AlmostBlackText text={t('common.yes')} />
          </TransparentView>
        </SafePressable>
        <SafePressable
          onPress={onNo}
          style={({ pressed }) => [
            {
              borderColor,
              backgroundColor: pressed ? borderColor : ''
            },
            styles.yesNoButton
          ]}
        >
          <TransparentView>
            <AlmostBlackText text={t('common.no')} />
          </TransparentView>
        </SafePressable>
      </TransparentView>
    </Modal>
  );
}

const defaultListItemStyles = StyleSheet.create({
  container: { paddingVertical: 6 }
});

function DefaultListItemComponent({
  item,
  itemToName
}: {
  item: any;
  itemToName: (item: any) => string;
}) {
  return (
    <TransparentView>
      <TransparentView style={defaultListItemStyles.container}>
        <Text> {itemToName(item)} </Text>
      </TransparentView>
    </TransparentView>
  );
}

export function ListingModal(props: ListingModalProps) {
  const bottomSheetRef = useRef<RBSheet>(null);
  const {
    visible,
    sectionSettings,
    data = {},
    itemToName = (item) => item.name,
    onClose = () => {},
    onSelect,
    ListItemComponent = DefaultListItemComponent
  } = props;

  const initialMinimisedSettings = useMemo<{ [key: string]: boolean }>(() => {
    const settings: { [key: string]: boolean } = {};
    for (const sectionName in sectionSettings) {
      settings[sectionName] =
        sectionSettings[sectionName].minimisable &&
        !sectionSettings[sectionName].initOpen;
    }
    return settings;
  }, [sectionSettings]);
  const [minimisedSettings, setMinimisedSettings] = useState<{
    [key: string]: boolean;
  }>(initialMinimisedSettings);

  useEffect(() => {
    if (visible) bottomSheetRef?.current?.open();
    else bottomSheetRef?.current?.close();
  }, [visible]);

  const sections = Object.keys(data).map((sectionName) => {
    if (data[sectionName].length === 0) return null;
    const sectionHeader =
      sectionSettings && sectionSettings[sectionName] ? (
        <SafePressable
          onPress={() => {
            if (sectionSettings && sectionSettings[sectionName].minimisable) {
              setMinimisedSettings({
                ...minimisedSettings,
                [sectionName]: !minimisedSettings[sectionName]
              });
            }
          }}
        >
          <TransparentView style={listingModalStyles.sectionHeader}>
            <AlmostBlackText
              text={sectionName}
              style={listingModalStyles.sectionHeaderText}
            />
            {sectionSettings && sectionSettings[sectionName].minimisable ? (
              minimisedSettings[sectionName] ? (
                <Feather
                  name="chevron-down"
                  size={25}
                  style={listingModalStyles.sectionHeaderFeather}
                />
              ) : (
                <Feather
                  name="chevron-up"
                  size={25}
                  style={listingModalStyles.sectionHeaderFeather}
                />
              )
            ) : null}
          </TransparentView>
        </SafePressable>
      ) : null;
    const memberRows = data[sectionName].map((item) => {
      return (
        <SafePressable
          style={listingModalStyles.listItem}
          key={item.id}
          onPress={() => onSelect(item)}
        >
          <ListItemComponent item={item} itemToName={itemToName} />
        </SafePressable>
      );
    });
    return (
      <TransparentView key={sectionName} style={listingModalStyles.section}>
        {sectionHeader}
        {minimisedSettings[sectionName] ? null : memberRows}
      </TransparentView>
    );
  });

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
        <WhiteView style={listingModalStyles.bottomContainer}>
          {/* <Search /> */}
          <SafeAreaView>{sections}</SafeAreaView>
        </WhiteView>
      </ScrollView>
    </RBSheet>
  );
}

type ListingModalSectionSettings = {
  minimisable: boolean;
  initOpen?: boolean;
};

type ListingModalProps = {
  visible: boolean;
  data: {
    [key: string]: any[];
  };
  sectionSettings?: { [key: string]: ListingModalSectionSettings };
  itemToName?: (item: any) => string;
  onClose?: () => void;
  onSelect: (item: any) => void;
  ListItemComponent?: React.ElementType;
};
