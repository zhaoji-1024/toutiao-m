<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="加载失败，请点击重试"
    >
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import {get_search_results} from '@/api/search'
export default {
  name: 'search-result',
  props: {
    search_text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  methods: {
    async onLoad() {
      try {
        const {data} = await get_search_results({
          page: this.page,
          per_page: this.per_page,
          q: this.search_text
        })
        // if (Math.random() > 0.5) JSON.parse('qsqs')  模拟请求失败情况
        const {results} = data.data 
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
      //1 请求获取数据

      //2 将数据push到数组列表中
      //3 将本次加载中的loading关闭
      //4 判断是否还有数据

    },
  },
}
</script>

<style lang="less" scoped>
</style>