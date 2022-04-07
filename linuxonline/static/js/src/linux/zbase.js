class AlinuxonlineLinux {
    constructor(root) {
        this.root = root;
        this.$linux = $(`
        <div class="alinuxonline_linux">在线linux学习</div>
            `);

        this.hide(); // linux界面先隐藏
        this.root.$alinuxonline.append(this.$linux);

        this.start();
    }

    start() {
    }

    resize() {
        console.log("resize");
        this.width = this.$linux.width();
        this.height = this.$linux.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
    }

    show() { // 打开linux界面
        this.$linux.show();
    }

    hide() { // 关闭Linux界面
        this.$linux.hide();
    }
}
