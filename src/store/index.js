import Vue from 'vue'
import Vuex from 'vuex'
import {getItem, setItem} from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
  	user: getItem(TOKEN_KEY)  //用于存储当前登录的用户信息
  },
  mutations: {
  	set_user (state, data) {
  		state.user = data
  		// 防止刷新页面丢失token  需要将token持久化到本地存储
  		setItem(TOKEN_KEY, state.user)
  	}
  },
  actions: {
  },
  modules: {
  }
})
