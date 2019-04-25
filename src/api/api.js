import request from '@/utils/request'

export function listApi(serviceId) {
  return request({
    url:'/qbs/ApiManage/listApi',
    method:'get',
    params:{serviceId}
  })
}

export function insertApi(api) {
  return request({
    url:'/qbs/ApiManage/insertApi',
    method:'post',
    data:api
  })
}

export function updateApi(api) {
  return request({
    url:'/qbs/ApiManage/updateApi',
    method:'post',
    data:api
  })
}

export function getInfo(id) {
  return request({
    url:'/qbs/ApiManage/getInfo',
    method:'get',
    params:{id}
  })
}

export function updateStatus(id,status) {
  return request({
    url:'/qbs/ApiManage/updateStatus',
    method:'get',
    params:{id,status}
  })
}
