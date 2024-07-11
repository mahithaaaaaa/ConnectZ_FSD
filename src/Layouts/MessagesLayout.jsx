import React, { useMemo,useState } from 'react';
import Topbar from '../components/common/Topbar'
import Messages from "../Pages/Messages";
import { getCurrentUser } from '../api/FirestoreApi';

export default function MessagesLayout() {
  const [currentUser,setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  },[])
  return (
    <div>
        <Topbar currentUser = {currentUser} />
        <Messages currentUser = {currentUser} />
    </div>
  )
}
