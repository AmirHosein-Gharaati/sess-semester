<template>
  <div class="home">
    <div class="white ma-4 rounded-lg">
      <h1 class="text-center">مشخصات کلی درس</h1>      
    </div>

    <div class="white ma-4 rounded-lg pa-12">
      <v-row>
        <h2>{{ course['title'] }} | {{ course['vahed'] }} واحد</h2>
      </v-row>
      
      <div class="body-font mt-8">
        <v-row>
          <v-col>
            <span class="title-font-weight">نام استاد : </span>
            <span >{{ course['teacher'] }}</span>
          </v-col>

          <v-col>
            <span class="title-font-weight">نام بخش : </span>
            <span>{{ course['unit'] }}</span>
          </v-col>

          <v-col>
            <span class="title-font-weight">تاریخ امتحان : </span>
            <span>{{ course['final_date'] }}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <span class="title-font-weight">شماره گروه : </span>
            <span>{{ course['group'] }}</span>
          </v-col>

          

          <v-col>
            <span class="title-font-weight">جنسیت : </span>
            <span>{{ course['gender'] }}</span>
          </v-col>

          <v-col>
            <span class="title-font-weight">زمان و مکان کلاس : </span>
            <span>{{ course['time_room'] }}</span>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="white ma-4 rounded-lg pa-12 body-font title-font-weight">
      
      <v-row align="center">
        <div cols="3">
          <span>کلاس های همزمان با این درس در بخش</span>
        </div>
        <div class="mt-6">
            <v-autocomplete
            solo
            label="یک بخش را انتخاب کنید"
            v-model="unit"
            :items="list"
            hide-no-data
            hide-selected
            chips
            :search-input.sync="searchInput1"
            @change="searchInput1 = ''"
            class="ma-2"
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" close @click:close="unit = ''">
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </div>
        </v-row>

      <v-chip v-for="string in courseList" :key="string" class="mx-4">
        <span class="body-font color-gray"> {{ string }} </span>
      </v-chip>

      <span>TODO</span>
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
        ['نام استاد','teacher'],
        ['نام بخش','unit'],
        ['تاریخ امتحان','final_date'],
        ['شماره گروه','group'],
        ['زمان و مکان کلاس', 'time_room'],
        ['جنسیت','gender'],
      ],
      list : ['بخش کامپیوتر'],
      searchInput1 : null,
      courseList : [],
      unit : null,
    }
  },

  beforeMount() {
    let j = json;
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
  },
};
</script>

<style>
.title {
  font-weight: bold;
}

.body-font{
  font-size: 3vh;
}

.title-font-weight{
  font-weight: 600;  
}

.border{
  border-color: red;
}

.color-gray{
  color: brown;
}

</style>
