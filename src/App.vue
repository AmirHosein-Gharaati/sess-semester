<template>
  <v-app >
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import j from './1399-2.json';
import './assets/css/font.css'


export default {
  name: 'App',

  computed:{
    ...mapFields(['filtersItems','json']),
  },
  methods:{
    isEmpty(obj){
        for(var key in obj) { 
            if(obj[key])
                return false;
        }
        return true;
    }
  },
  mounted(){
    this.json = j;

    for(let unit in this.json){
      if(!this.isEmpty(this.json[unit]))
        this.filtersItems.units.push(unit);

      for(let course in this.json[unit]){
        this.filtersItems.course.push(this.json[unit][course]['name']);
        this.filtersItems.teachersName.push(this.json[unit][course].teacher);
      }
    }
  },
};
</script>

<style>
#app {
  background: url('./assets/background.jpg') no-repeat center center fixed !important;
  background-size: cover;
}


</style>
