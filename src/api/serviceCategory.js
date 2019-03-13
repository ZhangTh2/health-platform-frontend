import request from '@/utils/request';

export function ListSeviceCategory() {
  console.log("获取服务列表")
  return request({
    url:'/ips/serviceCategory/list',
    method:'get'
  })
}

export  function update(category) {
  console.log("更新服务分类")
  return request ({
    url:'/ips/serviceCategory/update',
    method:'post',
    data:category
  })
}

export  function create(category) {
  console.log("添加服务分类")
  return request ({
    url:'/ips/serviceCategory/create',
    method:'post',
    data:category
  })
}

export function remove(id) {
  console.log("删除服务分类")
  return request({
    url:'/ips/serviceCategory/remove',
    method:'get',
    params:{id}
  })
}
