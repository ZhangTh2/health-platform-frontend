import request from '@/utils/request';

export function fetchServicelist(query) {
  console.log("fetchServicelist")
  return request({
    url:'/abs/serviceManage/fetchServiceList',
    method: 'post',
    data:query
  })
}

export function createService(service) {
  console.log("createService")
  return request({
    url:'/abs/serviceManage/createService',
    method: 'post',
    data:service
  })
}

export function updateService(service) {
  return request({
    url:'/abs/serviceManage/updateService',
    method: 'post',
    data:service
  })
}

export function updateChecked(id,checked) {
  return request({
    url:'/abs/serviceManage/updateChecked',
    method: 'get',
    params:{id,checked}
  })
}


export function unChecked(id,remarks) {
  return request({
    url:'/abs/serviceManage/unChecked',
    method: 'get',
    params:{id,remarks}
  })
}

export function getInfo(id) {
  return request({
    url:'/abs/serviceManage/getInfo',
    method:'get',
    params:{id}
  })
}

export function getUncheckService() {
  return request({
    url:'/abs/serviceManage/getUncheck',
    method:'get',
  })
}
