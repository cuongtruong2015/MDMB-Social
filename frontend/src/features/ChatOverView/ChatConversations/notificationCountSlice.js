const initialState = {
    notificationCount: { chat: 0, contact: 0 }
};
const notificationReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'NOTIFICATION_COUNT':
            const data = action.payload;
            const oldData = state.notificationCount;
            var result = { chat: 0, contact: 0 };
            if (data?.chat!=null && data?.chat!=null) return {
                ...state,
                notificationCount: data,
            };
            if (data?.chat) {
                result.chat = data.chat;
                result.contact = oldData.contact || 0;
            }
            if (data?.contact) {
                result.contact = data.contact;
                result.chat = oldData.chat || 0;
            }
            // if (data.chat==null && data.contact==null) result = oldData;
            return {
                ...state,
                notificationCount: result,
            };
        default:
            return state;

    }
};

export default notificationReducer;
