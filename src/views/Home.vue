<template>
  <div class="home">


    <v-dialog
      v-model="showAlert"
      width="400"
    >
      <v-container class="white">
        <v-card class="my-2  white">
          <v-card-title class="red white--text">
            <h2>خطا</h2>
          </v-card-title>

          <v-list-item 
            v-for="error in errorMessages"
             :key="error"
             class="blue-grey lighten-4"
          >
            <v-list-item-content 
             >
              {{ error }}
            </v-list-item-content>
          </v-list-item>
        </v-card>

        <v-container class="text-center">
            <v-btn @click="showAlert = false" class="orange lighten-3">
            بسته
          </v-btn>
        </v-container>

      </v-container>
    </v-dialog>

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
          :items="getSemesters"
          hide-no-data
          hide-selected
          chips
          :search-input.sync="searchInput1"
          @change="searchInput1 = ''"
          >
            <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              close
              @click:close="remove(data)"
            >
              {{ data.item }}
            </v-chip>
          </template>

          </v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete 
          solo 
          label="بخش"
          v-model="filters.unit"
          :items="getUnits"
          multiple
          hide-no-data
          chips
          :search-input.sync="searchInput2"
          @change="searchInput2 = ''"
          >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              close
              @click:close="remove(data)"
            >
              {{ data.item }}
            </v-chip>
          </template>

          </v-autocomplete>
        </v-col>

      </v-row>

      <v-row>
        <v-col>
          <v-autocomplete 
          solo 
          label="درس"
          v-model="filters.course"
          :items="getCourses"
          multiple
          hide-no-data
          chips
          :search-input.sync="searchInput3"
          @change="searchInput3 = ''"
          >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              close
              @click:close="remove(data)"
            >
              {{ data.item }}
            </v-chip>
          </template>
          </v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete 
          solo 
          label="نام استاد"
          v-model="filters.teacherName"
          :items="getTeachers"
          hide-no-data
          multiple
          chips
          :search-input.sync="searchInput4"
          @change="searchInput4 = ''"
          >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              close
              @click:close="remove(data)"
            >
              {{ data.item }}
            </v-chip>
          </template>
          </v-autocomplete>
        </v-col>
      </v-row>
       
      <v-row>
         <v-col cols="3">
          <v-autocomplete 
          solo 
          label="ساعت برگزاری کلاس(به زودی)"
          v-model="filters.time"
          disabled
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete 
          solo 
          label="مکان برگزاری کلاس(به زودی)"
          v-model="filters.place"
          disabled
          >
          </v-autocomplete>
        </v-col>
        <v-col class="text-center">
          <v-btn width="300" x-large class="blue white--text" @click="search">
            <h3>جستجو</h3>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer class="my-6"></v-spacer>

    <v-container class="white rounded-lg">

      <v-container v-if="results.length !== 0">
        <h2 class="text-center mb-4 mt-2">نتایج جستجو</h2>

        <v-data-table
          :headers="dataTableHeaders"
          :items="results"
          class="elevation-1 row-pointer"
          :items-per-page="results.length"
          hide-default-footer
          @click:row="handle"
        >
        </v-data-table>

      </v-container>

      
        <v-row v-else justify="center" class="ma-2">
          <h2>
            برای نمایش نتایج، فیلتر ها را پر کنید
          </h2>
        </v-row>

    </v-container>

  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data(){
    return{
      searchInput1 : '',
      searchInput2 : '',
      searchInput3 : '',
      searchInput4 : '',
      showAlert : false,
      errorMessages: [],
      rules: [ value => !!value || 'نیمسال تحصیلی باید انتخاب شود.'],
      dataTableHeaders:[
        {text: 'درس', value: 'name'}, 
        {text: 'استاد', value: 'teacher'},
        {text: 'گروه', value: 'group'},
        {text: 'واحد', value: 'total_unit'},
        {text: 'زمان و مکان کلاس', value: 'time_and_place'},
        {text: 'تاریخ امتحان نهایی', value: 'final_date'},
      ],
    }
  },
  methods:{
    search(){
      let flag = 0;
      this.errorMessages = []

      if(!this.filters.semester){
        this.errorMessages.push('نیمسال تحصیلی باید انتخاب شود')
        flag = 1
      }
      if(!(this.filters.unit.length || this.filters.course.length || this.filters.teacherName.length)){
        this.errorMessages.push('حداقل یکی از موارد بخش، درس یا نام استاد باید انتخاب شود.')
        flag = 1
      }
      if(flag){
        this.showAlert = true
        return
      }

      this.results = [];
      for(let unit in this.json){
        if(this.filters.unit.length === 0 || this.filters.unit.includes(unit)){

          for(let course in this.json[unit]){

            if(this.filters.course.length === 0 || this.filters.course.includes(this.json[unit][course]['name'])){

              if(this.filters.teacherName.length ===0 || this.filters.teacherName.includes(this.json[unit][course]['teacher'])){
                this.results.push(this.json[unit][course])
              }
            }

          }
        }
      }
    },
    handle(value){
      this.courseId = value.id
      this.$router.push({name: 'Course', params : {id : value.id}})
    },
    remove(item){
      if(item.parent.label === 'بخش'){
        this.filters.unit.pop(item.data)
      }else if(item.parent.label === 'درس'){
        this.filters.course.pop(item.data)
      }else if(item.parent.label === 'نام استاد'){
        this.filters.teacherName.pop(item.data)
      }else if(item.parent.label === 'نیمسال تحصیلی*'){
        this.filters.semester = ''
      }
    },
  },
  watch:{
  },
  computed:{
    ...mapFields([
      'filters',
      'json',
      'courseId',
      'results'
      ]),
    ...mapGetters([
      'getSemesters',
       'getUnits',
       'getCourses',
       'getTeachers',
       'getFilterItems'
      ]),
  },
  
}
</script>


<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
