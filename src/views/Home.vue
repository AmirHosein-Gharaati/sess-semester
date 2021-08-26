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
              hide-details="auto"
              class="mb-3"
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
              hide-details="auto"
              class="mb-3"
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
              hide-details="auto"
              class="mb-3"
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
              hide-details="auto"
              class="mb-3"
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
              hide-details="auto"
              class="mb-3"
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
                  hide-details="auto"
                  class="mb-3"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
                <v-icon class="closeTime" @click="clearFromTime">mdi-close</v-icon>
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
                  hide-details="auto"
                  class="mb-3"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
                <v-icon class="closeTime" @click="clearToTime">mdi-close</v-icon>
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
          <div v-if="selectedList.length">
              <v-dialog
                v-model="dialog"
                width="500"
              >
                <v-card>
                  <v-card-title class="grey lighten-2">
                    {{dialogContent.title}}
                  </v-card-title>

                  <v-card-text class="mt-4">
                    <v-list>
                      <v-list-item>
                        <span style="font-weight: bold;">نام استاد: </span>{{dialogContent.teacher}}
                      </v-list-item>

                      <v-list-item>
                        <span style="font-weight: bold;">گروه: </span>{{dialogContent.group}}
                      </v-list-item>

                      <v-list-item>
                        <span style="font-weight: bold;">واحد: </span>{{dialogContent.vahed}}
                      </v-list-item>

                      <v-list-item>
                        <span style="font-weight: bold;">امتحان نهایی: </span>{{dialogContent.final_date +' ('+dialogContent.final_time+')' }}
                      </v-list-item>

                      <v-list-item>
                        <span style="font-weight: bold;">زمان و مکان کلاس: </span>{{dialogContent.time_room}}
                      </v-list-item>
                    
                      <v-list-item>
                        <span style="font-weight: bold;">ظرفیت: </span>{{dialogContent.capacity}}
                      </v-list-item>

                      <v-list-item>
                        <span style="font-weight: bold;">ساعت در هفته: </span>{{dialogContent.time_in_week}}
                      </v-list-item>
                    </v-list>
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

              

              

                <div class="text-center">
                  <v-badge
                    v-if="interferenceClassTimeCourse.length + interferenceFinalTimeCourses.length !== 0"
                    :content="interferenceClassTimeCourse.length + interferenceFinalTimeCourses.length"
                    :value="interferenceClassTimeCourse.length + interferenceFinalTimeCourses.length"
                    color="red"
                    left
                    overlap
                    class="my-2 text-center"
                  >
                    <v-btn
                      color="white"
                      class="pa-4"
                      elevation="0"
                      small
                      fab
                      dark
                      @click="showSelectedListAlert = true"
                    >
                      <v-icon large color="red">
                        mdi-alert
                      </v-icon>
                    </v-btn>
                  </v-badge>
                </div>
                
              
              
                <div
                  v-for="item in selectedList"
                  :key="item.index"
                  class="class-list-card"
                >
                  <div class="class-item-name-box">
                    <div>
                      <label class="group-name"> {{ item.title }} </label>
                      <!-- <label class="class-name">{{ item.group }}</label> -->
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

      <v-dialog
        v-model="showSelectedListAlert"
        width="60rem"
      >
        <v-card>
          <v-card-title class="pa-5 red darken-1 white--text">
            <h2>تداخل دروس</h2>
          </v-card-title>

          <v-card-text class="mt-4">

            <v-list v-if="interferenceClassTimeCourse.length !== 0" class="text-center">
              <h2 class="">تداخل ساعت کلاسی</h2>
              <v-list-item v-for="list in interferenceClassTimeCourse" :key="list.id">
                <v-row>
                  <v-col cols="6" class="mt-12">
                    <span style="font-weight: bold;" >{{ list[0].title }}</span>
                    <br>
                    <span >{{ list[0].time_room.split(/\(.*?\)/).join("") }}</span>
                    <br>
                    <span>{{list[0].teacher}}</span>
                  </v-col>
                  <v-col cols="6" class="mt-12">
                    <span style="font-weight: bold;">{{ list[1].title }}</span>
                    <br>
                    <span>{{ list[1].time_room.split(/\(.*?\)/).join("")  }}</span>
                    <br>
                    <span>{{ list[1].teacher }}</span>
                  </v-col>
                  <hr>
                </v-row>
              </v-list-item>
            </v-list>

            <v-list v-if="interferenceFinalTimeCourses.length !== 0" class="text-center">
              <v-divider v-if="interferenceClassTimeCourse.length !== 0"></v-divider>
              <h2 class="mt-8">تداخل ساعت امتحان نهایی</h2>
              <v-list-item v-for="list in interferenceFinalTimeCourses" :key="list.id">
                <v-row>
                  <v-col cols="6" class="mt-12">
                    <span style="font-weight: bold;" >{{ list[0].title }}</span>
                    <br>
                    <span >{{ list[0].final_date }}</span>
                    <br>
                    <span >{{ list[0].final_time }}</span>
                    <br>
                    <span>{{list[0].teacher}}</span>
                  </v-col>
                  <v-col cols="6" class="mt-12">
                    <span style="font-weight: bold;" >{{ list[1].title }}</span>
                    <br>
                    <span >{{ list[1].final_date }}</span>
                    <br>
                    <span >{{ list[1].final_time }}</span>
                    <br>
                    <span>{{list[1].teacher}}</span>
                  </v-col>
                  <hr>
                </v-row>
              </v-list-item>
            </v-list>

            <v-list>
              <v-list-item>
                <!-- TODO -->
              </v-list-item>
            </v-list>

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="showSelectedListAlert = false"
            >
              بستن
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbarAlert"
        timeout="-1"
        color="red darken-1"
      >
        <span class="white--text">تداخل دروس!</span>
        <template v-slot:action="{ attrs }">
          <v-btn 
            @click="showSelectedListAlert = true" 
            color="white"
            text
          >
            جزئیات
          </v-btn>

          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbarAlert = false"
          >
            بستن
          </v-btn>
        </template>
      </v-snackbar>
      
    
      <div :class="drawer?'exeptNav':''">
        <div fluid>
          <v-layout row wrap align-center class="d-none d-lg-flex d-xl-none">
            <v-flex align-self="center" class="text-center white--text ma-2" lg4>
              <h3 class="font-weight-bold">به روز شده در: ۴ شهریور ۱۴۰۰</h3>
            </v-flex>

            <v-flex align-self="center" lg4 class="ma-2 text-center">
              <h1 class="white--text">برنامه کلاسی نیمسال</h1>
              <h3 class="orange--text">دانشگاه شیراز</h3>
            </v-flex>

            <v-flex align-self="center" class="text-center ma-2">
                <h3 class="font-weight-bold white--text">نسخه 0.1.0</h3>
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
            :class="mobileDevice?'pa-3':'pa-6'">
            <h2 class="text-center my-4" id="search-h">نتایج جستجو</h2>
            <!-- Calendar -->
            <div v-if="selectedList.length" class="calenderShower light-blue darken-2">
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
                  <div class="theCalender" dir="ltr">
                    
                    <v-sheet v-if="calenderOpen" :height="mobileDevice?400:600" class="ma-2 rounded-lg">
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
                        @click:event="showEvent"
                      ></v-calendar>
                       <v-menu
                        v-model="selectedOpen"
                        :close-on-content-click="false"
                        :activator="selectedElement"
                        offset-x
                      >
                        <v-card
                          color="grey lighten-4"
                          min-width="290px"
                          flat
                        >
                          <v-toolbar
                            :color="selectedEvent.color"
                            dark
                          >
                            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                          </v-toolbar>
                            <v-list style="background:none">
                              <v-list-item>
                                <span style="font-weight: bold;">نام استاد: </span>{{selectedEvent.teacher}}
                              </v-list-item>

                              <v-list-item>
                                <span style="font-weight: bold;">گروه: </span>{{selectedEvent.group}}
                              </v-list-item>

                              <v-list-item>
                                <span style="font-weight: bold;">امتحان نهایی: </span>{{selectedEvent.final_date +' ('+selectedEvent.final_time+')' }}
                              </v-list-item>
                            </v-list>
                          <v-card-actions style="flex-direction: row-reverse;">
                            <v-btn
                              text
                              color="primary"
                              @click="selectedOpen = false"
                            >
                              بستن
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </v-sheet>
                  </div>
                </template>
              </div>
            </div>
            <v-spacer v-if="selectedList.length" class="my-8"><hr></v-spacer>

            <div id="app-back">
              <v-layout class="d-flex" align-center child-flex>
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
                      <div class="white rounded-lg" :class="mobileDevice?'pa-1 mt-2 mb-2':'pa-3 ma-4'">
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
                            <v-col class="screen-expanded">
                              <span class="title-font-weight">ساعت امتحان : </span>
                              <span>{{item['final_time']}}</span>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col class="screen-expanded">
                              <span class="title-font-weight">شماره گروه : </span>
                              <span>{{ item['group'] }}</span>
                            </v-col>

                            <v-col class="screen-expanded">
                              <span class="title-font-weight">واحد : </span>
                              <span>{{ item['vahed'] }}</span>
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
    </v-card>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import { isTimeInBetween } from "../helpers/timeCalculator";
