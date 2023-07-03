import { Button } from 'components/molecules/ButtonComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text, TextInput, useThemeColor } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  useCreateMessageMutation,
  useGetMessagesForEntityIdQuery
} from 'reduxStore/services/api/messages';
import { MessageResponse } from 'types/messages';
import { useGetMessagesForTaskIdQuery } from '../../reduxStore/services/api/messages';

const useMessageStyles = () => {
  const userBackgroundColor = useThemeColor({}, 'mediumGrey');
  const userTextColor = useThemeColor({}, 'white');
  const otherTextColor = useThemeColor({}, 'white');
  const otherBackgroundColor = useThemeColor({}, 'lightBlue');
  return StyleSheet.create({
    message: { padding: 5, marginBottom: 2 },
    userMessage: {
      alignItems: 'flex-end',
      marginLeft: 30
    },
    userMessageText: {
      backgroundColor: userBackgroundColor,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      overflow: 'hidden',
      color: userTextColor
    },
    otherMessage: { backgroundColor: otherBackgroundColor },
    otherMessageText: {
      color: otherTextColor,
      marginRight: 30
    }
  });
};

const Message = ({ message }: { message: MessageResponse }) => {
  const { data: userDetails } = useGetUserFullDetails();
  const messageStyles = useMessageStyles();

  if (!userDetails) {
    return null;
  }

  const isUserMessage = userDetails.id === message.user;

  return (
    <TransparentView
      style={[
        messageStyles.message,
        isUserMessage ? messageStyles.userMessage : messageStyles.otherMessage
      ]}
    >
      <Text
        style={[
          isUserMessage
            ? messageStyles.userMessageText
            : messageStyles.otherMessageText
        ]}
      >
        {message.text}
      </Text>
    </TransparentView>
  );
};

const styles = StyleSheet.create({
  sendInput: {
    marginRight: 10,
    flexGrow: 1,
    height: '100%'
  },
  sendInputPair: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  }
});

export type Props = {
  entityId?: number;
  taskId?: number;
};
export default function MessageThread({ entityId, taskId }: Props) {
  const { data: entityMessages } = useGetMessagesForEntityIdQuery(
    entityId || -1,
    {
      skip: !entityId
    }
  );

  const { data: taskMessages } = useGetMessagesForTaskIdQuery(taskId || -1, {
    skip: !taskId
  });
  const [createMessage, createMessageResult] = useCreateMessageMutation();

  const { data: userDetails } = useGetUserFullDetails();

  const [newMessage, setNewMessage] = useState('');
  const { t } = useTranslation();

  const messages = entityMessages || taskMessages;
  if (!messages || !userDetails) {
    return null;
  }

  return (
    <TransparentContainerView>
      <TransparentFullPageScrollView>
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}
      </TransparentFullPageScrollView>
      <TransparentView style={styles.sendInputPair}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.sendInput}
        />
        {createMessageResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <Button
            title={t('components.messageThread.send')}
            onPress={async () => {
              setNewMessage('');
              await createMessage({
                text: newMessage,
                user: userDetails.id,
                entity: entityId || null,
                task: null
              }).unwrap();
            }}
          />
        )}
      </TransparentView>
    </TransparentContainerView>
  );
}
