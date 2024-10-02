<template>
  <div>
    <section>
      <Card
        ><h2>{{ fullName }}</h2>
        <h3>${{ selectedCoach.hourlyRate }}/hour</h3>
      </Card>
    </section>
    <section>
      <Card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <Button link :to="contactLink">Contact</Button>
        </header>
        <router-view></router-view>
      </Card>
    </section>
    <section>
      <Card>
        <Badge
          v-for="area in selectedCoach.areas"
          :key="area"
          :type="area"
          :title="area"
        />
        <p>{{ selectedCoach.description }}</p>
      </Card>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: ['id'],
  data() {
    return {
      selectedCoach: null,
    };
  },
  computed: {
    ...mapGetters({
      coaches: 'coaches/coaches',
    }),
    fullName() {
      return `${this.selectedCoach.firstName} ${this.selectedCoach.lastName}`;
    },
    contactLink() {
      return `${this.$route.path}/contact`;
    },
  },
  created() {
    const currentCoach = this.coaches.find((item) => item.id === this.id);
    this.selectedCoach = currentCoach;
  },
};
</script>
