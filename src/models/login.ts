import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import router from 'umi/router';

import { accountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';


export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'manager' | 'guest' | 'saler' | 'purchaser' | 'stocker';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },
  

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // console.log('res: ', response)

      // 验证成功后，在localStorage中存储 token
      localStorage.setItem('token', response.data.token);

      // 修改登陆状态
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });


      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    logout() {
      const { redirect } = getPageQuery();

      // 退出前在localStorage中删除token
      localStorage.setItem('token', '');

      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
