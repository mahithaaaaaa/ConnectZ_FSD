import React from 'react';
import "../Sass/MessagesComponent.scss";
import List from "./common/List";
import Chat from "./common/Chat";
import Details from "./common/Details";
import { useChatStore } from '../ZusStores/ChatStore';

function MessagesComponent({currentUser}) {

  const {chatId} = useChatStore();

  return (
    <div className='messages-main'>
        <List />
        {chatId && <Chat />}
        {chatId && <Details />}
    </div>
  )
}

export default MessagesComponent;
