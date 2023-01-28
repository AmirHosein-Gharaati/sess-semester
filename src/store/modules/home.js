import { getField, updateField } from "vuex-map-fields";

const state = {
  results: [],

  filters: {
    semester: "",
    unit: [],
    course: [],
    teacherName: [],
    time: [],
    place: [],
    gender: [],
  },

  filtersItems: {
    semesters: ["1401-2"],
    units: [],
    course: [],
    teachersName: [],
    times: [],
    places: [],
    genders: [],
  },

  json: null,
};

const getters = {
  getField,
  getFilterItems: (state) => state.filtersItems,
  getSemesters: (state) => state.filtersItems.semesters,
  getUnits: (state) => state.filtersItems.units,
  getCourses: (state) => state.filtersItems.course,
  getTeachers: (state) => state.filtersItems.teachersName,
  getPlaces: (state) => state.filtersItems.places,
  getGenders: (state) => state.filtersItems.genders,
  getJson: (state) => state.json,
};

const mutations = {
  updateField,
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
