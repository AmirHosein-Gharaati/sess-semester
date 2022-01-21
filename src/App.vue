<template>
  <v-app>
    <v-main>
        <router-view></router-view>
        <v-dialog v-model="dialog" width="500">
            <v-card>
              <v-card-title class="grey lighten-2">
                title
              </v-card-title>

              <v-card-text class="mt-4">
                <v-list>
                  <v-list-item v-for="item in changesLogs" :key="item">
                    <p>{{ item }}</p>
                  </v-list-item>
                </v-list>
              </v-card-text>  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import data from "./data/data.json";
import "./assets/css/font.css";
import { teacherNameDivider } from './helpers/teacherName';
import  { toFarsiNumber} from './helpers/english_to_persian';
import { mapActions, mapGetters } from 'vuex';


export default {
  name: "App",
  data(){
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapFields(["filtersItems", "json", "filters"]),
    ...mapGetters(["getChanges"]),
    changesLogs(){
      return this.$store.getters['home/getChanges'];
    },
  },
  methods: {
    ...mapActions(["cookieIsAvailable", "generateChangesLog"]),
  },
  mounted() {

    if(this.cookieIsAvailable()){
      this.generateChangesLog();
      if(this.changesLogs !== []){
        this.dialog = true;
      }
    }

    this.json = data;
    //initializing filters for search
      for (let unit in this.json) {
        
        for(let course in this.json[unit]){

          this.json[unit][course]['id'] = course;
          this.json[unit][course]['teacher'] = teacherNameDivider(this.json[unit][course]['teacher']);
          this.json[unit][course]['vahed'] = toFarsiNumber(this.json[unit][course]['vahed']);
          this.json[unit][course]['group'] = toFarsiNumber(this.json[unit][course]['group']);
          this.json[unit][course]['time_room'] = toFarsiNumber(this.json[unit][course]['time_room']);
          this.json[unit][course]['unit'] = this.json[unit][course]['unit'].slice(0,-1);
          this.json[unit][course]['unit'] = this.json[unit][course]['unit'].replaceAll("*","|");

          for(let index in this.json[unit][course]['seperated_time_and_place']){
            this.json[unit][course]['seperated_time_and_place'][index].place = toFarsiNumber(this.json[unit][course]['seperated_time_and_place'][index].place);
          }

          //unit name
          this.filtersItems.units.push(unit);
          
          //course name
          this.filtersItems.course.push(
            this.json[unit][course]["title"]
          );

          //teacher name
          this.json[unit][course]['teacher'].split(' | ').forEach(str => {
             this.filtersItems.teachersName.push(str);
          });

          //gender
          this.filtersItems.genders.push(this.json[unit][course]['gender']);

          //place name
          for(let index in this.json[unit][course]['seperated_time_and_place']){
            let obj = this.json[unit][course]['seperated_time_and_place'][index];
            this.filtersItems.places.push(obj.place);
          }
        }
        
      }

      
  },
};
</script>

<style>

html{
  overflow: overlay!important;
  overflow-x:hidden!important;
}


#app {
  font-family: 'Vazir', sans-serif;
}

.v-chip .v-chip__content {
  white-space: pre-wrap;
  text-align: right;
}
.v-chip.v-size--default {
  min-height: 32px; 
  height: auto !important;
}
.v-data-table > .v-data-table__wrapper .v-data-table__mobile-row {
  min-height: 35px!important;
}

tr.v-data-table__mobile-table-row{
  display: block!important;

}
.v-data-table__mobile-row:nth-child(6n-5){
  display: inline-grid;
  float: left;
  background: none!important;
}
.v-data-table__mobile-row:nth-child(6n-4){
  display: inline-grid;
}

.v-data-table__mobile-row:last-child{
  padding-bottom: 1.5rem!important;
}
.v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle {
  line-height: 1.1;
  font-size:small;
  font-family: 'Vazir', sans-serif;
}
.v-tab {
  min-width: 40px!important;
  letter-spacing:0rem!important;
}
.v-slide-group__prev{
  display: none !important;
}
.v-slide-group__next{
  display: none !important;
}
.v-application .pl-1 {
  white-space: pre-wrap;
}
.v-btn {
  letter-spacing: 0!important;
}
::-webkit-scrollbar {
  width: 9px;
}

::-webkit-scrollbar-track {
  background: #e6e6e600;
}

::-webkit-scrollbar-thumb {
  background: #b0b0b099;
  border-radius: 0px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0dd;
  transition: background .5s;
}
.row {
  margin: 0px!important;
}
@media screen and (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 0px;
  }
}

</style>
