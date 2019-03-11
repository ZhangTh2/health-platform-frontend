import request from '@/utils/request'
import {getToken} from "../utils/auth";


export function login(username, password) {
  console.log('login')
  return request({
    url: '/api/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getAdminInfo(token) {
  console.log('getAdmin')
  return request({
    url: '/api/admin/getInfo',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  console.log('logout')
  return request({
    url: '/api/admin/logout',
    method: 'get'
  })
}

