import "./index.scss";
import { useChatStore } from "../../../ZusStores/ChatStore";
import { useUserStore } from "../../../ZusStores/UserStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Details() {

  const navigate = useNavigate();

  const {user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
  const {currentUserstore} = useUserStore();

  const handleBlock = async () => {
    if(!user) return;

    const userDocRef = doc(firestore,"users",currentUserstore.userID); 

    try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.userID) : arrayUnion(user.userID),
      });
      changeBlock();
    }
    catch(err){
      console.log(err);
    }

  };

  return ( 
    <div className="details" id="scrollbar">
      <div className="user">
        <img
          src={user?.imageLink || "src/assets/avatar.png"} 
          alt="" 
          onClick={() =>{
            navigate("/profile", {
              state: { id: user.userID, email: user.email },
            })
            console.log(user);
          }
          }
        />
        <h2
          onClick={() =>
            navigate("/profile", {
              state: { id: user.userID, email: user.email },
            })
          } 
        >{user?.name || "User"}</h2>
        <p>{user?.headline || "-" }</p>
      </div>
      <div className="info-outer">
        <div className="info">
          <div className="option">
            <div className="title">
              <p><b>Location:</b> {user?.location || "-"}</p>
              {/* <span>Chat Settings</span>
              <img src="src/assets/arrowUp.png" alt="" /> */}
            </div>
          </div>
          <div className="option">
            <div className="title">
            <p><b>Domain:</b> {user?.industry || "-"}</p>
              {/* <span>Privacy & Help</span>
              <img src="src/assets/arrowUp.png" alt="" /> */}
            </div>
          </div>
          <div className="option">
            <div className="title">
              <p><b>College:</b> {user?.college || "-"}</p>
              {/* <span>Shared Photos</span>
              <img src="src/assets/arrowUp.png" alt="" /> */}
            </div>
            <div className="photos">
              {/* <div className="photoItem">
                <div className="photoDetails">
                  <img src="src/assets/avatar.png" alt="" />
                  <span>photo_name.png</span>
                </div>
                <img src="src/assets/download.png" alt="" />
              </div> */}
            </div>
          </div>
        </div>  
      </div>
      <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
    </div>
  );
}

export default Details;
