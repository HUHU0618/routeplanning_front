import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(params): Promise<any> {
  // return request('/api/currentUser');
  return request('/api/user/current', {
    params
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
