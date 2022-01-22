<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="on_update"
    ></van-nav-bar>
    <!-- 导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
    <van-field
      v-model.trim="local_name"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
    </div>
    <!-- 输入框 -->
  </div>
</template>

<script>
import {update_user_profile} from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      local_name: this.value
    }
  },
  methods: {
    async on_update () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        const local_name = this.local_name
        if (!local_name.length) {
          this.$toast('昵称不能为空')
          return 
        }
        await update_user_profile({
          name: local_name
        })
        this.$emit('input', local_name)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>