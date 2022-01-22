<template>
  <van-button :loading="loading" @click="on_collect" :class="{collected: value}" :icon="value ? 'star' : 'star-o'" />
</template>

<script>
import {add_collect, delete_collect} from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    article_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async on_collect () {
      this.loading = true
      try {
        if (this.value) {
          await delete_collect(this.article_id)
        } else {
          await add_collect(this.article_id)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('操作失败 请稍候重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
  .collected {
    .van-icon {
      color: #ffa500;
    }
  }
</style>