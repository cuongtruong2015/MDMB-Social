import { getListConversation } from 'app/actions/conversations';
import { getListRelationship } from 'app/actions/listRelationship';
import { getNotificationCount } from 'app/actions/notificationCount';
import { getConversations } from "app/selectors/conversations";
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { getAuth } from 'app/selectors/login';
import { notificationCountSelector } from "app/selectors/notificationCount";
import messageAudio from 'assets/audio/messengerSound.mp3';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";



export function SetNotification() {
    const AccountId = useSelector(getAuth)?.accountId;
    const listConversation = useSelector(getConversations);
    const listRelationship = useSelector(getListRelationshipSelector);
    const newListRelationship = listRelationship?.filter(
        (item) =>
            (item.Type === 'rsendpending' && item.RelatedAccountId !== AccountId) ||
            (item.Type === 'lsendpending' && item.RelatingAccountId !== AccountId)
    );

    var notificationChat = 0;
    const dispatch = useDispatch();
    listConversation.forEach((item) => {
        if (item.UnseenMessage != null) notificationChat += item.UnseenMessage;
    });
    const notification = useSelector(notificationCountSelector);
    if (notification.chat + notification.contact != 0)
        document.title = `MDMB Social (${notification.chat + notification.contact
            })`;
    else document.title = `MDMB Social`;

    var audio = new Audio(messageAudio);
    if (notificationChat > notification.chat) {
        audio.play();
    }
    React.useEffect(() => {
        dispatch(getNotificationCount(notificationChat, newListRelationship.length));
    }, [notificationChat,newListRelationship.length]);
    React.useEffect(() => {
        dispatch(getListConversation(AccountId));
        dispatch(getListRelationship(AccountId));
    }, []);
    // console.log(notification)
}