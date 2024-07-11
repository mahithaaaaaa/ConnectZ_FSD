import { notification } from "antd";
import { firestore } from "../firebaseConfig";
import { addDoc,
        collection,
        onSnapshot,
        doc,
        updateDoc,
        query,
        where,
        setDoc,
        deleteDoc,
        getDoc,
        serverTimestamp,
        arrayUnion,
        arrayRemove} from "firebase/firestore"
import { toast } from "react-toastify";
import { getUniqueId } from "../helpers/getUniqueId";

let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentRef = collection(firestore,"comments");
let connectionsRef = collection(firestore,"connections");
let chatsRef = collection(firestore,"chats");
let userChatsRef = collection(firestore,"userChats");
let notificationsRef = collection(firestore,"notifications");

export const PostStatustoDB = (object) => {
    addDoc(postsRef, object)
    .then(() => {
        toast.success("Post created successfully!");
    })
    .catch((err) => {
        console.log(err);
    });
};

export const getStatus = (setAllStatus) => {
    onSnapshot(postsRef, (snapshot) => {
        setAllStatus(snapshot.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const getSingleStatus = (setAllStatus,id) => {
    const singlePostQuery = query(postsRef,where("userID", "==" ,id));
    onSnapshot(singlePostQuery, (response) => {
        setAllStatus(
            response.docs.map((docs) => {
                return {...docs.data(), id: docs.id};
            })
        );
    });
};

export const getSinglePostById = async (id, setPost) => {
    const postRef = doc(firestore,"posts",id);
    const postSnap = await getDoc(postRef);
    setPost({...postSnap.data(),id:id});
};

export const getAllUsers = (setAllUsers) => {
    onSnapshot(userRef, (snapshot) => {
        setAllUsers(snapshot.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })
        );
    });
};

export const getSingleUser = (setCurrentProfile,email) => {
    const singleUserQuery = query(userRef,where("email","==",email));
    onSnapshot(singleUserQuery, (response) => {
        setCurrentProfile(
            response.docs.map((docs) => {
                return {...docs.data(),id: docs.id}
            })[0]
        );
    });
};

export const postUserData = async (object) => {
    /* addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
        console.log(err);
    });  */
    await setDoc(doc(firestore,"users",object.userID),object);
    await setDoc(doc(firestore,"userChats",object.userID),{
        chats:[],
    });
    await setDoc(doc(firestore,"notifications",object.userID),{
        requests:[],
        notifications:[]
    });
};

export const getCurrentUser = (setCurrentUser) => {
    onSnapshot(userRef, (response) => {
        setCurrentUser(response.docs.map((docs) => {
                return { ...docs.data(), userId: docs.id };
            })
            .filter((items) => {
                return items.email === localStorage.getItem('userEmail');
            })[0]
        );
    });
};

export const editProfile = (userId, payload) => {
    let userToEdit = doc(userRef, userId);
    updateDoc(userToEdit,payload)
    .then(() => {
        toast.success("Profile updated successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
};

export const likePost = async (user, post, liked) => {
    try{
        const postId = post.id;
        const userId = user.userID;
        const check = (obj) => {
            if(obj.postID===postId){
                if(obj.targetId===userId){
                    if(obj.actionType==="Liked"){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    return true;
                }
            }
            else{
                return true;
            }
        }
        let docToLike = doc(likeRef, `${userId}_${postId }` );
        if(liked){
            deleteDoc(docToLike);
            const notiSnap = await getDoc(doc(notificationsRef,post.userID));
            const noti = notiSnap.data();
            console.log(noti);
            const newrequests = noti.notifications.filter(obj => check(obj));
            await updateDoc(doc(notificationsRef,post.userID),{
                notifications: newrequests,
            });
        }
        else{
            setDoc(docToLike, { userId, postId });
            await updateDoc(doc(notificationsRef,post.userID),{
                notifications:arrayUnion({
                  postID: postId,
                  notiID: getUniqueId(),
                  targetId: user.userID,
                  targetEmail: user.email,
                  targetName: user.name,
                  actionType:"Liked",
                  updatedAt: Date.now()
                }),
              });
        }
    }
    catch(err){
        console.log(err);
    }
};

export const getLikeByUser = (userId, postId,setLiked, setLikesCount) => {
    try{
        let likeQuery = query(likeRef,where('postId','==',postId));
        onSnapshot(likeQuery,(response) => {
            let likes = response.docs.map((doc)=> doc.data())
            let likesCount = likes.length

            const isLiked = likes.some((like) => like.userId === userId)
            
            setLikesCount(likesCount);
            setLiked(isLiked);
        })
    }
    catch(err){
        console.log(err);
    }
};

export const postComment = async (post, comment, timeStamp, user ) => {
    try{
        const postId = post.id;
        addDoc(commentRef,{ postId, comment, timeStamp, name:user.name, userID:user.userID, userEmail:user.email });
        await updateDoc(doc(notificationsRef,post.userID),{
            notifications:arrayUnion({
              postID: postId,
              notiID: getUniqueId(),
              targetId: user.userID,
              targetEmail: user.email,
              targetName: user.name,
              actionType:"Commented",
              text:comment,
              updatedAt: Date.now()
            }),
          });
    }
    catch(err){
        console.log(err);
    }
};

export const getComments = (postId, setComments) => {
    try{
        let singlePostQuery = query(commentRef, where("postId","==",postId));
        onSnapshot(singlePostQuery,(response) => {
            const comments = response.docs.map((doc) => {
                return { id: doc.id, ...doc.data(), }
            });
            setComments(comments);
        });
    } 
    catch(err){
        console.log(err);
    }
};

export const updatePost = (id, status, postImage) => {
    let postToUpdate = doc(postsRef, id);
    updateDoc(postToUpdate, { status, postImage })
    .then(() => {
        toast.success("Post updated successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
    
};

export const deletePost = async (post,id) => {
    const postId = post.id;
    let postToDelete = doc(postsRef, id);
    deleteDoc(postToDelete)
    .then(() => {
        toast.success("Post deleted successfully!");
    })
    .catch((err) => {
        console.log(err);
    }); 
    const notiSnap = await getDoc(doc(notificationsRef,post.userID));
    const noti = notiSnap.data();
    console.log(noti);
    const newrequests = noti.notifications.filter(obj => obj.postID !== postId);
    await updateDoc(doc(notificationsRef,post.userID),{
        notifications: newrequests,
    });

};

export const addConnection = async (userId, targetId) => {
    try{
        let connectionToAdd = doc(connectionsRef, `${userId}_${targetId }` );
        let connectionToAddagain = doc(connectionsRef, `${targetId}_${userId }` );
       
        await setDoc(connectionToAdd, { userId, targetId });
        await setDoc(connectionToAddagain, { userId : targetId , targetId : userId });

        const userNotiRef = doc(firestore,"notifications",userId);
        const userNotiSnap = await getDoc(userNotiRef);

        if(userNotiSnap.exists()) {
          const userNotiData = userNotiSnap.data();

          const notiIndex = userNotiData.requests.findIndex((c) => c.targetId ===  targetId);

          userNotiData.requests[notiIndex].accepted = "accepted";

          await updateDoc(userNotiRef,{
            requests: userNotiData.requests,
          });
        }


        const targetNotiRef = doc(firestore,"notifications",targetId);
        const targetNotiSnap = await getDoc(targetNotiRef);

        if(targetNotiSnap.exists()) {
          const targetNotiData = targetNotiSnap.data();

          const targetNotiIndex = targetNotiData.requests.findIndex((c) => c.targetId ===  userId);

          targetNotiData.requests[targetNotiIndex].accepted = "accepted";

          await updateDoc(targetNotiRef,{
            requests: targetNotiData.requests,
          });
        }

        toast.success("Connected Successfully!");
        
    }
    catch(err){
        console.log(err);
    }
};

export const rejectRequest = async (userId, targetId ) => {
    try{
        const userNotiRef = doc(firestore,"notifications",userId);
        const userNotiSnap = await getDoc(userNotiRef);

        if(userNotiSnap.exists()) {
          const userNotiData = userNotiSnap.data();

          const notiIndex = userNotiData.requests.findIndex((c) => c.targetId ===  targetId);

          userNotiData.requests[notiIndex].accepted = "rejected";

          await updateDoc(userNotiRef,{
            requests: userNotiData.requests,
          });
        }


        const targetNotiRef = doc(firestore,"notifications",targetId);
        const targetNotiSnap = await getDoc(targetNotiRef);

        if(targetNotiSnap.exists()) {
          const targetNotiData = targetNotiSnap.data();

          const targetNotiIndex = targetNotiData.requests.findIndex((c) => c.targetId ===  userId);

          targetNotiData.requests[targetNotiIndex].accepted = "rejected";

          await updateDoc(targetNotiRef,{
            requests: targetNotiData.requests,
          });
        }

    }
    catch(err){
        console.log(err);
    }
};

export const getConnections = (userId, targetId, setIsConnected ) => {
    try{
        let connectionQuery = query(connectionsRef,where('targetId','==',targetId));

        onSnapshot(connectionQuery,(response) => {
            let connections = response.docs.map((doc)=> doc.data());

            const isConnected = connections.some((connection) => connection.userId === userId);

            setIsConnected(isConnected);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const getConnectionedUsersId = (userId, setConnectedUsers ) => {
    try{
        let connectionQuery = query(connectionsRef,where('userId','==',userId));

        onSnapshot(connectionQuery,(response) => {
            let connections = response.docs.map((doc)=> {
                return {id: doc.id, ...doc.data(),}
            });

            setConnectedUsers(connections);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const findUserInChats = async (userId, targetId, setUserChat ) => {
    try{
        await onSnapshot(doc(firestore, "userChats", userId), (doc) => {
            const userChat = doc.data();
            const chat = userChat.chats.find((c) => c.receiverID === targetId );
            //console.log(chat);
            setUserChat(chat);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const addChatToChat = async (currentUser, currentProfile, setUserChat ) => {

    try{
      const newChatRef = doc(chatsRef);

      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: [],
      });

      setUserChat(newChatRef.id);
      
      await updateDoc(doc(userChatsRef,currentProfile.id),{
        chats:arrayUnion({
          chatID: newChatRef.id,
          lastMessage:"",
          receiverID: currentUser.userID,
          updatedAt: Date.now()
        }),
      });

      await updateDoc(doc(userChatsRef,currentUser.userID),{
        chats:arrayUnion({
          chatID: newChatRef.id,
          lastMessage:"",
          receiverID: currentProfile.id,
          updatedAt: Date.now()
        }),
      });
    }
    catch(err){
      console.log(err);
    }
    toast.success("Added Successfully to chats !");
};

export const getNotifications = async (userId,setNotifications) => {
    try{
        await onSnapshot(doc(firestore, "notifications", userId), (doc) => {
            const notifications = doc.data();
            setNotifications(notifications);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const addRequest = async (currentUser, target) => {
    try{

        const notiSnap = await getDoc(doc(notificationsRef,currentUser.userID));
        const noti = notiSnap.data();
        console.log(noti);
        const newrequests = noti.requests.filter(obj => obj.targetId !== target.userID);
        await updateDoc(doc(notificationsRef,currentUser.userID),{
            requests: newrequests,
          });

        const notiSnapa = await getDoc(doc(notificationsRef,target.userID));
        const notia = notiSnapa.data();
        console.log(notia);
        const newrequestsa = notia.requests.filter(obj => obj.targetId !== currentUser.userID);
        await updateDoc(doc(notificationsRef,target.userID),{
            requests: newrequestsa,
          });

        await updateDoc(doc(notificationsRef,currentUser.userID),{
            requests:arrayUnion({
              targetId: target.userID,
              targetEmail: target.email,
              targetName: target.name,
              received: false,
              accepted: "pending",
              updatedAt: Date.now()
            }),
          });
        await updateDoc(doc(notificationsRef,target.userID),{
            requests:arrayUnion({
              targetId: currentUser.userID,
              targetEmail: currentUser.email,
              targetName: currentUser.name,
              received: true,
              accepted: "pending",
              updatedAt: Date.now()
            }),
          });
        toast.success("Connection Request sent !");
    }
    catch(err){
        console.error(err);
    }
};

export const removeRequest = async (userId, targetId) => {
    try{
        const notiSnap = await getDoc(doc(notificationsRef,userId));
        const noti = notiSnap.data();
        console.log(noti);
        const newrequests = noti.requests.filter(obj => obj.targetId !== targetId);
        await updateDoc(doc(notificationsRef,userId),{
            requests: newrequests,
          });
    }
    catch(err){
        console.error(err);
    }
};


export const addNotificationsToAll = async (allUsers) => {
    allUsers.forEach(async (user) => {
        await setDoc(doc(firestore,"notifications",user.userID),{
            requests:[],
            notifications:[]
        });
    });
};

export const findRequest = async (userId, targetId, setRequest ) => {
    try{
        await onSnapshot(doc(firestore, "notifications", userId), (doc) => {
            const userChat = doc.data();
            const chat = userChat.requests.find((c) => c.targetId === targetId );
            //console.log(chat);
            setRequest(chat);
        });
    }
    catch(err){
        console.log(err);
    }
};

export const removeNotification = async (userId, notiId) => {
    try{
        const notiSnap = await getDoc(doc(notificationsRef,userId));
        const noti = notiSnap.data();
        console.log(noti);
        const newrequests = noti.notifications.filter(obj => obj.notiID !== notiId);
        await updateDoc(doc(notificationsRef,userId),{
            notifications: newrequests,
          });
    }
    catch(err){
        console.error(err);
    }
};
