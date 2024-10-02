import { FB_DB_URL } from '../../constants';

export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  getters: {
    requests(state, _, _2, rootGetters) {
      const currentUserId = rootGetters.userId;
      return state.requests.filter((item) => item.coachId === currentUserId);
    },
    hasRequests(_, getters) {
      return getters.requests && getters.requests.length > 0;
    },
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        email: payload.email,
        message: payload.message,
      };
      const response = await fetch(
        `${FB_DB_URL}/requests/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest),
        }
      );
      const respData = await response.json();

      if (!response.ok) {
        throw new Error(respData.message || 'Failed to send request');
      }
      context.commit('addRequest', {
        id: respData.name,
        coachId: payload.coachId,
        ...newRequest,
      });
    },

    async getRequests(context) {
      const coachId = context.rootGetters.userId;
      const token = context.rootGetters.token;

      const response = await fetch(
        `${FB_DB_URL}/requests/${coachId}.json?auth=${token}`
      );
      const respData = await response.json();

      if (!response.ok) {
        throw new Error(respData.message || 'Failed to fetch requests');
      }

      const formattedData = Object.entries(respData ?? {}).map(
        ([key, value]) => {
          return {
            ...value,
            id: key,
            coachId,
          };
        }
      );
      context.commit('setRequests', formattedData);
    },
  },
};
