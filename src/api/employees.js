
import request from '@/utils/request'

/**
 * 获取员工的简单列表
 * **/
export function reqGetEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工的综合列表数据 (分页)
 * ***/
export function reqGetEmployeeList(page, size) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}

/**
 * 删除员工 ()
 */
export function reqDelEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/** **
 *  新增员工的接口
 * **/
export function reqAddEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/** *
 * 封装一个批量导入员工的接口
 * data: [{}, {}, {}, {}, ... ]
 * ***/
export function reqImportEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/** *
 * 保存员工的基本信息
 * **/
export function reqSaveUserDetailById(data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}