const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

const roomInput = document.querySelector("#roomInput");
const goButton = document.querySelector("#goButton");

ipcRenderer.on('goButton', requestGoRoom);

function requestGoRoom() {
    const value = roomInput.value;
    if (!value || value.length <= 0 || isNaN(Number(value))) {
        dialog.showMessageBox({
            title: '无法加入房间',
            message: '你输入的房间号码不正确，请检查是否为有效数字。'
        });
        return;
    }
    localStorage.setItem('last_room', value);
    ipcRenderer.send('goRoom', value);
}

function main() {
    goButton.addEventListener("click", requestGoRoom);
    const lastRoom = localStorage.getItem('last_room');
    if (lastRoom) {
        roomInput.value = lastRoom;
    }
}

main();
