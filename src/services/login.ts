import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function accountLogin(params: LoginParamsType) {
  console.log('request payload: ', params)
  return request('/api/user/login', {
    method: 'POST',
    data: params,
  });
}

// export async function getFakeCaptcha(mobile: string) {
//   return request(`/api/login/captcha?mobile=${mobile}`);
// }
