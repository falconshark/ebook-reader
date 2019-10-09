<template>
  <div id="wrapper">
    <main>
      <div class="welcomeMessage" v-if="!bookPath">
        <h1 class="header-title">Happy Ebook Reader</h1>
        <img class="logo img-fluid" src="../assets/logo.png">
        <div class="btn btn-primary" v-on:click="selectBook">Read Book</div>
      </div>
      <div id="book" />
      <div v-if="!bookPath" class="credit">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"  title="Flaticon">www.flaticon.com</a></div>
    </main>
  </div>
</template>

<script>
import ePub from 'epubjs';
import fs from 'fs';
import Datauri from 'datauri';
export default {
  name: 'ebook',
  data(){
    return{
      'bookPath': null,
    }
  },
  methods: {
    async selectBook(){
      const datauri = Datauri.promise;
      const dialog = this.$electron.remote.dialog;
      const files = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
      const bookPath = files[0];
      this.bookPath = bookPath;
      const bookFile = fs.readFileSync(bookPath);
      const bookBase64 = new Buffer(bookFile).toString('base64');
      const book = ePub(bookBase64, { encoding: "base64" });
      const rendition = book.renderTo('book');
      rendition.display();
    },
  }
}
</script>
<style lang="scss" scoped>
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
</style>
