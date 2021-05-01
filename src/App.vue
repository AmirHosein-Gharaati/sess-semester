<template>
  <v-app>
    <v-main>
        <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import j from "./2903.json";
import "./assets/css/font.css";
import './helpers/arabic_to_persian';

export default {
  name: "App",

  computed: {
    ...mapFields(["filtersItems", "json", "filters"]),
  },
  methods: {
  },
  mounted() {
    this.json = j;


    //initializing filters for search
      for (let unit in this.json) {

        this.filtersItems.units.push(unit);
        for(let course in this.json[unit]){
          
          Object.keys(this.json[unit][course]).forEach(
            (key) => {
              this.json[unit][course][key] = this.json[unit][course][key].toPersianCharacter();
            }
          );

          this.json[unit][course]['id'] = course;

          //course name
          this.filtersItems.course.push(
            this.json[unit][course]["title"]
          );

          //teacher name
          this.filtersItems.teachersName.push(
            this.json[unit][course]['teacher']
          );
        }
        
      }
  },
};
</script>

<style>
#app {
  background: url("./assets/background.jpg") no-repeat center center fixed !important;
  background-size: cover;
}
</style>
