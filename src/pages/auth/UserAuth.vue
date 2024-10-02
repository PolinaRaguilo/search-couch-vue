<template>
  <div>
    <Modal :show="!!error" title="An error occured" @close="error = ''">
      <p>{{ error }}</p>
    </Modal>

    <Modal fixed :show="isLoading" title="Authenticating...">
      <Spinner />
    </Modal>

    <Card>
      <form @submit.prevent="submitHandler">
        <div class="form-control">
          <label for="email">Email</label>
          <input id="email" type="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input id="password" type="password" v-model.trim="password" />
        </div>
        <p v-if="!isValidForm">
          Please enter valid email and password.Passsword must be at least 6
          characters long.
        </p>
        <div class="actions">
          <Button>{{ submitButton }}</Button>
          <Button type="button" mode="flat" @click="switchMode">{{
            switchModeButton
          }}</Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      email: '',
      password: '',
      isValidForm: true,
      mode: 'login',
      isLoading: false,
      error: '',
    };
  },
  computed: {
    submitButton() {
      return this.mode === 'login' ? 'Login' : 'Signup';
    },
    switchModeButton() {
      return this.mode === 'login' ? 'Signup instead' : 'Login instead';
    },
  },
  methods: {
    ...mapActions({
      login: 'login',
      signup: 'signup',
    }),

    async submitHandler() {
      if (
        !this.email ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.isValidForm = false;
        return;
      }

      const userData = {
        email: this.email,
        password: this.password,
      };

      try {
        this.isLoading = true;
        if (this.mode === 'login') {
          await this.login(userData);
        } else {
          await this.signup(userData);
        }
        const redirectUrl = this.$route.query.redirect || 'coaches';

        this.isLoading = false;
        this.$router.replace(`/${redirectUrl}`);
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.';
        this.isLoading = false;
      }
    },
    switchMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
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

input {
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
  display: flex;
}
</style>
