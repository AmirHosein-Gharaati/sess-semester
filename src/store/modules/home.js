import { getField, updateField} from 'vuex-map-fields';
 

const state = {
    filters: {
        semester: '',
        unit: '',
        course: '',
        teacherName: '',
        time: null,
        place: '',
    },
}

const getters = {
    getField,
}

const mutations = {
    updateField,
}

const actions = {}

export default {
    state,
    getters,
    mutations,
    actions
}
