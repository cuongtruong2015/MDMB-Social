import { sendMessage } from "app/actions/chat";
import { updateListConversationWithSentMessage } from "app/actions/conversations";
import { getListRelationship } from "app/actions/listRelationship";
import Swal from "sweetalert2";
export function ChangeNickname(dispatch, socket, Swal, user, Nickname, yourInfor, userApi) {

    var yourNickname;
    if (user?.RelatedAccountNickname === Nickname) yourNickname = user?.RelatingAccountNickname;
    else yourNickname = user?.RelatedAccountNickname;
    Swal.fire({
        title: 'Nickname',
        html:
            `
            <div>
            <img src="${yourInfor?.Avatar}" style="width:50px; height:50px; border-radius:50%; margin:auto">
            <input id="swal-input1" class="swal2-input" value="${yourNickname ? yourNickname : yourInfor?.Name}" placeholder="${yourNickname ? yourNickname : yourInfor?.Name}">
           </div>
            <div>
            <img src="${user?.Avatar}" style="width:50px; height:50px; border-radius:50%;">
            <input id="swal-input2" class="swal2-input" value="${Nickname ? Nickname : user?.Name}" placeholder="${Nickname ? Nickname : user?.Name}">
           </div>
           `,

        focusConfirm: false,
        preConfirm: async () => {
            let yourNicknameSet = document.getElementById('swal-input1').value.trim();
            let partnerNickname = document.getElementById('swal-input2').value.trim();

            if (yourNicknameSet.length > 45 || partnerNickname.length > 45)
                return Toast.fire({
                    icon: 'error',
                    title: 'Changed nickname failed, must be less than 45 letters!'
                })
            if ((yourNickname ? yourNickname : yourInfor?.Name) === yourNicknameSet && (Nickname ? Nickname : user?.Name) === partnerNickname) return;
            if (!((yourNickname ? yourNickname : yourInfor?.Name) === yourNicknameSet)) {
                let message = yourNicknameSet === "" ? yourInfor?.Name + "'s Nickname has removed " : yourInfor?.Name + "'s Nickname has changed to " + yourNicknameSet;
                socket?.emit('chat message', message, 4, user?.AccountId, (status, data) => {
                    if (status === 'ok' && +data.ToAccount === user?.AccountId) {
                        dispatch(sendMessage(data));
                        dispatch(updateListConversationWithSentMessage(data, 4));
                        dispatch(getListRelationship(yourInfor?.AccountId));
                    }
                });
            }
            if (!((Nickname ? Nickname : user?.Name) === partnerNickname)) {
                let message = partnerNickname === "" ? user?.Name + "'s Nickname has removed " : user?.Name + "'s Nickname has changed to " + partnerNickname;
                socket?.emit('chat message', message, 4, user?.AccountId, (status, data) => {
                    if (status === 'ok' && +data.ToAccount === user?.AccountId) {
                        dispatch(sendMessage(data));
                        dispatch(updateListConversationWithSentMessage(data, 4));
                        dispatch(getListRelationship(yourInfor?.AccountId));
                    }
                });
            }
            var RelatingAccountNickname, RelatedAccountNickname;
            if (user?.AccountId < yourInfor?.AccountId) {
                RelatingAccountNickname = partnerNickname === '' ? "RemoveThisValue$$$" : partnerNickname
                RelatedAccountNickname = yourNicknameSet === '' ? "RemoveThisValue$$$" : yourNicknameSet
            }
            else {
                RelatingAccountNickname = yourNicknameSet === '' ? "RemoveThisValue$$$" : yourNicknameSet
                RelatedAccountNickname = partnerNickname === '' ? "RemoveThisValue$$$" : partnerNickname
            }
            // console.log('changed nickname', RelatingAccountNickname, RelatedAccountNickname);

            await userApi
                .updateAccountRelationship({
                    RelatingAccountId: user.RelatingAccountId,
                    RelatedAccountId: user.RelatedAccountId,
                    RelatingAccountNickname,
                    RelatedAccountNickname
                })
                .then((rs) => {
                    if (rs?.result) {
                        dispatch(getListRelationship(yourInfor?.AccountId));
                        Toast.fire({
                            icon: 'success',
                            title: 'Changed nickname successfully!'
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    })
}
export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

export function handleNotification(Swal, dispatch, user, userApi, notification, partnerId) {
    Swal.fire({
        title: `Do you want to turn ${notification ? 'off' : 'on'} notification?`,
        showDenyButton: notification ? true : false,
        showConfirmButton: notification ? false : true,
        showCancelButton: true,
        confirmButtonText: 'Turn on',
        denyButtonText: `Turn off`,
    }).then(async (result) => {

        if (result.isConfirmed) {
            /* Turn on notificafion*/
            var noti = 0;
            const userNoti = user.Notification;
            if (+user.RelatingAccountId === +partnerId && userNoti == 1) noti = 0;
            if (+user.RelatingAccountId === +partnerId && userNoti == 2) noti = 2;
            if (+user.RelatedAccountId === +partnerId && userNoti == 2) noti = 0;
            if (+user.RelatedAccountId === +partnerId && userNoti == 1) noti = 1;
            if (+user.RelatingAccountId === +partnerId && userNoti == 3) noti = 2;
            if (+user.RelatedAccountId === +partnerId && userNoti == 3) noti = 1;
            await userApi
                .updateAccountRelationship({
                    RelatingAccountId: user.RelatingAccountId,
                    RelatedAccountId: user.RelatedAccountId,
                    Notification: noti,
                })
                .then((rs) => {
                    dispatch(
                        getListRelationship(
                            +user?.RelatingAccountId === +partnerId
                                ? user.RelatedAccountId
                                : user.RelatingAccountId
                        )
                    );
                    if (rs?.result)
                        Toast.fire({
                            icon: 'success',
                            title: 'Notification is on',
                        });
                }).catch((err) => {
                    console.log(err);
                });
        } else if (result.isDenied) {
            /* Turn off notificafion*/
            var noti = 3;
            const userNoti = user.Notification;
            if (+user.RelatingAccountId === +partnerId && userNoti == 0) noti = 1;
            if (+user.RelatedAccountId === +partnerId && userNoti == 0) noti = 2;
            if (+user.RelatingAccountId === +partnerId && userNoti == 2) noti = 3;
            if (+user.RelatedAccountId === +partnerId && userNoti == 1) noti = 3;
            await userApi
                .updateAccountRelationship({
                    RelatingAccountId: user.RelatingAccountId,
                    RelatedAccountId: user.RelatedAccountId,
                    Notification: noti,
                })
                .then((rs) => {
                    dispatch(
                        getListRelationship(
                            +user?.RelatingAccountId === +partnerId
                                ? user.RelatedAccountId
                                : user.RelatingAccountId
                        )
                    );
                    if (rs?.result)
                        Toast.fire({
                            icon: 'success',
                            title: 'Notification is off',
                        });
                }).catch((err) => {
                    console.log(err);
                });
        }
    });
}
export async function changeIcon(icon, user, userApi, dispatch, socket) {
    if (icon === user.ButtonIcon) return;
    await userApi.updateAccountRelationship({
        RelatingAccountId: user.RelatingAccountId,
        RelatedAccountId: user.RelatedAccountId,
        ButtonIcon: icon,
    }).then((rs) => {
        if (rs?.result) {
            let message = "Chat icon has changed to " + icon;
            socket?.emit('chat message', message, 4, user?.AccountId, (status, data) => {
                if (status === 'ok' && +data.ToAccount === user?.AccountId) {
                    dispatch(sendMessage(data));
                    dispatch(updateListConversationWithSentMessage(data, 4));
                    dispatch(getListRelationship(
                        +user?.RelatingAccountId === +user.AccountId
                            ? user.RelatedAccountId
                            : user.RelatingAccountId));
                }
            });
            Toast.fire({
                icon: 'success',
                title: 'Changed icon successfully!',
            })
        }
    });
}
export async function removeButtonIcon(icon, user, userApi, dispatch, socket) {
    await userApi.updateAccountRelationship({
        RelatingAccountId: user.RelatingAccountId,
        RelatedAccountId: user.RelatedAccountId,
        ButtonIcon: "RemoveThisValue$$$",
    }).then((rs) => {
        if (rs?.result) {
            let message = "Chat icon has removed";
            socket?.emit('chat message', message, 4, user?.AccountId, (status, data) => {
                if (status === 'ok' && +data.ToAccount === user?.AccountId) {
                    dispatch(sendMessage(data));
                    dispatch(updateListConversationWithSentMessage(data, 4));
                    dispatch(getListRelationship(
                        +user?.RelatingAccountId === +user.AccountId
                            ? user.RelatedAccountId
                            : user.RelatingAccountId));
                }
            });
            Toast.fire({
                icon: 'success',
                title: 'removed icon successfully!',
            })
        }
    });
}