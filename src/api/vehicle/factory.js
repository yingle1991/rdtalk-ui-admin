import request from '@/utils/request'

// 创建工厂配置
export function createFactory(data) {
  return request({
    url: '/vehicle/factory/create',
    method: 'post',
    data: data
  })
}

// 更新工厂配置
export function updateFactory(data) {
  return request({
    url: '/vehicle/factory/update',
    method: 'put',
    data: data
  })
}

// 删除工厂配置
export function deleteFactory(id) {
  return request({
    url: '/vehicle/factory/delete?id=' + id,
    method: 'delete'
  })
}

// 获得工厂配置
export function getFactory(id) {
  return request({
    url: '/vehicle/factory/get?id=' + id,
    method: 'get'
  })
}

// 获得工厂配置分页
export function getFactoryPage(query) {
  return request({
    url: '/vehicle/factory/page',
    method: 'get',
    params: query
  })
}

// 导出工厂配置 Excel
export function exportFactoryExcel(query) {
  return request({
    url: '/vehicle/factory/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
