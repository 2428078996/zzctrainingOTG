import request from '@/utils/request'

/*
菜单管理相关的API请求函数
*/
const api_name = '/admin/system/dept'

export default {

  /*
  获取权限(菜单/功能)列表
  */
  findNodes() {
    return request({
      url: `${api_name}/list`,
      method: 'get'
    })
  },

  /*
  删除
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  // 修改菜单的状态（无子菜单才可修改）
  changeMenuStatus(id, status) {
    return request({
      url: `${api_name}/${id}/${status}`,
      method: 'post'
    })
  },

  /*
  保存
  */
  save(dept) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: dept
    })
  },

  /*
  更新
  */
  updateById(dept) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: dept
    })
  }
}
