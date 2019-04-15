import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/all',
    method: 'get',
    params: query
  })
}
