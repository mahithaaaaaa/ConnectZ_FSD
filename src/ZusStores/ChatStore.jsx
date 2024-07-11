import { create } from 'zustand';
import { useUserStore } from "./UserStore";

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId,user) => {
        const currentUserstore = useUserStore.getState().currentUserstore;

        if(user.blocked.includes(currentUserstore.userID)){
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }

        else if(currentUserstore.blocked.includes(user.userID)){
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            })
        }
        else{
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            })
        }

    },

    changeBlock: () => {
        set(state => ({...state,isReceiverBlocked: !state.isReceiverBlocked}))
    },

}));