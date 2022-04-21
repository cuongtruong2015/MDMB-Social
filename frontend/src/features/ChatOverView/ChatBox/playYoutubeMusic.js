import { sendMessage } from "app/actions/chat";
import { updateListConversationWithSentMessage } from "app/actions/conversations";

export async function searchYoutubeData(message, roomId, socket, dispatch) {
  const searchKey = message.replace('!!play', '')
  const rs = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD42QBJSa1Uxp_0LA3lrvS7GG0ZA8aSr2A&q=${searchKey}&part=snippet&maxResults=5`
  );
  const data = await rs.json()
  const listVideo = [];
  var message = 'List music found ♪♫!\n'
  for (let i = 0; i < data.items.length; i++) {
    listVideo.push(data.items[i].id.videoId);
    message += `${i + 1}.  ${data.items[i].snippet.title} (${data.items[i]?.snippet?.publishTime?.split('T')[0]}) \n`
  }
  if (message === 'List music found ♪♫!\n') message = 'No result found, please try to search again'
  socket?.emit('chat message', message,
    5,
    roomId, listVideo.toString,
    (status, data) => {
      if (status === 'ok' && +data.ToAccount === +roomId) {
        dispatch(sendMessage(data));
        dispatch(updateListConversationWithSentMessage(data, 5));
      }
    }
  );
}
export async function playLastVideoListSearched(message, roomId, socket, dispatch) {
  const value = message.slice(7, message.length)
}