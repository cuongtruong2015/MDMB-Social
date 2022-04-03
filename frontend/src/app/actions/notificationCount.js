const getNotificationCountSuccess = ({chat,contact}) => {
    return {
        type: 'NOTIFICATION_COUNT',
        payload: {chat,contact},
    };
}
export const getNotificationCount = (chat,contact) => (dispatch) => {
    if (chat||contact) {
        dispatch(
            getNotificationCountSuccess(
                {chat,contact}
            )
        );
    } else {
        dispatch(getNotificationCountSuccess(0));
    }
};