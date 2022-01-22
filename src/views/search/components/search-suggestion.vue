<template>
  <div class="search-suggestion">
    <van-cell @click="$emit('search', text)" v-for="(text, index) in suggestions" :key="index" icon="search">
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import {get_search_suggestion} from '@/api/search'
import {debounce} from 'lodash'
export default {
  name: 'search-suggestion',
  created() {
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []  //联想建议数据列表
    }
  },
  watch: {
    searchText: {
      handler: debounce(function(val) {
        this.load_search_suggestion(val)
      }, 1000),
      immediate: true  //侦听开始之后立即触发
    },
  },
  methods: {
    async load_search_suggestion (q) {
      try {
        const {data} = await get_search_suggestion(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍候重试')
      }
    },
    highlight (text) {
      if (text === null) return null
      // 需要根据数据变量创建正则表达式 则需要手动new一个正则表达式, 第二个参数是匹配模式
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, `<span class="active">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: red;
  }
}
</style>