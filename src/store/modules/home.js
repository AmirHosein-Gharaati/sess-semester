import { getField, updateField } from "vuex-map-fields";
import Cookies from 'js-cookie'
import logs from "@/data/changesLog"

const state = {
  version: "0.1.8",
  results: [],

  filters: {
    semester: "",
    unit: [],
    course: [],
    teacherName: [],
    time: [],
    place: [],
    gender : [],
  },

  filtersItems: {
    semesters: ['1400-2'],
    units: [],
    course: [],
    teachersName: [],
    times: [],
    places: [],
    genders : [],
  },

  json: null,
  changes: [],
};

const getters = {
  getField,
  getFilterItems: (state) => state.filtersItems,
  getSemesters: (state) => state.filtersItems.semesters,
  getUnits: (state) => state.filtersItems.units,
  getCourses: (state) => state.filtersItems.course,
  getTeachers: (state) => state.filtersItems.teachersName,
  getPlaces : (state) => state.filtersItems.places,
  getGenders : (state) => state.filtersItems.genders,
  getJson: (state) => state.json,
  getVersion: (state) => state.version,
  getChanges: (state) => state.changes,
};

const mutations = {
  updateField,
  setChanges: (state, value) => {
    state.changes = value;
  }
};

const actions = {
  
  cookieIsAvailable(){
    
    const websiteVersion = Cookies.get('sess-semester');
    const currentVersion = this.getters.getVersion;
    if(!websiteVersion){
      Cookies.set('sess-semester', currentVersion);
      return false;
    }
    return true;
  },
  generateChangesLog({commit}){
    const websiteVersion = Cookies.get('sess-semester');
    const [major, minor, patch] = websiteVersion.split('.').map(num => parseInt(num));
    
    let changeLogs = [];
    let flag1 = false, flag2 = false;

    for(let majorIndex = major; majorIndex < Object.keys(logs).length; majorIndex++){
      for(let minorIndex = flag1 ? 0 : minor; minorIndex < Object.keys(logs[`${majorIndex}`]).length; minorIndex++ ){
        for(let patchIndex = flag2? 0 : patch+1 ; patchIndex < Object.keys(logs[`${majorIndex}`][`${minorIndex}`]).length ; patchIndex++){
          changeLogs.push(logs[`${majorIndex}`][`${minorIndex}`][`${patchIndex}`].text);
        }
        flag2 = true;
      }
      flag1 = true;
    }

    Cookies.set('sess-semester', this.version);
    commit('setChanges', changeLogs);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
