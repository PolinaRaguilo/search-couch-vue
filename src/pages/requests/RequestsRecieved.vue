<template>
  <div>
    <Modal :show="!!error" title="An error occured!" @close="error = ''">
      <p>{{ error }}</p>
    </Modal>
    <section>
      <Card>
        <header>
          <h2>Requests Recieved</h2>
        </header>
        <div v-if="isLoading">
          <Spinner />
        </div>
        <ul v-else-if="hasRequests && !isLoading">
          <RequestItem
            v-for="request in requests"
            :key="request.id"
            :email="request.email"
            :message="request.message"
          />
        </ul>
        <h3 v-else>You haven't recieved any requests yet.</h3>
      </Card>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import RequestItem from '../../components/requests/RequestItem.vue';
export default {
  components: { RequestItem },
  data() {
    return {
      isLoading: false,
      error: '',
    };
  },
  computed: {
    ...mapGetters({
      requests: 'requests/requests',
      hasRequests: 'requests/hasRequests',
    }),
  },
  methods: {
    ...mapActions({
      getRequests: 'requests/getRequests',
    }),
    async loadRequests() {
      this.isLoading = true;
      try {
        await this.getRequests();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.error = err.message || 'Something failed!';
      }
    },
  },
  created() {
    this.loadRequests();
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
