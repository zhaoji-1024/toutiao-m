<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="search_text"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="is_result_show = false"
      >
      </van-search>
    </form>
    <!-- 搜索结果 -->
    <search_result :search_text="search_text" v-if="is_result_show" />
    <!-- 搜索结果 -->
    <!-- 联想建议 -->
    <search_suggestion @search="onSearch" :searchText="search_text" v-else-if="search_text" />
    <!-- 联想建议 -->
    <!-- 搜索栏 -->
    <!-- 搜索历史记录 -->
    <search_history v-else />
    <!-- 搜索历史记录 -->
  </div>
</template>

<script>
import search_history from './components/search-history'
import search_suggestion from './components/search-suggestion'
import search_result from './components/search-result'
import router from '@/router'
export default {
  name: 'search_index',
  components: {
    search_history,
    search_suggestion,
    search_result,
  },
  data() {
    return {
      search_text: '',
      is_result_show: false  //控制搜索结果是否展示
    }
  },
  methods: {
    onSearch(val) {
      this.search_text = val
      this.is_result_show = true
    },
    onCancel() {
      router.push('/')
    },
  },
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }

  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>