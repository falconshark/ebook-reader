<template>
  <div id="wrapper">
    <main>
      <div class="preferences">
        <h1>Preferences</h1>
        <form>
          <div class="form-group">
            <label>Enable Auto Reading</label>
            <input type="checkbox" name="autoRead" :checked="autoRead" @click="setAutoRead">
          </div>
          <div class="form-group">
            <label>Auto Reading Speed</label>
            <input type="text" name="autoReadSpeed">
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import Store from 'electron-store';
const store = new Store();
export default {
  name: 'Preferences',
  data(){
    return{
      autoRead: store.get('options.autoRading'),
    }
  },
  methods:{
    setAutoRead(e){
      if(!e.target.checked){
        store.set('options.autoRading', e.target.checked);
      }else{
        store.set('options.autoRading', e.target.checked);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.preferences{
  height: 100vh;
  background-color:	 #F0F0F0;
  padding: 1em;
}
</style>
