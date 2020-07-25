const { ipcRenderer } = require('electron');
const { dialog, BrowserWindow } = require('electron').remote;
const api = require('../api');
const { KeepLiveWS } = require('bilibili-live-ws');
const DPlayer = require('dplayer');

const pattern = /(?<who>^[^【]{0,5})(【)(?<text>[^【】]+)([】]?)/;

const playerTopArea = document.querySelector('#player-top-area');
const playerContainer = document.querySelector('#player-container');

let roomId;
let dplayer;
let enabledFilter = true;

ipcRenderer.on('filter', () => {
    enabledFilter = !enabledFilter;
    setSubtitle(enabledFilter ? '已切换至仅显示同传弹幕模式，正在等候同传' : '已切换至显示所有弹幕');
});

const setSubtitle = (text) => ipcRenderer.send('setSubtitle', text);

async function main() {
    playerTopArea.addEventListener('dblclick', () => {
        const window = BrowserWindow.getFocusedWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    });

    roomId = Number(/roomId=(\d+)/.exec(global.location.search)[1]);

    const playData = await api.getLivePlayUrl(roomId);
    let playUrl;
    try {
        playUrl = playData.data.durl[playData.data.current_quality].url;
    } catch (e) {
        dialog.showMessageBoxSync({
            title: '无法打开直播',
            message: '获取直播地址失败，你所打开的房间可能不在直播状态。'
        });
        ipcRenderer.send('exit');
        return;
    }

    dplayer = new DPlayer({
        container: playerContainer,
        live: true,
        video: {
            url: playUrl,
            type: 'flv'
        },
        danmaku: true
    });
    dplayer.on('loadedmetadata', () => dplayer.play());
    dplayer.on('ended', () => loadNext());

    setSubtitle(`你已经进入房间 ${roomId}`);

    let live = new KeepLiveWS(roomId);
    live.on('DANMU_MSG', (msg) => {
        const dmInfo = msg['info'];
        const dmSenderInfo = dmInfo[2];
        const dmSenderUsername = dmSenderInfo[1];
        const dmText = dmInfo[1];
        dplayer.danmaku.draw({
            text: dmText
        });
        if (!enabledFilter || pattern.test(dmText)) {
            setSubtitle(`${dmSenderUsername}：${dmText}`);
        }
    });
}

async function loadNext() {
    console.log('Load next');
    const playData = await api.getLivePlayUrl(roomId);
    let playUrl;
    try {
        playUrl = playData.data.durl[playData.data.current_quality].url;
    } catch (e) {
        dialog.showMessageBoxSync({
            title: '无法打开直播',
            message: '获取直播地址失败，你所打开的房间可能不在直播状态。'
        });
        ipcRenderer.send('exit');
        return;
    }
    dplayer.switchVideo({
       url: playUrl,
       type: 'flv'
    });
}

main().catch((e) => {
    dialog.showMessageBoxSync({
        title: '无法打开直播',
        message: '错误信息：' + e
    });
    ipcRenderer.send('exit');
});
