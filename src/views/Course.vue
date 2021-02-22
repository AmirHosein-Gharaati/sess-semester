<template>
  <div class="course">
    <v-container class="white ma-4 rounded-lg" fluid>
      <h2 class="text-center">اطلاعات کلی درس</h2>

      <v-row>
        <v-col>
          <h2 class="title">شماره سریال درس</h2>
          <span>{{ courseId }}</span>
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";

export default {
  name: "Course",
  data() {
    return {
      courseId: null,
    };
  },
  mounted() {
    if (!this.course) {
      const id = this.$route.params.id;
      console.log(this.getJson);
      let flag = 0;
      for (let unit in this.getJson) {
        for (let course in this.getJson[unit]) {
          if (course === id) {
            this.course = this.getJson[unit][course];
            flag = 1;
            break;
          }
        }
        if (flag) break;
      }
    }

    this.courseId = this.course.id.substr(0, this.course.id.indexOf("-"));
  },
  props: ["id"],
  computed: {
    ...mapFields(["course"]),
    ...mapGetters(["getJson"]),
  },
};
</script>

<style>
.title {
  font-weight: bold;
}
</style>
