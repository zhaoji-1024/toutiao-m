import request from '@/utils/request'

export const get_search_suggestion = q => {
	return request({
		method: 'GET',
		url: '/v1_0/suggestion',
		params: {
      q
    }
	})
}

export const get_search_results = params => {
	return request({
		method: 'GET',
		url: '/v1_0/search',
		params
	})
}