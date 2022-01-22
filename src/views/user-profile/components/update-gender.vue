<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="value"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { update_user_profile } from '@/api/user'
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ['男', '女'],
      local_gender: this.value
    }
  },
  methods: {
    onPickerChange (picker, value, index) {
      this.local_gender = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0,
      })
      try {
        const local_gender = this.local_gender
        await update_user_profile({
          gender: local_gender,
        })
        this.$emit('input', local_gender)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>