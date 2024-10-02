<template>
  <div>
    <Modal :show="!!error" title="An error occured!" @close="error = ''">
      <p>{{ error }}</p>
    </Modal>
    <form @submit.prevent="submitHandler">
      <div class="for-control">
        <label for="email">Your E-mail</label>
        <input type="email" id="email" v-model.trim="email" />
      </div>
      <div class="for-control">
        <label for="message">Message</label>
        <textarea id="message" rows="5" v-model.trim="message" />
      </div>
      <p class="errors" v-if="!isValidForm">
        Please enter a valid email and non-empty message.
      </p>
      <div class="actions">
        <Button>Send message</Button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      email: '',
      message: '',
      isValidForm: true,
      error: '',
    };
  },
  methods: {
    ...mapActions({
      contactCoach: 'requests/contactCoach',
    }),

    async submitHandler() {
      try {
        this.isValidForm = true;
        if (!this.email || !this.email.includes('@') || !this.message) {
          this.isValidForm = false;
          return;
        }
        await this.contactCoach({
          coachId: this.$route.params.id,
          email: this.email,
          message: this.message,
        });
        this.$router.replace('/coaches');
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
