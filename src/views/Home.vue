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
            style="font-size: 1vw"
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
          <v-btn width="300" x-large class="blue white--text" @click="search">
            <h3>جستجو</h3>
          </v-btn>     
        </v-col>
      </v-layout>
    </div>

    <v-spacer class="my-6"></v-spacer>

    <div class="white rounded-lg justify-content-center" fluid>
      <h2 class="text-center my-4" id="search-h">نتایج جستجو</h2>
      <div
        v-if="results.length !== 0 && results[0] !== -1"
        class="pa-6"
        id="app-back"
      >
        <v-card class="class-item ma-5 pa-2">
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
                <v-icon @click="snackbar = true">mdi-information</v-icon>
                <v-snackbar v-model="snackbar" 
                :multi-line="true"
                :vertical="true"
                :top="true"
                :left="true"
                color="primary">

                 <p>
                   <span>نام درس: {{item.title}}</span>
                  <br>
                  <br>
                  <span>گروه: {{item.group}}</span>
                  <br>
                  <br>
                  <span>نام استاد: {{item.teacher}}</span>
                  <br>
                  <br>
                  <span>امتحان نهایی: {{item.final_date}}</span>
                  </p>
                  
                  <template v-slot:action="{ attrs }">
                    <v-btn
                      color="blue"
                      text
                      v-bind="attrs"
                      @click="snackbar = false"
                    >
                      <span class="white--text black pa-2 px-4 rounded-lg">بستن</span>
                    </v-btn>
                  </template>
                </v-snackbar>
              </v-btn>
              <v-btn icon>
                <v-icon @click="removeFromSelected(item.id)"
                  >mdi-close-circle</v-icon
                >
              </v-btn>
            </div>
          </div>
        </v-card>

        <v-layout class="d-none d-lg-flex d-xl-none" align-center child-flex>
          <!-- selected list is local but synced on change with vuex variable -->
          <!-- added v-model and show-select -->
          <v-data-table
            v-model="selectedList"
            show-select
            item-key="id"
            :headers="dataTableHeaders"
            :items="results"
            class="elevation-1 row-pointer"
            :items-per-page="results.length"
            hide-default-footer
          >
          </v-data-table>
        </v-layout>

        <v-layout class="d-lg-none d-xl-flex" align-center child-flex>
          <v-data-table
            :headers="dataTableHeaders2"
            :items="results"
            class="elevation-1 row-pointer"
            :items-per-page="results.length"
            hide-default-footer
            show-select
          >
          </v-data-table>
        </v-layout>
      </div>

      <v-row v-else-if="results[0] === -1" class="ma-2 pa-4" justify="center">
        <h2 class="text-center">موردی پیدا نشد</h2>
      </v-row>

      <v-row v-else class="ma-2 pa-4" justify="center">
        <h2 class="text-center">برای نمایش نتایج، فیلتر ها را پر کنید</h2>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      snackbar: null,
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
  methods: {
    removeFromSelected: function (id) {
      this.selectedList = this.selectedList.pop((item) => item.id !== id);
    },
    // logtest() {
    //   console.log("selected", this.selectedList);
    // },
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
      //TODO

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
    },
    remove(item) {
      if (item.parent.label.includes("بخش")) {
        this.filters.unit.pop(item.data);
      } else if (item.parent.label.includes("درس")) {
        this.filters.course.pop(item.data);
      } else if (item.parent.label.includes("نام استاد")) {
        this.filters.teacherName.pop(item.data);
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
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.home {
  font-family: "IRANSans";
}

.filter-color {
  background-color: #ffffff;
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


