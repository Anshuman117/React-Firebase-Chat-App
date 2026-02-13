import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const usechatStore = create((set) => ({
  chatsId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatsId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Check If Current User Is Blocked

    if (user.blocked?.includes(currentUser.id)) {
      return set({
        chatsId: null,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // Check If Reciever Is Blocked
    else if (currentUser.blocked?.includes(user.id)) {
      return set({
        chatsId: null,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatsId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
}));
