<template>
  <div class="home">
    <v-dialog v-model="showAlert" width="400">
      <div class="white px-4 py-2" fluid>
        <v-card class="my-2 white">
          <div class="red white--text text-center pa-2" style="font-size: 20px">
            <h2>خطا</h2>
          </div>

          <v-list-item
            v-for="error in errorMessages"
            :key="error"
            class="grey lighten-3 pa-2"
          >
            <v-list-item-content>
              {{ error }}
            </v-list-item-content>
          </v-list-item>
        </v-card>

        <div class="text-center">
          <v-btn
            @click="showAlert = false"
            class="orange lighten-3"
            style="font-size: 1rem"
          >
            بستن
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <v-card class="wholePageContent">
      <v-app-bar-nav-icon style="background:#eee6" class="outNavToggler" @click.stop="drawer = !drawer"><v-icon x-large>mdi-chevron-left</v-icon></v-app-bar-nav-icon>
      <v-navigation-drawer
        fixed
        right
        v-model="drawer"
        style="width:320px"
        hide-overlay
      >
        <template v-slot:prepend >
          <v-list-item two-line>
            <v-tabs>
              <v-tab @click="filterTabClick">
                فیلتر
              </v-tab>
              <v-tab @click="selectTabClicked">
                دروس انتخاب شده
              </v-tab>
              
              <v-tabs-slider color="blue"></v-tabs-slider>
            </v-tabs>
            <v-app-bar-nav-icon style="background:#eee6" @click.stop="drawer = !drawer"><v-icon x-large>mdi-chevron-right</v-icon></v-app-bar-nav-icon>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list v-if="filterTabActive" dense >
          <v-list-item>
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
                <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                  {{ data.item }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>

          <v-list-item>
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
                <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                  {{ data.item }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>


          <v-list-item>
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
                <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                  {{ data.item }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>

          <v-list-item>
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
                <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                  {{ data.item }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>


          <v-list-item>
            <v-autocomplete
              solo
              label="مکان برگزاری کلاس"
              v-model="filters.place"
              chips
              multiple
              hide-no-data
              :items="getPlaces"
              :search-input.sync="searchInput6"
              @change="searchInput6 = ''"
            >
              <template v-slot:selection="data">
                <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                  {{ data.item }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-list-item>

          
          <v-list-item>
            <v-menu
              ref="menu1"
              v-model="menuStart"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="timeStart"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeStart"
                  label="از ساعت"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuStart"
                v-model="timeStart"
                format="24hr"
                full-width
                @click:minute="$refs.menu1.save(timeStart)"
              ></v-time-picker>
            </v-menu>
          </v-list-item>

          <v-list-item>
            <v-menu
              ref="menu2"
              v-model="menuEnd"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="timeEnd"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeEnd"
                  label="تا ساعت"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuEnd"
                v-model="timeEnd"
                format="24hr"
                full-width
                @click:minute="$refs.menu2.save(timeEnd)"
              ></v-time-picker>
            </v-menu>
          </v-list-item>

          
          <v-list-item>
            <v-btn width="100%" x-large class="blue white--text" @click="search">
              <h3>جستجو</h3>
            </v-btn>
          </v-list-item>
          
        </v-list>

        <v-list v-if="selectedTabActive">
          <div v-if="selectedList.length && !mobileDevice">
              <v-dialog
                v-model="dialog"
                width="500"
              >
                <v-card>
                  <v-card-title class="grey lighten-2">
                    {{dialogContent.title}}
                  </v-card-title>

                  <v-card-text class="mt-4">
                    <span style="font-weight: bold;">نام استاد: </span>{{dialogContent.teacher}}
                    <br>
                    <br>
                    <span style="font-weight: bold;">گروه: </span>{{dialogContent.group}}
                    <br>
                    <br>
                    <span style="font-weight: bold;">امتحان نهایی: </span>{{dialogContent.final_date}}
                    <br>
                    <br>
                    <span style="font-weight: bold;">زمان و مکان کلاس: </span>{{dialogContent.time_room}}
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      بستن
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              
                <div
                  v-for="item in selectedList"
                  :key="item.index"
                  class="class-list-card"
                >
                  <div class="class-item-name-box">
                    <div>
                      <label class="group-name"> {{ item.title }} </label>
                      <label class="class-name">{{ item.group }}</label>
                    </div>
                    <label class="proff-name"> {{ item.teacher }} </label>
                  </div>
                  <div>
                    <v-btn icon>
                      <v-icon @click="setDialogContent(item)">mdi-information</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon @click="removeFromSelected(item.id)"
                        >mdi-close-circle</v-icon
                      >
                    </v-btn>
                  </div>
                </div>
                </div>
        </v-list>
      </v-navigation-drawer>
    
      <div :class="drawer?'exeptNav':''">
        <div fluid>
          <v-layout row wrap align-center class="d-none d-lg-flex d-xl-none">
            <v-flex align-self="center" class="text-center white--text ma-2" lg4>
              <h3 class="font-weight-bold">به روز شده در: ۱۴ فروردین ۱۴۰۰</h3>
            </v-flex>

            <v-flex align-self="center" lg4 class="ma-2 text-center">
              <h1 class="white--text">برنامه کلاسی نیمسال</h1>
              <h3 class="orange--text">دانشگاه شیراز</h3>
            </v-flex>

            <v-flex align-self="center" class="text-center ma-2">
              <v-btn class="blue white--text" disabled>
                <h4 class="font-weight-bold">چیدن و زمانبندی برنامه درسی</h4>
                <h4>(به زودی)</h4>
              </v-btn>
            </v-flex>
          </v-layout>

          <!-- Another layout -->
          <v-layout row wrap align-center class="d-lg-none d-xl-flex">
            <v-flex align-self="center" xs12 class="ma-1 text-center">
              <h1 class="white--text">برنامه کلاسی نیمسال</h1>
              <h3 class="orange--text">دانشگاه شیراز</h3>
            </v-flex>

            <v-flex align-self="center" class="text-center white--text mt-6" xs12>
              <h4 class="font-weight-bold">به روز شده در: ۱۴ فروردین ۱۴۰۰</h4>
            </v-flex>
          </v-layout>
        </div>

        <v-spacer class="mt-6"></v-spacer>

        <div class="white rounded-lg justify-content-center ma-2" fluid>
          <div
            v-if="results.length !== 0 && results[0] !== -1"
            class="pa-6">
            <h2 class="text-center my-4" id="search-h">نتایج جستجو</h2>
            <div id="app-back">
              <v-layout class="d-none d-lg-flex" align-center child-flex>
                <v-data-table
                  :headers="dataTableHeaders"
                  :items="results"
                  class="elevation-1 row-pointer"
                  v-model="selectedList"  
                  show-select
                  hide-default-footer
                  item-key="id"
                  show-expand
                  :expanded.sync="expanded"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  @page-count="pageCount = $event"
                  >
                    <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <div class="white ma-4 rounded-lg pa-5">
                        <v-row>
                          <h2>{{ item['title'] }} | {{ item['vahed'] }} واحد</h2>
                        </v-row>
                        
                        <div class="body-font mt-8">
                          <v-row>
                            <v-col class="screen-expanded">
                              <span  class="title-font-weight">نام استاد : </span>
                              <span >{{ item['teacher'] }}</span>

                            </v-col>
                            <v-col class="screen-expanded">
                              <span  class="title-font-weight">نام بخش : </span>
                              <span>{{ item['unit'] }}</span>
                            </v-col>

                            <v-col class="screen-expanded">
                              <span class="title-font-weight">تاریخ امتحان : </span>
                              <span>{{ item['final_date'] }}</span>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col class="screen-expanded">
                              <span class="title-font-weight">شماره گروه : </span>
                              <span>{{ item['group'] }}</span>
                            </v-col>

                            <v-col class="screen-expanded">
                              <span class="title-font-weight">جنسیت : </span>
                              <span>{{ item['gender'] }}</span>
                            </v-col>

                            <v-col class="screen-expanded">
                              <span class="title-font-weight">زمان و مکان کلاس : </span>
                              <span>{{ item['time_room'] }}</span>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </td>
                  </template>
                </v-data-table>
              </v-layout>

              <v-layout class="d-lg-none" align-center child-flex>
                <v-data-table
                :headers="dataTableHeaders2"
                :items="results"
                class="elevation-1 row-pointer"
                hide-default-footer
                show-expand
                :expanded.sync="expanded"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                @page-count="pageCount = $event"
                >
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <div class="white ma-4 rounded-lg pa-4">
                        <v-row>
                          <h4 class="mobile-expanded-title">{{ item['title'] }} | {{ item['vahed'] }} واحد</h4>
                        </v-row>
                        
                        <div class="body-font mt-8">
                            <v-col class="mobile-expanded">
                              <span class="">نام استاد : </span>
                              <span >{{ item['teacher'] }}</span>
                            </v-col>

                            <v-col class="mobile-expanded">
                              <span class="">نام بخش : </span>
                              <span>{{ item['unit'] }}</span>
                            </v-col>

                            <v-col class="mobile-expanded">
                              <span class="">تاریخ امتحان : </span>
                              <span>{{ item['final_date'] }}</span>
                            </v-col>

                            <v-col class="mobile-expanded">
                              <span class="">شماره گروه : </span>
                              <span>{{ item['group'] }}</span>
                            </v-col>

                            <v-col class="mobile-expanded">
                              <span class="">جنسیت : </span>
                              <span>{{ item['gender'] }}</span>
                            </v-col>

                            <v-col class="mobile-expanded">
                              <span class="">زمان و مکان کلاس : </span>
                              <span>{{ item['time_room'] }}</span>
                            </v-col>
                        </div>
                      </div>
                    </td>
                  </template>
                </v-data-table>
              </v-layout>
            </div>

            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                :length="pageCount"
              ></v-pagination>
            </div>

            <v-spacer class="my-8"><hr></v-spacer>
            <!-- Calendar -->
            <div class="calenderShower light-blue darken-2">
              <v-icon
                large
                @click="taggleCalender"
                color="white"
                :class="calenderOpen?'calnderCloseIcon':''"
              >
                mdi-chevron-down
              </v-icon>
              <span style="margin:auto 1rem auto 2rem" class="white--text">نمایش تقویم</span>
              <div class="calenderHolder">
                <template>
                  <div dir="ltr">
                    
                    <v-sheet v-if="calenderOpen && !mobileDevice" height="600" class="ma-2 rounded-lg">
                      <v-calendar
                        ref="calendar"
                        v-model="value"
                        :weekdays="weekday"
                        :type="type"
                        :events="events"
                        :first-interval= 6
                        :interval-count= 16
                        :event-overlap-mode="mode"
                        :event-overlap-threshold="30"
                        :event-color="getEventColor"
                      ></v-calendar>
                    </v-sheet>
                  </div>
                </template>
              </div>
            </div>

            <v-row v-if="results[0] === -1" class="ma-2 pa-4" justify="center">
              <h2 class="text-center">موردی پیدا نشد</h2>
            </v-row>

          </div>
          <v-row v-else class="ma-2 pa-4" justify="center">
            <h2 class="text-center">برای نمایش نتایج، فیلتر ها را پر کنید</h2>
          </v-row>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import { isTimeInBetween } from "../helpers/timeCalculator";
import { placeSearchHelper } from "../helpers/placeSearch";
export default {
  name: "Home",
  data() {
    return {
      timeStart: "",
      menuStart: false,
      modalStart: false,

      timeEnd: "",
      menuEnd: false,
      modalEnd: false,
      
      drawer: true,
      filterTabActive:true,
      selectedTabActive:false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 12,

      mobileDevice:window.innerWidth<780,

      calenderOpen:false,
      // Start calender
      type: 'week',
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [6, 0, 1, 2, 3, 4, 5],
      weekdays: [
        { text: 'Sun - Sat', value: [ 1, 2, 3, 4, 5, 6, 0] },
      
      ],
      value: '',
      events: [],
      colors: [
        "#222831",
        "#00ADB5",
        "#F08A5D",
        "#B83B5E",
        "#6A2C70",
        "#903749",
        "#3282B8",
        "#00ADB5",
        "#FF5722",
        "#086972",
        "#17B978",
        ],
      // End calender
      expanded: [],
      dialog: false,
      dialogContent :{
        title: null,
        teacher: null,
        group: null,
        final_date: null,
        time_room: null
      },
      searchInput1: "",
      searchInput2: "",
      searchInput3: "",
      searchInput4: "",
      searchInput6: "",
      showAlert: false,

      errorMessages: [],

      rules: [(value) => !!value || "نیمسال تحصیلی باید انتخاب شود."],

      dataTableHeaders: [
        { text: "درس", value: "title" },
        { text: "استاد", value: "teacher" },
        { text: "گروه", value: "group" },
        { text: "واحد", value: "vahed" },
        { text: "زمان و مکان کلاس", value: "time_room" },
      ],

      dataTableHeaders2: [
        { text: "درس", value: "title" },
        { text: "استاد", value: "teacher" },
        { text: "زمان و مکان کلاس", value: "time_room" },
      ],
      selectedList: [],
    };
  },

  created() {
    this.filters.semester = this.getFilterItems.semesters[0];
  },
  mounted() {},
  watch: {
    selectedList: function getEvents () {
      // console.log("................")
        const convertDayName =[
          "یکشنبه",
          "دوشنبه",
          "سهشنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ]
        
        const events = []
        const today = new Date()
        for(let i=0; i<this.selectedList.length;i++){
          console.log(this.selectedList[i])
          for(let j=0; j<this.selectedList[i]["seperated_time_and_place"].length;j++){
            console.log("wtf",this.selectedList[i]["seperated_time_and_place"])
            console.log("wtf2",this.selectedList[i]["seperated_time_and_place"][j])
            let differenceToToDay = (convertDayName.indexOf(this.selectedList[i]["seperated_time_and_place"][j].day))-(today.getDay());
            if(today.getDay()==6){
              differenceToToDay = differenceToToDay< 0 ?differenceToToDay+7:differenceToToDay  
            }else{
              differenceToToDay = differenceToToDay<-today.getDay()-1?differenceToToDay+5-today.getDay():differenceToToDay>5-today.getDay()?differenceToToDay-7:differenceToToDay
            }

            let thisDateStart = new Date()
            let thisDateEnd = new Date()
            thisDateStart.setDate(today.getDate() + differenceToToDay);
            thisDateStart.setHours(this.selectedList[i]["seperated_time_and_place"][j].startHour)
            thisDateStart.setMinutes(this.selectedList[i]["seperated_time_and_place"][j].startMinute)
            thisDateStart.setSeconds(0)
            thisDateEnd.setDate(today.getDate() + differenceToToDay);
            thisDateEnd.setHours(this.selectedList[i]["seperated_time_and_place"][j].endHour)
            thisDateEnd.setMinutes(this.selectedList[i]["seperated_time_and_place"][j].endMinute)
            thisDateEnd.setSeconds(0)

            events.push({
              name: this.selectedList[i].title,
              start: thisDateStart,
              end: thisDateEnd,
              color:this.colors[i%this.colors.length],
              timed: 1,
            })
          }
        }

        this.events = events
      },
      
    // End calender
  },
  methods: {
    filterTabClick(){
      this.filterTabActive = true
      this.selectedTabActive = false
    },
    selectTabClicked(){
      this.filterTabActive = false
      this.selectedTabActive = true
    },
    taggleCalender(){
      this.calenderOpen = !this.calenderOpen
    },
    getEventColor (event) {
      return event.color
    },
    setDialogContent(item){
      this.dialog = true;
      this.dialogContent.title = item.title;
      this.dialogContent.teacher = item.teacher;
      this.dialogContent.group = item.group;
      this.dialogContent.final_date = item.final_date;
      this.dialogContent.time_room = item.time_room;
    },
    removeFromSelected: function (id) {
      this.selectedList = this.selectedList.filter((item) => item.id !== id);
    },
    search() {

      let flag = 0;
      this.errorMessages = [];

      if (!this.filters.semester) {
        this.errorMessages.push("نیمسال تحصیلی باید انتخاب شود");
        flag = 1;
      }
      if (
        !(
          this.filters.unit.length ||
          this.filters.course.length ||
          this.filters.teacherName.length
        )
      ) {
        this.errorMessages.push("حداقل یکی از موارد بخش، درس یا نام استاد باید انتخاب شود.");
        flag = 1;
      }
      if (flag) {
        this.showAlert = true;
        return;
      }

      this.results = [];

      for (let unit in this.json) {
        if (
          this.filters.unit.length === 0 ||
          this.filters.unit.includes(unit)
        ) {
          for (let course in this.json[unit]) {
            if (
              this.filters.course.length === 0 ||
              this.filters.course.includes(this.json[unit][course]["title"])
            ) {
              if (
                this.filters.teacherName.length === 0 ||
                this.filters.teacherName.includes(this.json[unit][course]["teacher"])
              ) {
                if(
                  this.filters.place.length === 0 ||
                  placeSearchHelper(this.filters.place, this.json[unit][course])
                  ){
                    if((this.timeStart.length==0 && this.timeEnd.length==0) || isTimeInBetween(this.timeStart,this.timeEnd, this.json[unit][course].seperated_time_and_place)){

                     this.results.push(this.json[unit][course]);
                  }
                }
              }
            }
          }
        }
      }
      if (this.results.length === 0) {
        this.results.push(-1);
      }
      // this.getEvents()
    },
    remove(item) {
      if (item.parent.label.includes("بخش")) {
        this.filters.unit.splice(this.filters.unit.indexOf(item.item), 1);
      } else if (item.parent.label.includes("درس")) {
        this.filters.course.splice(this.filters.course.indexOf(item.item), 1);
      } else if (item.parent.label.includes("نام استاد")) {
        this.filters.teacherName.splice(this.filters.teacherName.indexOf(item.item), 1);
      } else if (item.parent.label.includes("نیمسال تحصیلی")) {
        this.filters.semester = "";
      } else if(item.parent.label.includes("مکان برگزاری کلاس")){
        this.filters.place.splice(this.filters.place.indexOf(item.item), 1);
      }
    },
  },
  computed: {
    ...mapFields(["filters", "json", "course", "results"]),
    ...mapGetters([
      "getSemesters",
      "getUnits",
      "getCourses",
      "getTeachers",
      "getFilterItems",
      "getSele",
      "getPlaces",
    ]),
  },
};
</script>

<style scoped>
.wholePageContent{
  background: url("../assets/background.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height:100vh;
  margin-top: 0;
  padding-top:2rem;
  padding-bottom:2rem;
  border-radius: 0px!important;
}

.home {
  font-family: 'Vazir', sans-serif;
}

.filter-color {
  background-color: #ffffff;
}

.mobile-expanded{
  font-size:small;  
}
.screen-expanded{
  font-size:medium;  
}
.calenderShower{
  width:100%;
  background:#ddd5;
  padding:1rem 1rem;
  border-radius: .4rem;
}
.calnderCloseIcon{
  transform: rotate(-180deg);
}

#app-back {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
}

#search-h {
  margin-top: 50px;
}

.class-list-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  min-width: 247px;
  width:300px;
  padding: 7px;
  margin-top: 5px;
  margin:7px auto;
  background-color: #c0dbe4;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 3px 3px 6px #d9d9d9, -3px -3px 6px #ffffff;
}

/* nav */
.outNavToggler{
  position: fixed;
  top:1rem;
  right:1rem
}
.exeptNav{
  width: calc(100% - 320px);
  margin-right: 320px;
}

@media screen and (max-width: 768px) {
  .exeptNav{
    width: 100%;
    margin-right: auto;
  }
  
}

</style>


