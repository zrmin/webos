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
