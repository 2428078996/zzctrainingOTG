/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/post'

export default {

  /*
  获取角色分页列表(带搜索)
  */
  getPageList(data) {
    return request({
      url: `${api_name}/list`,
      method: 'post',
      data
    })
  },
  getAll() {
    return request({
      url: `${api_name}/all`,
      method: 'post'
    })
  },
  save(post) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: post
    })
  },
  switchStatus(id, status) {
    return request({
      url: `${api_name}/${id}/${status}`,
      method: 'post'
    })
  },
  update(post) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: post
    })
  },
  getPostById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  removeByIds(ids) {
    return request({
      url: `${api_name}/del`,
      method: 'delete',
      data: ids
    })
  }
}
