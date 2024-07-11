import { useMemo,useState } from 'react';
import Topbar from '../components/common/Topbar'
import Notifications from "../Pages/Notifications"
import { getCurrentUser } from '../api/FirestoreApi';

export default function ConnectionsLayout() {
  const [currentUser,setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  },[])
  return (
    <div>
        <Topbar currentUser = {currentUser} />
        <Notifications currentUser = {currentUser} />
    </div>
  )
}