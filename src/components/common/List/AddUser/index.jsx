import './index.scss'
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../../api/FirestoreApi';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';
import {useUserStore} from "../../../../ZusStores/UserStore";

function AddUser(){

  const {currentUserstore} = useUserStore();

  const [allUsers,setAllUsers] = useState([]);
  const [searchInput,setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = () => {
    if (searchInput !== ''){
      let res = allUsers.filter((user) => {
        return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredUsers(res);
    }
    else{
      setFilteredUsers(allUsers);
    }
  };

  const handelAdd = async (user) => {
    const chatsRef = collection(firestore,"chats"); 
    const userChatsRef = collection(firestore,"userChats")

    try{
      const newChatRef = doc(chatsRef);

      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: [],
      });
      
      await updateDoc(doc(userChatsRef,user.id),{
        chats:arrayUnion({
          chatID: newChatRef.id,
          lastMessage:"",
          receiverID: currentUserstore.userID,
          updatedAt: Date.now()
        }),
      });

      await updateDoc(doc(userChatsRef,currentUserstore.userID),{
        chats:arrayUnion({
          chatID: newChatRef.id,
          lastMessage:"",
          receiverID: user.id,
          updatedAt: Date.now()
        }),
      });
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getAllUsers(setAllUsers);
    console.log(allUsers);
  }, [allUsers]);

  useEffect(() =>{
    let debounced = setTimeout(() => {
      handleSearch();
    },500);
    return () => clearTimeout(debounced);
  }, [searchInput]);

  return (
    <div className='addUser'>
        <form>
            <input type="text" placeholder='Username' name="username" onChange={(event) => setSearchInput(event.target.value)} />
            <img src="src/assets/search.png" alt="" />
        </form>

        {searchInput.length ===0 ? (<></>) : <div>
          {filteredUsers.length === 0 ? (<div className='search-result'>No results found!!!</div>) :
            filteredUsers.map((user) => (
            <div className="users" key={user.id}>
              <div className='details'>
                  <img src={user.imageLink} alt="" />
                  <span>{user.name}</span>
              </div>
              <button onClick={() => handelAdd(user)}>Add User</button>
            </div>
          ))}</div>
        }
    </div>
  )
}

export default AddUser; 