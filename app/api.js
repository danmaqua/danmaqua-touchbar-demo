const fetch = require('node-fetch');

const getLivePlayUrl = async (roomId) => {
    const response = await fetch(
        'https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + roomId,
        {
            cache: 'no-cache',
            headers: {
                'Referer': 'https://live.bilibili.com/' + roomId,
            },
            mode: 'cors'
        });
    return await response.json();
};

module.exports = {
    getLivePlayUrl
};
