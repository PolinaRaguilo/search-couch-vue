<template>
  <Header />
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Header from './components/Header.vue';
export default {
  components: {
    Header,
  },
  methods: {
    ...mapActions({
      autoLogin: 'autoLogin',
    }),
  },
  computed: {
    ...mapGetters({
      isAutoLogout: 'isAutoLogout',
    }),
  },
  watch: {
    isAutoLogout(currValue, oldValue) {
      if (currValue && currValue !== oldValue) {
        this.$router.replace('/coaches');
      }
    },
  },
  created() {
    this.autoLogin();
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
