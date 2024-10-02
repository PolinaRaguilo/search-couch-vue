import { FB_DB_URL } from '../../constants';

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 20,
        },
      ],
    };
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((item) => item.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) return true;

      const currTimeStamp = new Date().getTime();
      return (currTimeStamp - lastFetch) / 1000 > 60;
    },
  },
  mutations: {
    addNewCoach(state, payload) {
      state.coaches.push(payload);
    },

    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setLastFetch(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  actions: {
    async addCoach(context, data) {
      const userId = context.rootGetters.userId;
      const formattedData = {
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas,
      };

      const resp = await fetch(`${FB_DB_URL}/coaches/${userId}.json`, {
        method: 'PUT',
        body: JSON.stringify(formattedData),
      });

      if (!resp.ok) {
        //error
      }

      context.commit('addNewCoach', {
        ...formattedData,
        id: userId,
      });
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) return;

      const token = context.rootGetters.token;
      const resp = await fetch(`${FB_DB_URL}/coaches.json?auth=${token}`);
      const responseData = await resp.json();

      if (!resp.ok) {
        throw new Error(responseData.message || 'Failed to fetch');
      }

      const coaches = Object.entries(responseData).map(([key, item]) => {
        return {
          id: key,
          firstName: item.firstName,
          lastName: item.lastName,
          description: item.description,
          hourlyRate: item.hourlyRate,
          areas: item.areas,
        };
      });
      context.commit('setCoaches', coaches);
      context.commit('setLastFetch');
    },
  },
};
