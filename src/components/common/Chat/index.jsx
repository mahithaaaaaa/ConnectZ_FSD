import { useEffect, useRef, useState } from 'react';
import "./index.scss";
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useChatStore } from '../../../ZusStores/ChatStore';
import { useUserStore } from '../../../ZusStores/UserStore';
import { uploadChatImage } from '../../../api/ImageUpload';
import { useNavigate } from 'react-router-dom';

function Chat() {

  const navigate = useNavigate();

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [image, setImage] = useState({
    file:null,
    url:"",
  });
  const [chat,setChat] = useState()
  const endRef = useRef(null);

  const {chatId,user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
  const {currentUserstore} = useUserStore();

  const handleEmojiClick = (event) => {
    setChatText(prev => prev + event.emoji);
    setEmojiOpen(false);
  };

  const handleSend = async () => {
    if(chatText === "") return ;

    let imageUrl = null;

    try{

      if(image?.file){
        imageUrl = await uploadChatImage(image.file); 
      }

      await updateDoc(doc(firestore,"chats",chatId),{
        messages: arrayUnion({
          senderId: currentUserstore.userID,
          text:chatText,
          createdAt: new Date(),
          ...(imageUrl && {imageURL:imageUrl}),
        }),
      });

      const userIds = [currentUserstore.userID,user.userID];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(firestore,"userChats",id);
        const userChatsSnap = await getDoc(userChatsRef);

        if(userChatsSnap.exists()) {
          const userChatsData = userChatsSnap.data();

          const chatIndex = userChatsData.chats.findIndex((c) => c.chatID ===  chatId);

          userChatsData.chats[chatIndex].lastMessage = chatText;
          userChatsData.chats[chatIndex].isSeen = id === currentUserstore.userID ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef,{
            chats: userChatsData.chats,
          });
        }
      })

    }
    catch(err){
      console.log(err);
    }

    setImage({
      file: null,
      url: "",
    });

    setChatText('');

  };

  const handleImage = (e) => {
    if(e.target.files[0]){
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(firestore,"chats",chatId),(res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  console.log(chat);

  return (
    <div className='chat'>
        <div className='top'>
          <div className='user'>
            <img 
              src={user?.imageLink || "src/assets/avatar.png"} 
              alt="" 
              onClick={() =>
                navigate("/profile", {
                  state: { id: user.userID, email: user.email },
                })
              }
            />
            <div className='texts'>
              <h4 
                onClick={() =>
                  navigate("/profile", {
                    state: { id: user.userID, email: user.email },
                  })
                }
              >{user?.name || "User"}</h4>
              {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
            </div>
          </div>
          <div className='icons'>
            {/* <img src="src/assets/phone.png" alt="" />
            <img src="src/assets/video.png" alt="" />
            <img src="src/assets/info.png" alt="" /> */}
          </div>
        </div>

        <div className='center' id='scrollbar'>

          {chat?.messages?.map(message => (
            <div className={message.senderId === currentUserstore.userID ? "message own" : "message"} key={message?.createdAt}>
              <div className='texts'>
              {message.imageURL && <img src={message.imageURL} alt="" /> }
                <p>{message.text}</p>
                <span>{new Date(message.createdAt.seconds*1000 + message.createdAt.nanoseconds/1000000).toLocaleString()}</span>
              </div>
          </div>
          ))}

          {image.url && <div className='message own'>
            <div className='texts'>
              <img src={image.url} alt="" />
            </div>
          </div>}

          <div ref={endRef}></div>
        </div>

        <div className='bottom'>
          <div className='icons'>
            
            <label htmlFor="file">
              <img src="src/assets/img.png" alt="" />
            </label>
            <input type="file" id='file' style={{display:"none"}} onChange={handleImage} />
            {/* <img src="src/assets/camera.png" alt="" />
            <img src="src/assets/mic.png" alt="" /> */}
          </div>
          <input 
            type="text" 
            placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send message" : 'Type a message...' }
            onChange={(event) => setChatText(event.target.value)} 
            value={chatText}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <div className='emoji'>
            <img src="src/assets/emoji.png" alt="" onClick={() => setEmojiOpen(prev => !prev)} />
            <div className='picker'>
              <EmojiPicker open={emojiOpen} onEmojiClick={handleEmojiClick}/>
            </div>
          </div>
          <button className='SendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
        </div>
    </div>
  )
}

export default Chat;