import { placeSearchHelper } from "../helpers/placeSearch";
import { checkClassTimeInterference, checkFinalTimeInterference } from "../helpers/timeInterference";
export default {
  name: "Home",
  data() {
    return {
      timeStart: "",
      menuStart: false,

      timeEnd: "",
      menuEnd: false,
      
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
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
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
        final_time: null,
        time_room: null,
        capacity: null,
        time_in_week : null,
        vahed: null
      },
      snackbarAlert: false,
      showSelectedListAlert : false,
      interferenceClassTimeCourse: [],
      interferenceFinalTimeCourses : [],
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
        // { text: "واحد", value: "vahed" },
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
          for(let j=0; j<this.selectedList[i]["seperated_time_and_place"].length;j++){
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
            console.log(this.selectedList[i]);
            events.push({
              name: this.selectedList[i].title,
              start: thisDateStart,
              end: thisDateEnd,
              color:this.colors[i%this.colors.length],
              timed: 1,
              teacher:this.selectedList[i].teacher, 
              group:this.selectedList[i].group, 
              final_time:this.selectedList[i].final_time, 
              final_date:this.selectedList[i].final_date
            })
          }
        }

        this.events = events

        // Check time interference
        this.interferenceClassTimeCourse = [];
        this.interferenceFinalTimeCourses = [];
        for(let i=0 ; i < this.selectedList.length - 1 ; i++){
          for(let j=i+1 ; j < this.selectedList.length ; j++){
            let course1 = this.selectedList[i];
            let course2 = this.selectedList[j];
            
            if(checkClassTimeInterference(course1, course2))
              this.interferenceClassTimeCourse.push([course1, course2]);
            if(checkFinalTimeInterference(course1, course2))
              this.interferenceFinalTimeCourses.push([course1, course2]);
          }
        }
        if(this.interferenceClassTimeCourse.length + this.interferenceFinalTimeCourses.length > 0){
          this.snackbarAlert = true;
        }
        else{
          this.snackbarAlert = false;
        }

        // console.log(this.selectedList[0]);
      },
      
    // End calender
  },
  methods: {
    showEvent ({ nativeEvent, event }) {
      console.log(this.selectedEvent)
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
    clearFromTime(){
      this.timeStart="";
    },
    clearToTime(){
      this.timeEnd="";
    },
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
      this.dialogContent.title = item.title;
      this.dialogContent.teacher = item.teacher;
      this.dialogContent.group = item.group;
      this.dialogContent.final_date = item.final_date;
      this.dialogContent.final_time = item.final_time;
      this.dialogContent.time_room = item.time_room;
      this.dialogContent.capacity = item.capacity;
      this.dialogContent.time_in_week = item.time_in_week;
      this.dialogContent.vahed = item.vahed;
      this.dialog = true;
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
@media screen and (max-width: 768px) {
  .calenderShower{
    overflow-x:scroll ;
  }
  .theCalender{
    min-width:600px;
  }
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

.dialog-content{
  margin: 0 1rem;
}
.closeTime{
  position: absolute!important;;
  left:1rem;
  top: 50%;
  transform: translateY(-50%);
}



</style>


