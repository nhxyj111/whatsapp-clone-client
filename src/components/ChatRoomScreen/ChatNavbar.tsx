import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { History } from 'history';
// import { ChatQueryResult } from './index';
import { useRemoveChatMutation } from '../../graphql/types';
import { eraseChat } from '../../services/cache.service';

const Container = styled(Toolbar)`
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: var(--primary-bg);
  color: var(--primary-text);
`;

const BackButton = styled(Button)`
  svg {
    color: var(--primary-text);
  }
`;

const Rest = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Picture = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 3px;
  margin-left: -22px;
  object-fit: cover;
  padding: 5px;
  border-radius: 50%;
`;

const Name = styled.div`
  line-height: 56px;
`;

const DeleteButton = styled(Button)`
  color: var(--primary-text) !important;
`;

export const removeChatMutation = gql`
  mutation RemoveChat($chatId: ID!) {
    removeChat(chatId: $chatId)
  }
`;

interface ChatNavbarProps {
  history: History;
  chat: {
    picture?: string | null;
    name?: string | null;
    id: string;
  };
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ chat, history }) => {
  const [removeChat] = useRemoveChatMutation({
    variables: {
      chatId: chat.id,
    },
    update: (client, { data: { removeChat } }) => {
      eraseChat(client, removeChat);
    }
  });

  const handleRemoveChat = useCallback(() => {
    removeChat().then(() => {
      history.replace('/chats')
    })
  }, [removeChat, history]);

  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  return (
    <Container>
      <BackButton onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      {chat && chat.picture && chat.name && (
        <>
          <Picture src={chat.picture} />
          <Name>{chat.name}</Name>
        </>
      )}
      <Rest>
        <DeleteButton onClick={handleRemoveChat}>
          <DeleteIcon />
        </DeleteButton>
      </Rest>
    </Container>
  );
};

export default ChatNavbar;