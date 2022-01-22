//  评论请求模块

import request from '@/utils/request'

// 获取文章评论列表
export const get_comments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论点赞
export const add_comment_like = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消评论点赞
export const delete_comment_like = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 发布文章评论或评论回复
export const add_comment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}