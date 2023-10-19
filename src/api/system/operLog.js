import request from '@/utils/request'

const api_name = '/admin/system/operLog'

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

  getOne(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  }
}
