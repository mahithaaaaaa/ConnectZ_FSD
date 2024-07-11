import { storage } from "../firebaseConfig";
import {ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { editProfile } from "./FirestoreApi";

export const uploadImageApi = (file, id, setModalOpen, setProgress, setCurrentImage) => {
    const profilePicsRef = ref(storage, `profileImages/${file.name}`);
    const uploadTask = uploadBytesResumable(profilePicsRef, file);

    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(progress);
        },
        (error) => {
            console.log(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((response) => {
                editProfile(id, { imageLink: response } );
                setCurrentImage({});
                setModalOpen(false);
            });
        }
    );
};

export const uploadPostImageApi = (file, setPostImage, setProgress) => {
    const postPicsRef = ref(storage, `postImages/${file.name}`);
    const uploadTask = uploadBytesResumable(postPicsRef, file);

    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(progress);
        },
        (error) => {
            console.log(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((response) => {
                //editPost(id, { imageLink: response } );
                setPostImage(response);
            });
        }
    );
};

export const uploadChatImage = async (file) => {

    const date = new Date();
    const storageRef = ref(storage, `chatImages/${date+file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.log(error);
            reject("Something went wrong!" + error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
        }
        );
    });
};