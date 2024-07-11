import React from 'react';
import "./index.scss";
import UserInfo from './UserInfo';
import ChatList from './ChatList';

function List() {
  return (
    <div className='list'>
        <UserInfo />
        <ChatList />
    </div>
  )
}

export default List;
