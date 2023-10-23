import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/system/index/login',
    method: 'post',
    data
  })
}
export function getTempToken(t) {
  return request({
    url: '/admin/system/index/tempToken',
    method: 'get',
    params: {tokenKey:t}
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/system/index/info',
    method: 'get',
    params: { token }
  })
}

export function getVarifyImage(tempToken) {
  return request({
    url: '/admin/system/index/getVerifyImg',
    method: 'get',
    params: {tempToken:tempToken},
    responseType: 'blob'
  })
}


export function logout() {
  return request({
    url: '/admin/system/index/logout',
    method: 'post'
  })
}
