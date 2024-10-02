import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import store from './store/index.js';
import Card from './components/UI/Card.vue';
import Button from './components/UI/Button.vue';
import Badge from './components/UI/Badge.vue';
import Spinner from './components/UI/Spinner.vue';
import Modal from './components/UI/Modal.vue';

const app = createApp(App);

app.use(router).use(store);

app.component('Card', Card);
app.component('Button', Button);
app.component('Badge', Badge);
app.component('Spinner', Spinner);
app.component('Modal', Modal);

app.mount('#app');
