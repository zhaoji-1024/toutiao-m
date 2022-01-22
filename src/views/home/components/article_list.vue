<template>
  <div class="article-list">
    <van-pull-refresh success-duration="1500" :success-text="refresh_success_text" v-model="is_refresh_loading" @refresh="onRefresh">
      <van-list :error.sync="error" error-text="请求失败，点击重新加载" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ArticleItem :article="article" v-for="(article, index) in list" :key="index" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { get_articles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'article-list',
  components: {
  	ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中loading的状态
      finished: false, //控制数据加载结束的状态
      timestamp: null, //请求获取下一页数据的时间戳
      error: false, //控制列表加载失败提示状态
      is_refresh_loading: false, //控制下拉刷新的状态
      refresh_success_text: '刷新成功' //下拉刷新成功提示文本
    }
  },
  methods: {
    async onLoad() {
      try {
        //1请求获取数据
        const { data } = await get_articles({ channel_id: this.channel.id, timestamp: this.timestamp || Date.now() })
        // if (Math.random() > 0.5) JSON.parse('wqdwqdwd')  模拟请求失败的情况
        const { results } = data.data
        //2把数据放到list数组中
        this.list.push(...results)
        // 3本次加载结束后将加载状态设置为false
        this.loading = false

        // 判断数据是否全部加载完成
        if (results.length) {
          //更新时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          //此时已经没有数据了将finished设置为true
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        concole.log('请求失败', err)
      }
    },
    async onRefresh() { //下拉刷新触发的事件处理函数
    	try {
    		const {data} = await get_articles({
    			channel_id: this.channel.id,
    			timestamp: Date.now()
    		})
    		// if (Math.random() > 0.2) JSON.parse('wqdwqdwd')  模拟刷新失败的情况
    		const {results} = data.data
    		this.list.unshift(...results)
    		this.is_refresh_loading = false
    		this.refresh_success_text = `刷新成功 更新了${results.length}条数据`
    	} catch (err) {
    		this.is_refresh_loading = false
    		this.refresh_success_text = '刷新失败'
    	}
     }

  }
}

</script>
<style scoped lang="less">
.article-list {
	height: 79vh;
	overflow-y: auto;
}
</style>
