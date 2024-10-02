<template>
  <section>
    <Card>
      <h2>Register as a Coach now!</h2>
      <CoachForm @save-data="saveData" />
    </Card>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
  components: { CoachForm },
  methods: {
    ...mapActions({
      addCoach: 'coaches/addCoach',
    }),

    saveData(data) {
      this.addCoach(data);
      this.$router.replace('/coaches');
    },
  },
};
</script>
