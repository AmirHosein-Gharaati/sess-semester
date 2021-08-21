<template>
  <div class="home" style="padding: 0.5vw; margin: 1vw 4vw">
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

    <div class="filter-color rounded-lg px-6">
      <v-row justify="center">
        <h2 class="my-4">فیلتر</h2>
      </v-row>

      <v-layout row wrap align-center>
        <v-flex lg3 xs12>
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
            class="ma-2"
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-flex>

        <v-flex lg3 xs12>
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
            class="ma-2"
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-flex>

        <v-flex lg3 xs12>
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
            class="ma-2"
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-flex>

        <v-flex lg3 xs12>
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
            class="ma-2"
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" close @click:close="remove(data)">
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex lg3 xs12>
          <v-autocomplete
            solo
            label="ساعت برگزاری کلاس(به زودی)"
            v-model="filters.time"
            disabled
            class="ma-2"
          >
          </v-autocomplete>
        </v-flex>

        <v-flex lg3 xs12>
          <v-autocomplete
            solo
            label="مکان برگزاری کلاس(به زودی)"
            v-model="filters.place"
            disabled
            class="ma-2"
          >
          </v-autocomplete>
        </v-flex>
        <v-col class="text-center">
          <v-btn width="250" x-large class="blue white--text" @click="search">
            <h3>جستجو</h3>
          </v-btn>     
        </v-col>
      </v-layout>
    </div>

    <v-spacer class="my-6"></v-spacer>

    <div class="white rounded-lg justify-content-center" fluid>
      <div
        v-if="results.length !== 0 && results[0] !== -1"
        class="pa-6"
      >
        <h2 class="text-center my-4" id="search-h">نتایج جستجو</h2>

        <!-- Calendar -->
        <div class="calenderShower">
          <v-icon
            large
            @click="taggleCalender"
            :class="calenderOpen?'calnderCloseIcon':''"
          >
            mdi-chevron-down
          </v-icon>
          <span style="margin:auto 1rem auto 2rem">نمایش تقویم</span>
          <div class="calenderHolder">
            <template>
              <div dir="ltr">
                
                <v-sheet v-if="calenderOpen && !mobileDevice" height="800" class="ma-2 rounded-lg">
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

        <v-spacer class="ma-5"></v-spacer>
        <div 
          id="app-back"
        >
          <div v-if="selectedList.length && !mobileDevice">
            <h3 class="text-center">دروس انتخاب شده</h3>
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
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
            <v-card 
              class="class-item ma-5 pa-2">
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
            </v-card>
          </div>

          <v-layout class="d-none d-lg-flex d-xl-none" align-center child-flex>
            <!-- selected list is local but synced on change with vuex variable -->
            <!-- added v-model and show-select -->
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

          <v-layout class="d-lg-none d-xl-flex" align-center child-flex>
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

        <v-row v-if="results[0] === -1" class="ma-2 pa-4" justify="center">
          <h2 class="text-center">موردی پیدا نشد</h2>
        </v-row>

      </div>
      <v-row v-else class="ma-2 pa-4" justify="center">
        <h2 class="text-center">برای نمایش نتایج، فیلتر ها را پر کنید</h2>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import { convertPersianNumToEng } from "../helpers/persianNumber_To_English";

export default {
  name: "Home",
  data() {
    return {
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
        "#ff1e56",
        "#ffe227",
        "#43dde6",
        "#52d681",
        "#015668",
        "#f25287",
        "#f5841a",
        "#00af91",
        "#930077",
        "#203e5f",
        "#e79cc2",
        "#f9b248",
        "#65589c",
        "#313131",
        "#78c4d4",
        "#007965",
        "#52575d",
        "#fc3a52",
        "#a97555",
        "#a1de93",
        ],
      // End calender
      expanded: [],
      // snackbar: null,
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
        { text: "گروه", value: "group" },
        { text: "واحد", value: "vahed" },
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
        const convertDayName =[
          "یکشنبه",
          "دوشنبه",
          "سهشنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ]
        
        let copyOfResult = this.selectedList;
        let classesToShowOnCalender =[]

        for(let i=0; i<copyOfResult.length;i++){
          let courseName = copyOfResult[i].title;
          let justDateAndTime = copyOfResult[i].time_room.replaceAll(" ","").replaceAll("\n","").replaceAll(/\(.*?\)/, " ").split(" ").slice(0,-1)
          for (let j = 0; j < justDateAndTime.length; j++) {//1 or 2 or 3
            let listOfEachCourseDatesAndTimes = justDateAndTime[j].split("-");
            let seperatedTimes = listOfEachCourseDatesAndTimes[1].split(":");
            listOfEachCourseDatesAndTimes[1];
            classesToShowOnCalender.push({hourStart:convertPersianNumToEng(seperatedTimes[0]), minuteStart:convertPersianNumToEng(seperatedTimes[1]), hourEnd:convertPersianNumToEng(seperatedTimes[2]), minuteEnd:convertPersianNumToEng(seperatedTimes[3]) ,weekDay:listOfEachCourseDatesAndTimes[0],title:courseName, color:this.colors[i%this.colors.length]})
          }
        }
        const events = []
        const today = new Date()
        today.setDate(today.getDate());
        for (let i = 0; i < classesToShowOnCalender.length; i++) {

          let differenceToToDay = (convertDayName.indexOf(classesToShowOnCalender[i].weekDay))-(today.getDay());
          if(today.getDay()==6){
            differenceToToDay = differenceToToDay< 0 ?differenceToToDay+7:differenceToToDay  
          }else{
            differenceToToDay = differenceToToDay<-today.getDay()-1?differenceToToDay+5-today.getDay():differenceToToDay>5-today.getDay()?differenceToToDay-7:differenceToToDay
          }
          let thisDateStart = new Date()
          let thisDateEnd = new Date()
          thisDateStart.setDate(today.getDate() + differenceToToDay);
          thisDateStart.setHours(classesToShowOnCalender[i].hourStart)
          thisDateStart.setMinutes(classesToShowOnCalender[i].minuteStart)
          thisDateStart.setSeconds(0)
          thisDateEnd.setDate(today.getDate() + differenceToToDay);
          thisDateEnd.setHours(classesToShowOnCalender[i].hourEnd)
          thisDateEnd.setMinutes(classesToShowOnCalender[i].minuteEnd)
          thisDateEnd.setSeconds(0)

          events.push({
            name: classesToShowOnCalender[i].title,
            start: thisDateStart,
            end: thisDateEnd,
            color:classesToShowOnCalender[i].color,
            timed: 1,
          })
        }
        this.events = events
      },
      
    // End calender
  },
  methods: {
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
      for(let i=0;i<this.selectedList.length;i++){
        if (this.selectedList[i].id==id){
          this.selectedList.splice(i, 1);
          break
        }
      }
      // this.selectedList = this.selectedList.pop((item) => item.id !== id);
    },
    logtest() {
      console.log("selected", this.selectedList);
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
                this.results.push(this.json[unit][course]);
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
    ]),
  },
};
</script>

<style scoped>

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

  min-width: 250px;
  padding: 7px;
  margin-top: 5px;

  background-color: #c0dbe4;
  border-radius: 4px;
  font-size: 11px;
  box-shadow: 3px 3px 6px #d9d9d9, -3px -3px 6px #ffffff;
}
</style>


