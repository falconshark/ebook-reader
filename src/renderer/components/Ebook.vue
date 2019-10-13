<template>
  <div id="wrapper">
    <main>
      <div class="welcomeMessage" v-if="!book">
        <h1 class="header-title">Happy Ebook Reader</h1>
        <img class="logo img-fluid" src="../assets/logo.png">
        <div class="btn btn-primary" v-on:click="selectBook">Read Book</div>
      </div>
      <div id="book" />
      <div class="control-bar prev" v-on:click="prev">
        <div v-if="book" class="control-icon"><i class="fa fa-arrow-left" aria-hidden="true"></i></div>
      </div>
      <div class="control-bar next" v-on:click="next">
        <div v-if="book" class="control-icon"><i class="fa fa-arrow-right" aria-hidden="true"></i></div>
      </div>
      <div v-if="!book" class="credit">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"  title="Flaticon">www.flaticon.com</a></div>
    </main>
  </div>
</template>

<script>
import Store from 'electron-store';
import ePub from 'epubjs';
import fs from 'fs';
export default {
  name: 'ebook',
  created(){
    const ipcMain = this.$electron.remote.ipcMain;
    ipcMain.on('open-book', () => {
      this.selectBook();
    });
    this.initMenu();
  },
  data(){
    const store = new Store();
    return{
      'book': null,
      store,
    }
  },
  methods: {
    initMenu(){
      const BrowserWindow = this.$electron.remote.getCurrentWindow();
      const ipcRenderer = this.$electron.ipcRenderer;
      const Menu = this.$electron.remote.Menu;
      const menuTree = Menu.buildFromTemplate([
        {
          label: "Ebook Reader",
          submenu: [
            {
              label: "Open File" ,
              click: () => {
                ipcRenderer.send('open-book');
              }
            },
            { type: "separator" },
            {
              label: "Quit",
              accelerator: "CmdOrCtrl+Q"
            },
          ]
        },
        {
          label: "Window",
          submenu: [
            {
              label: "Always On Top",
              type: 'checkbox',
              click: (e) => {
                this.store.set('options.alwaysOnTop', e.checked);
                BrowserWindow.setAlwaysOnTop(e.checked);
              },
              checked: this.store.get('options.alwaysOnTop'),
            },
          ]
        },
      ]);
      Menu.setApplicationMenu(menuTree);
    },
    async selectBook(){
      const dialog = this.$electron.remote.dialog;
      const files = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
      const bookPath = files[0];
      const bookFile = fs.readFileSync(bookPath);
      const bookBase64 = new Buffer(bookFile).toString('base64');
      const book = ePub(bookBase64, { encoding: "base64" });
      const rendition = book.renderTo('book', {flow: 'paginated'});
      this.book = rendition;
      rendition.display();
    },
    next(){
      this.book.next();
    },
    prev(){
      this.book.prev();
    },
  }
}
</script>
<style lang="scss" scoped>
#wrapper{
  position: relative;
}
.welcomeMessage{
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  height: 80vh;
}
.header-title{
  margin-bottom: 50px;
}
.btn{
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
.logo{
  width: 30%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
}
.credit{
  text-align: center;
  margin-bottom: 0.5em;
}
.control-bar{
  position: absolute;
  height: 100vh;
  top:0;
  opacity: 0;
  width: 50px;
  transition: all 0.1s;
  &:hover{
    opacity: 1;
  }
  &.prev{
    left: 0;
  }
  &.next{
    right: 0;
  }
}
.control-icon{
  font-size: 40px;
  position: absolute;
  top: 50%;
  margin-left: 10px;
  opacity: 0.5;
}
</style>
