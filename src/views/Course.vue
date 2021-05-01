<template>
  <div class="">
    <div class="white ma-4 rounded-lg" fluid>
      <h1 class="text-center">اطلاعات کلی درس</h1>
      <v-container style="height:2vw"></v-container>
      
      <div v-for="keyy in titles" :key="keyy.id" class="my-4">
        <v-row align="center" class="grey mx-10" style="height:1px;"></v-row>
        <v-row class="text-center" align="center">
          <v-col cols="6">
            <h3 >{{ keyy[0] }}</h3>
          </v-col>
          <v-col cols="6" >
            <h3 style="color:blue" class="px-2">{{ course[keyy[1]] }}</h3>
          </v-col>
        </v-row>
      </div>


    </div>
  </div>
</template>

<script>
import json from "../2903.json";
import { mapFields } from "vuex-map-fields";

export default {
  name: "Course",
  data(){
    return {
      course : null,
      titles : [
        ['اسم درس' , 'title'],
        ['زمان و مکان درس', 'time_room'],
        ['گروه','group'],
        ['نام استاد','teacher'],
        ['جنسیت','gender'],
        ['تعداد واحد','vahed'],
        ['بخش','unit'],
        ['تاریخ امتحان پایان ترم','final_date'],
      ],
    }
  },

  beforeMount() {
    let j = json;
    console.log(this.json);
    for(let unit in j){
      for(let course in j[unit]){
        if(course === this.id){
          this.course = j[unit][course];
          this.course['id'] = course;
          this.course['unit'] = unit;
          return;
        }
      }
    }
  },
  props: ['id'],
  computed : {
    ...mapFields(['json']),
  }
};
</script>

<style>
.title {
  font-weight: bold;
}
</style>
