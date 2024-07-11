import { useEffect, useState } from 'react';
import { getAllUsers, addRequest } from "../api/FirestoreApi";
import "../Sass/ConnectionsComponent.scss";
import ConnectedUsers from './common/ConnectedUsers';

export default function ConnectionsComponent({ currentUser }) {

  const [users, setUsers] = useState([]);

  const getCurrentUser = (currentProfile) => {
    addRequest(currentUser,currentProfile);
    //console.log(currentUser);
  };

  useEffect(() => {
    getAllUsers(setUsers);
  }, []);


  return (
    <div className='connections-main'>
        {users.map((user) => {
          return ( 
            <ConnectedUsers key={user.id} user={user} getCurrentUser={getCurrentUser} currentUser={currentUser} />
          );
        })}
    </div>
  );
}
