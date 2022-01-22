<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed class="page-nav-bar">
      <van-button
      to="/search"
        class="search-btn"
        icon="search"
        type="info"
        size="small"
        round
        slot="title"
        >搜索
      </van-button>
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <van-tabs border class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <ArticleList :channel="channel" />
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        @click="is_chennel_edit_show = true"
        slot="nav-right"
        class="hambuger-btn"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="is_chennel_edit_show"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <channeledit
        @update_active="on_update_active"
        :active="active"
        :my-channels="channels"
      />
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>
<script>
import { get_user_channels } from '@/api/user'
import ArticleList from './components/article_list'
import channeledit from './components/channel_edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    channeledit,
  },
  data() {
    return {
      active: 0,
      channels: [], //频道列表
      is_chennel_edit_show: false, //控制编辑频道弹出层是否显示
    }
  },
  created() {
    this.load_channels()
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    on_update_active(index, is_chennel_edit_show = true) {
      this.active = index
      this.is_chennel_edit_show = is_chennel_edit_show
    },
    async load_channels() {
      try {
        let channels = []
        if (this.user) {
          //已登录
          const { data } = await get_user_channels()
          channels = data.data.channels
        } else {
          //未登录
          // 判断本地是否存有频道列表数据
          const local_cahnnels = getItem('TOUTIAO_CHANNELS')
          if (local_cahnnels) { //有的话加载本地数据
            channels = local_cahnnels
          } else {  //没有的话再加载后台默认频道列表数据
            const { data } = await get_user_channels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
  },
}
</script>
<style scoped lang="less">
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    height: 64px;
    width: 555px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;

    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      height: 82px;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }

    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }

    .van-tab--active {
      color: #333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      width: 50px;
      height: 82px;
      flex-shrink: 0;
    }

    .hambuger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;

      i.toutiao {
        font-size: 33px;
      }

      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
