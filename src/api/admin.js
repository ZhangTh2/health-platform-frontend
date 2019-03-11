import request from '@/utils/request';

export function fetchAdminlist(type) {
  console.log("fetchServiceAdminlist")
  return request({
    url:'/api/admin/fetchAdminList',
    method: 'get',
    params: { type },
  })
}

export function searchAdmin(query) {
  console.log("fetch")
  console.log(query)
  return request({
    url:'/api/admin/searchAdmin',
    method: 'post',
    data:query
  })
}

export function deleteAdmin(id) {
  console.log("deleteAdmin")
  return request({
    url:'/api/admin/deleteAdmin',
    method: 'get',
    params: { id },
  })
}

export function checkAdmin(id) {
  console.log("checkAdmin")
  return request({
    url:'/api/admin/checkAdmin',
    method: 'get',
    params: { id },
  })
}

//验证该用户名是否已经被使用
export function ifexistAdmin(name) {
  console.log("验证该用户名是否已经被使用")
  return request({
    url:'/api/admin/checkName',
    methods:'get',
    params:{name}
  })
}


export function createAdmin(admin) {
  console.log("由超级管理员创建了一个新的管理员")
  console.log(admin)
  return request({
    url:'/api/admin/createAdmin',
    method:'post',
    data:admin
  })
}

//更新Admin信息
export  function updateAdmin(admin) {
  console.log("更新admin信息")
  return request ({
    url:'/api/admin/updateAdmin',
    method:'post',
    data:admin
  })
}



//根据管理员id获取详细的信息
export function getAdminById(id) {
  console.log('根据管理员id获取详细的信息')
  return request({
    url:'/api/admin/getAdminById',
    method:'get',
    params:{id}
  })
}

//获取admin总数
export  function getTotal() {
  return request ({
    url:'/api/admin/getTotal',
    method:'get',
  })
}

//获取当前登录的账号的详细信息
export function getSelf(token) {
  return request({
    url:'/api/admin/getSelf',
    method:'get',
    params:{token}
  })
}
