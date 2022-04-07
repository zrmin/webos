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
