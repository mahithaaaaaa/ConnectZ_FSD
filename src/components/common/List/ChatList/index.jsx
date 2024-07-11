import React, { useEffect, useState } from 'react';
import "./index.scss";
import { useUserStore } from '../../../../ZusStores/UserStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';
import AddUser from '../AddUser';
import { useChatStore } from '../../../../ZusStores/ChatStore';

function ChatList() {

    const [addMode, setAddMode] = useState(false);
    const [chats,setChats] = useState([]);
    const [input, setInput] = useState("");

    const {currentUserstore} = useUserStore();
    const {changeChat} = useChatStore();

    const handleSelect = async (chat) => {
        
        const userChats = chats.map((item) => {
            const {user, ...rest} = item;
            return rest;
        });

        const chatIndex = userChats.findIndex((item) => item.chatID ===  chat.chatID);

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(firestore,"userChats",currentUserstore.userID);

        try{
            await updateDoc(userChatsRef,{
                chats: userChats,
            });
            changeChat(chat.chatID, chat.user);
        }
        catch(err){
            console.log(err);
        }
    };

    const filteredChats = chats.filter((item) => item.user.name.toLowerCase().includes( input.toLowerCase()));

    useEffect(() => {
        const unSub = onSnapshot(doc(firestore,"userChats", currentUserstore.userID), async (res) => {
            const items = res.data().chats;
            const promisses = items.map(async (item) => {
                const docRef = doc(firestore,"users",item.receiverID);
                const docSnap = await getDoc(docRef);

                const user = docSnap.data();

                return {...item, user};
            }) 
            const chatData = await Promise.all(promisses);
            setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }
    }, [currentUserstore.userID]);

    return (
        <div className='chat-list' id='scrollbar'>
            <div className='search'>
                <div className='search-bar'>
                    <img src="src/assets/search.png" alt="" />
                    <input type="text" placeholder='Search...' onChange={(event) => setInput(event.target.value)} />
                </div>
                <img 
                    src={addMode ? "src/assets/minus.png" : "src/assets/plus.png"} 
                    alt=""
                    className='add'
                    onClick={() => setAddMode((prev) => !prev)} 
                />
            </div>

            {filteredChats.map((chat) => (
                <div className='item' key={chat.chatID} onClick={()=>handleSelect(chat)} style={{backgroundColor: chat.isSeen ? "transparent" : "#5183fe"}} >
                <img src={chat.user.blocked.includes(currentUserstore.userID) ? "src/assets/avatar.png" : chat.user.imageLink} alt="" />
                <div className='text'>
                    <span>{chat.user.blocked.includes(currentUserstore.userID) ? "User" : chat.user.name}</span>
                    <p>{chat.lastMessage} - <span className='last-time'>{new Date(chat.updatedAt).toLocaleString()}</span></p>
                </div>
                </div>
            ))}
            {addMode&&<AddUser/>}
        </div>
    )
}

export default ChatList;
