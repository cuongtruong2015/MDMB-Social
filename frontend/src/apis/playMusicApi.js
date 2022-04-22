import axiosClient from 'apis/axiosClient';

const playMusicApi = {

    getLastedPlaylist: (accountId, friendId) => {
        const url = `/music/get-lasted-playlist?accountId=${accountId}&friendId=${friendId}`;
        return axiosClient.get(url);
    },
};

export default playMusicApi;
