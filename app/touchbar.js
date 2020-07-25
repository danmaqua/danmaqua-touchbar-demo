const { TouchBar, nativeImage } = require('electron');
const { TouchBarLabel, TouchBarSpacer, TouchBarButton } = TouchBar;
const EventEmitter = require('events');

class TouchBarController extends EventEmitter {
    constructor(window) {
        super();
        this.window = window;
        this.welcomeLabel = new TouchBarLabel({ label: '关注 Telegram 频道 @danmaqua 获取更多 VTB 同传弹幕' });
        this.subtitleLabel = new TouchBarLabel({ textColor: '#FFFFFF' });
        this.touchBarSpacer = new TouchBarSpacer({ size: 'flexible' });
        this.changeFilterButton = new TouchBarButton({
            icon: nativeImage.createFromNamedImage('NSTouchBarQuickLookTemplate', [1, 1, 1]),
            click: () => this.emit('filter')
        });
        this.enterButton = new TouchBarButton({
            label: '进入直播',
            backgroundColor: '#0A84FF',
            click: () => this.emit('enter')
        });
    }

    setIndexBar() {
        this.window.setTouchBar(new TouchBar({
            items: [this.welcomeLabel, this.touchBarSpacer, this.enterButton]
        }));
    }

    setPlayerBar() {
        this.window.setTouchBar(new TouchBar({
            items: [this.subtitleLabel, this.touchBarSpacer, this.changeFilterButton]
        }));
    }

    updateSubtitle(text) {
        this.subtitleLabel.label = text;
    }
}

module.exports = TouchBarController;
