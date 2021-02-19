<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import json from './1399-2.json';


export default {
  name: 'App',

  computed:{
    ...mapFields(['filtersItems']),
  },

  data(){
    return{
      json
    }
  },
  mounted(){
    
    for(let unit in this.json){
      this.filtersItems.units.push(unit);

      for(let course in this.json[unit]){
        this.filtersItems.course.push(this.json[unit][course]['name']);
        this.filtersItems.teachersName.push(this.json[unit][course].teacher);
      }
    }
  }
};
</script>

<style >
#app {
  background: url('./assets/background.jpg') no-repeat center center fixed !important;
  background-size: cover;
}

</style>
