import request from '@/utils/request'
/**
 * 获取角色列表
 * ***/
export function reqGetRoleList(page, pagesize) {
  return request({
    method: 'get',
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}

/**
 * 删除角色
 ***/
export function reqDeleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/** *
 * 新增角色
 * ***/
export function reqAddRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/** *
 * 修改角色
 * **/
export function reqUpdateRole(data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

/**
 * 根据 id 获取角色详情, 用于回显
 * **/
export function reqGetRoleDetail(id) {
  return request({
    method: 'get',
    url: `/sys/role/${id}`
  })
}