<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        @click="is_edit = !is_edit"
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        >{{ is_edit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="on_my_channel_click(channel, index)"
      >
        <van-icon
          v-show="is_edit && !fixed_channels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="(channel, index) in recommned_channels"
        :key="index"
        :text="channel.name"
        @click="on_add_channel(channel)"
      />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import {
  get_all_channels,
  add_user_channel,
  delete_user_channel,
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(['user']),
    recommned_channels() {
      return this.all_channels.filter((channel) => {
        return !this.myChannels.find((my_channel) => {
          return my_channel.id === channel.id
        })
      })
    },
  },
  data() {
    return {
      all_channels: [], //所有频道
      is_edit: false, //控制编辑按钮的显示与否
      fixed_channels: [0], // 固定频道  不允许删除
    }
  },
  created() {
    this.load_all_channels()
  },
  methods: {
    async delete_channel(channel) {
      try {
        if (this.user) {
          delete_user_channel(channel.id)
        } else {
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍候重试')
      }
    },
    on_my_channel_click(channel, index) {
      //编辑状态执行删除操作
      if (this.is_edit) {
        if (this.fixed_channels.includes(index)) return
        if (index <= this.active) {
          this.$emit('update_active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)
        //处理持久化
        this.delete_channel(channel)
      } else {
        //非编辑状态执行切换频道操作
        this.$emit('update_active', index, false)
      }
    },
    async load_all_channels() {
      try {
        const { data } = await get_all_channels()
        this.all_channels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async on_add_channel(channel) {
      this.myChannels.push(channel)
      if (this.user) {
        //已登录状态下
        try {
          await add_user_channel({
            id: channel.id,
            seq: this.myChannels.length,
          })
        } catch (err) {
          this.$toast('保存失败，请稍候重试')
        }
      } else {
        //未登录状态下把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
  },
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .van-grid-item__content {
    white-space: nowrap;
    width: 160px;
    height: 86px;
    background-color: #f4f5f6;
    .van-grid-item__text,
    .text {
      font-size: 28px;
      color: #222;
      margin-top: 0;
    }
    .active {
      color: red;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>