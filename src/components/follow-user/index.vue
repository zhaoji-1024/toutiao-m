<template>
  <van-button
    :loading="loading"
    @click="on_follow"
    v-if="is_followed"
    class="follow-btn"
    round
    size="small"
    >已关注</van-button
  >
  <van-button
    :loading="loading"
    @click="on_follow"
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    >关注</van-button
  >
</template>

<script>
import { add_follow, delete_follow } from '@/api/user'

export default {
  name: 'FollowUser',
  props: {
    is_followed: {
      type: Boolean,
      required: true,
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async on_follow() {
      this.loading = true //显示按钮的loading状态
      try {
        if (this.is_followed) {
          //已关注则取消关注
          await delete_follow(this.user_id)
        } else {
          // 未关注则添加关注
          await add_follow(this.user_id)
        }
        this.$emit('update-is_followed', !this.is_followed)
      } catch (err) {
        let message = '操作失败'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false
    },
  },
}
</script>