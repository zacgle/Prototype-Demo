import request from '@/utils/request-digital-bot'

export function upload(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}
