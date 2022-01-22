import Vue from 'vue'

import dayjs from 'dayjs'

//dayjs默认语言为英文  此处配置为中文

import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

//配置使用处理相对时间的插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn')  //全局使用

//定义一个全局过滤器 之后可以在任何组件的模板中使用
Vue.filter('relative_time', value => {
  return dayjs().to(value)
})