import { sendMessage } from "app/actions/chat";
import { updateListConversationWithSentMessage } from "app/actions/conversations";
import playMusicApi from "apis/playMusicApi";
export async function searchYoutubeData(message, roomId, socket, dispatch) {
  const searchKey = message.replace('!!play', '')
  const rs = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTOUBE}&q=${searchKey}&part=snippet&maxResults=5`
  );
  const data = await rs.json();
  const listVideo = [];
  var message = 'List music found ♪♫!\n'
  for (let i = 0; i < data.items.length; i++) {
    listVideo.push(data.items[i].id.videoId);
    const rs2 = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${process.env.REACT_APP_YOUTOUBE}&id=${data.items[i].id.videoId}&part=contentDetails&maxResults=5`
    );
    const data2 = await rs2.json()
    const duration = data2.items[0].contentDetails.duration;
    const time = duration.slice(2, duration.length).toLowerCase();
    if (!data2.items[0]) return;
    // message += `${i + 1}.  ${data.items[i].snippet.title} (${data.items[i]?.snippet?.publishTime?.split('T')[0]}) \n`
    message += `${i + 1}.  ${data.items[i].snippet.title} (${time}) \n`
  }
  if (message === 'List music found ♪♫!\n') message = 'No result found, please try to search again'
  socket?.emit('chat message', message,
    5,
    roomId, listVideo.toString(),
    (status, data) => {
      if (status === 'ok' && +data.ToAccount === +roomId) {
        dispatch(sendMessage(data));
        dispatch(updateListConversationWithSentMessage(data, 5));
      }
    }
  );
}
export async function playLastVideoListSearched(YourAccountId, message, roomId, socket, dispatch, notSendMessage) {
  const value = message.slice(7, message.length);
  const playlist = await playMusicApi.getLastedPlaylist(YourAccountId, roomId)
  if (!(notSendMessage === 1))
    socket?.emit('chat message', message,
      0,
      roomId, message,
      (status, data) => {
        if (status === 'ok' && +data.ToAccount === +roomId) {
          dispatch(sendMessage(data));
          dispatch(updateListConversationWithSentMessage(data, 5));
        }
      }
    );
  return playlist[value - 1];
}