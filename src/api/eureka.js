import axios from 'axios'

//查询所有服务实例列表
export function getAllApp() {
   return axios.get(
    '/eur/eureka/apps',
    {
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
      })
}

export function deleteInstance(appId,instanceId) {
  var  url = '/eur/eureka/apps/'+appId+'/'+instanceId
  return axios.delete(
    url
  )
}

export function outInstance(appId,instanceId) {
  var  url = '/eur/eureka/apps/'+appId+'/'+instanceId+'/status?value=OUT_OF_SERVICE'
  console.log(url)
  return axios.put(
    url
  )
}

export function upInstance(appId,instanceId) {
  var  url = '/eur/eureka/apps/'+appId+'/'+instanceId+'/status?value=UP'
  return axios.delete(
    url
  )
}
