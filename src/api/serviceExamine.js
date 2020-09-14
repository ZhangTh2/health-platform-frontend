import axios from 'axios';
import request from '@/utils/request';

// 应用审核分页查询列表
export const examineList = params => {
  return axios.post(`/tgp/serviceItem/examineList`, params, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(res => res.data);
};

//修改应用
export const updateService = params => {
  return axios.post(`/tgp/serviceItem/update`, params, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(res => res.data);
};


// export function examineList(params) {
//   return request({
//     url:'/tgp/serviceItem/examineList',
//     method:'post',
//     data:params
//   })
// }
