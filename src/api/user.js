// 用户请求相关模块

import request from '@/utils/request'

export const login = data => {
	return request({
		method: 'POST',
		url: '/v1_0/authorizations',
		data
	})
}

// 发送验证码 每个手机号一分钟仅限一次
export const send_sms = mobile => {
	return request({
		method: 'GET',
		url: `/v1_0/sms/codes/${mobile}`
	})
}

// 获取用户自己的信息
export const get_user_info = () => {
	return request({
		method: 'GET',
		url: '/v1_0/user',
	})
}

// 获取用户频道列表
export const get_user_channels = () => {
	return request({
		method: 'GET',
		url: '/v1_0/user/channels',
	})
}

// 关注用户
export const add_follow = (target) => {
	return request({
		method: 'POST',
		url: '/v1_0/user/followings',
    data: {
      target
    }
	})
}

// 取消关注用户
export const delete_follow = (target) => {
	return request({
		method: 'DELETE',
		url: `/v1_0/user/followings/${target}`,
    data: {
      target
    }
	})
}

// 获取当前登录用户的个人资料
export const get_user_profile = () => {
	return request({
		method: 'GET',
		url: '/v1_0/user/profile',
	})
}

// 更新当前登录用户的个人资料
export const update_user_profile = (data) => {
	return request({
		method: 'PATCH',
		url: '/v1_0/user/profile',
    data
	})
}

// 更新当前登录用户的照片资料
export const update_user_photo = (data) => {
	return request({
		method: 'PATCH',
		url: '/v1_0/user/photo',
    data
	})
}