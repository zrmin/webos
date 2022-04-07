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
class AlinuxonlineLinux {
    constructor(root) {
        this.root = root;
        this.$linux = $(`
        <div class="alinuxonline_linux">
            <div class="alinuxonline_linux_field">
                <span style="text-align:center;display:block;" class="title">在线Linux Ternimal</span>
                <div id="terminal">
                    <p class="hidden">
                        <span class="prompt"></span>
                        <span contenteditable="true" class="input"></span>
                    </p>
                </div>
                <script>
                    let usebootLoader = true

                    let customPrompt = function () {
                        return '[root@locahost]&nbsp;&nbsp;${Terminal.path} &gt;'
                    }
                    Terminal.init(document.getElementById("terminal"), commands, customPrompt);
                </script>
            <div>
        </div>
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
class AlinuxonlineMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="alinuxonline_menu">
                <div class="alinuxonline_menu_field">
                    <div class="alinuxonline_menu_field_item alinuxonline_menu_field_item_linux">
                        在线linux学习
                    </div>
                    <br>
                    <div class="alinuxonline_menu_field_item alinuxonline_menu_field_item_ide">
                        在线IDE
                    </div>
                    <br>
                    <div class="alinuxonline_menu_field_item alinuxonline_menu_field_item_chat">
                        TyuChat
                    </div>
                </div>
            </div>
        `);

        this.root.$alinuxonline.append(this.$menu);
        this.$linux = this.$menu.find('.alinuxonline_menu_field_item_linux');
        this.$ide = this.$menu.find('.alinuxonline_menu_field_item_ide');
        this.$chat = this.$menu.find('.alinuxonline_menu_field_item_chat');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$linux.click(function() {
            outer.hide();
            outer.root.linux.show();
        });

        this.$ide.click(function() {
            outer.hide();
            outer.root.ide.show();
        });

        this.$chat.click(function() {
            outer.hide();
            outer.root.chat.show();
        });
    }

    show() { // 显示menu界面
        this.$menu.show();
    }

    hide() { // 关闭菜单界面
        this.$menu.hide();
    }
}
export class Alinuxonline{
    constructor(id){
        this.id = id;

        this.$alinuxonline = $('#' + id);

        this.menu = new AlinuxonlineMenu(this);
        this.linux = new AlinuxonlineLinux(this);
        this.ide = new AlinuxonlineIde(this);
        this.chat = new AlinuxonlineChat(this);
    }
}
