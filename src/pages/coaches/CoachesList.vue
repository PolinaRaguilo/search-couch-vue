<template>
  <div>
    <Modal :show="!!error" title="An error occured!" @close="error = ''">
      <p>{{ error }}</p>
    </Modal>
    <section><CoachFilter @change-filter="setFilters" /></section>
    <section>
      <Card>
        <div class="controls">
          <Button mode="outline" @click="loadingCoaches(true)">Refresh</Button>
          <Button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to Register as Coach</Button
          >
          <Button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</Button
          >
        </div>
        <div v-if="isLoading">
          <Spinner />
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          />
        </ul>
        <h3 v-else>No Coaches</h3>
      </Card>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import CoachItem from '../../components/coaches/CoachItem.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      isLoading: false,
      error: '',
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },

  computed: {
    ...mapGetters({
      coaches: 'coaches/coaches',
      hasCoaches: 'coaches/hasCoaches',
      isCoach: 'coaches/isCoach',
      isLoggedIn: 'isAuth',
    }),
    filteredCoaches() {
      return this.coaches.filter((item) => {
        if (this.activeFilters.frontend && item.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && item.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && item.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
  },
  methods: {
    ...mapActions({
      getCoaches: 'coaches/loadCoaches',
    }),
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadingCoaches(forceRefresh = false) {
      this.error = '';
      try {
        this.isLoading = true;
        await this.getCoaches({ forceRefresh });
        this.isLoading = false;
      } catch (err) {
        this.error = err.message || 'Something went wrong...';
        this.isLoading = false;
      }
    },
  },
  created() {
    this.loadingCoaches();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
