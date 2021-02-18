<template>
  <div class="home">
    
    <v-container fluid >
      <v-row >
        <v-col align-self="center" class="text-center">
          <v-btn class="blue white--text" disabled>
            <h4 class="font-weight-bold">چیدن و زمانبندی برنامه درسی</h4>
            <h4>(به زودی)</h4>
          </v-btn>
        </v-col>

        
        <v-col align-self="center">
          
          <v-row class="text-center white--text" justify="center">
            <h1>برنامه کلاسی نیمسال</h1>
          </v-row>
          <v-row justify="center" class="orange--text ">
            <h3>دانشگاه شیراز</h3>
          </v-row>
        </v-col>

        <v-col align-self="center" class="text-center white--text">
          <h3 class="font-weight-bold">به روز شده در: ۱۴ فروردین ۱۴۰۰</h3>
        </v-col>
        
      </v-row>
    </v-container>

    <v-spacer class="mt-6"></v-spacer>

    <v-container class="white rounded-lg px-6">
      <v-row justify="center">
        <h2 class="my-4">فیلتر</h2>
      </v-row>

      <v-row>
        <v-col>
          <v-autocomplete 
          solo 
          label="نیمسال تحصیلی*"
          v-model="filters.semester"
          :rules="rules"
          >
            
          </v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete 
          solo 
          label="بخش"
          v-model="filters.unit"
          >
          </v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete 
          solo 
          label="درس"
          v-model="filters.course"
          >
          </v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete 
          solo 
          label="نام استاد"
          v-model="filters.teacherName"
          >
          </v-autocomplete>
        </v-col>

      </v-row>
       
      <v-row>
         <v-col cols="3">
          <v-autocomplete 
          solo 
          label="ساعت برگزاری کلاس"
          v-model="filters.time"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete 
          solo 
          label="مکان برگزاری کلاس"
          v-model="filters.place"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="text-center">
          <v-btn width="300" x-large class="blue white--text" @click="test">
            <h3>جستجو</h3>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer class="my-6"></v-spacer>

    <v-container class="white rounded-lg">
      <h2 class="text-center mb-4 mt-2">نتایج جستجو</h2>
      
      <v-row class="indigo lighten-4 ma-4 rounded-t-xl font-weight-medium">
        <v-col cols="2" class="text-center">
          <h3>نام درس</h3>
        </v-col>

        <v-col cols="2" class="text-center">
          <h3>نام استاد</h3>
        </v-col>

        <v-col cols="1" class="text-center">
          <h3>واحد</h3>
        </v-col>

        <v-col cols="1" class="text-center">
          <h3>گروه</h3>
        </v-col>

        <v-col cols="3" class="text-center">
          <h3>زمان و مکان کلاس</h3>
        </v-col>

        <v-col cols="3" class="text-center">
          <h3>تاریخ و ساعت امتحان نهایی</h3>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'Home',
  data(){
    return{
      rules: [ value => !!value || 'نیمسال تحصیلی باید انتخاب شود.']
    }
  },
  methods:{
    test(){
      console.log(this.filters)
    }
  },
  computed:{
    ...mapFields(['filters']),

  }
  
}
</script>
