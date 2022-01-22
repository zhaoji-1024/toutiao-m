<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon @click="$router.back()" slot="left" name="cross" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="login_form" @submit="onSubmit">
      <van-field maxlength="11" type="number" :rules="user_form_rules.mobile" v-model="user.mobile" name="mobile" placeholder="请输入手机号">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field maxlength="6" type="number" :rules="user_form_rules.code" v-model="user.code" name="code" placeholder="请输入验证码">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down @finish="is_count_down_show = false" v-if="is_count_down_show" format="ss s" :time="1000 * 60" />
          <van-button v-else native-type="button" @click="on_send_sms" class="send-sms-bth" size="small" round type="default">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, send_sms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      user_form_rules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /1[3|5|7|8]\d{9}/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /\d{6}/, message: '验证码格式错误' }
        ]
      },
      is_count_down_show: false  //是否展示倒计时
    }
  },
  methods: {
    async onSubmit(values) {  //登录事件处理函数
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 给van-field组件配置rules验证规则
      // 在组件中必须使用this.$toast调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //禁用背景点击
        duration: 0 //展示持续时间
      })
      // 提交表单请求数据
      try {
        const {data} = await login(user)
        this.$store.commit('set_user', data.data)
        this.$toast.success('登录成功')
        this.$router.back() // 登录成功后跳转回原页面
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败, 请稍候重试')
        }
      }
      // 根据请求处理后续操作

    },
    async on_send_sms() {  //发送验证码事件处理函数
      // 首先校验手机号
      try {
        await this.$refs.login_form.validate('mobile')
        console.log('验证通过')

      } catch (err) {
        return console.log('验证失败')
      }
      // 验证通过显示倒计时
      this.is_count_down_show = true
      
      // 请求发送验证码
      try {
        await send_sms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.is_count_down_show = false
        if (err.response.status === 429) {
          this.$toast('发送频繁, 请稍候重试')
        } else {
          this.$toast('发送失败，请稍候重试')
        }
      }
    }
  }
}

</script>
<style lang="less">
.login-container {

  .toutiao {
    font-size: 37px;
  }

  .send-sms-bth {
    font-size: 22px;
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
  }

  .login-btn {
    background-color: #6db4fb;
    border: none
  }
}

</style>
