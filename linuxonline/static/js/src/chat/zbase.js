class AlinuxonlineChat {
    constructor(root) {
        this.root = root;
        this.$chat = $(`
            <div class="alinuxonline_chat">TyuChat</div>
            `);

        this.hide(); // chat界面先隐藏
        this.root.$alinuxonline.append(this.$chat);

        this.start();
    }

    start() {
    }

    show() { // 打开TyuChat界面
        this.$chat.show();
    }

    hide() { // 关闭TyuChat界面
        this.$chat.hide();
    }
}
