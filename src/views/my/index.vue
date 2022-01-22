<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="user_info.photo" />
          <span class="name">{{user_info.name}}</span>
        </div>
        <div class="right">
          <van-button to="/user/profile" size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{user_info.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{user_info.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{user_info.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{user_info.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 已登录头部 -->
    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png">
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- 未登录头部 -->
    <!-- 宫格导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 宫格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell clickable @click="on_logout" v-if="user" class="logout-cell" title="退出登录" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {get_user_info} from '@/api/user'
export default {

  name: 'MyIndex',
  data() {
    return {
    	user_info: {} //用户信息
    }
  },
  created () {
  	if (this.user) this.load_user_info()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    on_logout() {
      console.log('on_logout')
      // 退出提示
      this.$dialog.confirm({
          title: '确认退出吗？',
        })
        .then(() => {
        	// 确认退出的话清除登录状态 （容器的user和本地存储的user）
        	this.$store.commit('set_user', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    async load_user_info(){
    	try	 {
    		const {data} = await get_user_info()
    		this.user_info = data.data
    	} catch (err) {
    		this.$toast('获取数据失败，请稍候重试')
    	}
    }
  }
}

</script>
<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .mobile-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }

      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }

        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }

    .data-stats {
      display: flex;

      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;

        .count {
          font-size: 36px;
        }

        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    margin-bottom: 10px;

    .grid-item {
      height: 141px;

      i.toutiao {
        font-size: 45px;
      }

      .toutiao-shoucang {
        color: #eb5253;
      }

      .toutiao-lishi {
        color: #ff9d1d;
      }

      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    color: red;
    text-align: center
  }

  .mb-9 {
    margin-bottom: 10px;
  }
}

</style>
