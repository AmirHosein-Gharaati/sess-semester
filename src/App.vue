<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>

<style >
#app {
  background: url('./assets/background.jpg') no-repeat center center fixed !important;
  background-size: cover;
}
</style>
