/*
用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/user'

export default {

  /*
  获取用户分页列表(带搜索)
  */
  getPageList(data) {
    return request({
      url: `${api_name}/list`,
      method: 'post',
      data
    })
  },
  // 修改状态
  status(id, status) {
    return request({
      url: `${api_name}/${id}/${status}`,
      method: 'post'
    })
  },
  // 根据用户id查询用户已分配的角色
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}/toRole/${userId}`,
      method: 'get'
    })
  },

  // 分配角色
  assignRoles(doAssgin) {
    return request({
      url: `${api_name}/doRole`,
      method: 'post',
      data: doAssgin
    })
  },
  save(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },
  update(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },
  getUserById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  removeByIds(ids) {
    return request({
      url: `${api_name}/remove`,
      method: 'delete',
      data: ids
    })
  }
}
