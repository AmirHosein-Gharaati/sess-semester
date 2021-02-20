<template>
    <v-container>
        <p>{{ courseId }}</p>
    </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
// import { mapGetters } from 'vuex';

export default {
    name: 'Course',
    props: ['id'],
    computed: {
        ...mapFields(['courseId']),
    }
}
</script>

<style>

</style>