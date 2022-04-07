class AlinuxonlineIde {
    constructor(root) {
        this.root = root;
        this.$ide = $(`
        <div class = "alinuxonline_ide">在线IDE</div>
            `);

        this.hide(); // IDE界面先隐藏
        this.root.$alinuxonline.append(this.$ide);

        this.start();
    }

    start() {
    }

    show() { // 打开IDE界面
        this.$ide.show();
    }

    hide() { // 关闭IDE界面
        this.$ide.hide();
    }
}
