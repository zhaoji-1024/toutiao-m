<template>
  <van-button :loading="loading" @click="on_like" :class="{liked: value === 1}" :icon="value === 1 ? 'good-job' : 'good-job-o'" />
</template>

<script>
import {add_like, delete_like} from '@/api/article'

export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    article_id: {
      type: [Number, String, Object],
      reruired: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async on_like (){
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞则取消点赞
          await delete_like(this.article_id)
        } else {
          await add_like(this.article_id)
          status = 1
        }
        this.$emit('input', status)
      } catch (err) {
        this.$toast.fail('操作失败 请重试')
      }
      this.loading = false
    }
  },
}
</script>

<style lang="less" scoped>
  .liked {
    .van-icon {
      color: #e5645f;
    }
  }
</style>