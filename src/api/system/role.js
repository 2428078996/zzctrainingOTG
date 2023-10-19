/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/role'

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
  removeById(id) {
    return request({
      url: `${api_name}/del/${id}`,
      method: 'delete'
    })
  },
  save(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  update(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },
  getRoleById(id) {
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
