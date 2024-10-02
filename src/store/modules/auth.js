let timer;

export default {
  state() {
    return {
      userId: '',
      token: '',
      didAutoLogout: false,
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuth(state) {
      return !!state.token;
    },
    isAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async auth(context, payload) {
      const urlParam =
        payload.mode === 'login' ? 'signInWithPassword' : 'signUp';
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:${urlParam}?key=AIzaSyAug1wfI-vpQf-bqjs2iGVo8qxYleI79eY`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to authenticate.');
      }

      const expiresIn = 10000000; //by default expiresIn from FB is 3600 and it can't be changed, so I use mock data
      const expirationDate = new Date().getTime() + expiresIn * 1000;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.dispatch('autologout');
      }, expiresIn);

      context.commit('setUser', {
        userId: responseData.localId,
        token: responseData.idToken,
      });
    },
    autologout(context) {
      context.dispatch('logout');
      context.commit('setAutoLogout');
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        context.dispatch('autologout');
      }, expiresIn);

      if (token && userId) {
        context.commit('setUser', {
          token,
          userId,
        });
      }
    },
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login',
      });
    },
    async signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup',
      });
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      context.commit('setUser', {
        userId: '',
        token: '',
      });
    },
  },
};
