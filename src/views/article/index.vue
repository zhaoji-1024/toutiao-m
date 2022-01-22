<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar @click-left="onClickLeft" class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relative_time }}
          </div>
          <!-- 模板中的$event就是事件参数 -->
          <follow-user
            class="follow-btn"
            @update-is_followed="article.is_followed = $event"
            :user_id="article.aut_id"
            :is_followed="article.is_followed"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="article-content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :list="comment_list"
          @onload-success="total_comment_count = $event.total_count"
          :source="article.art_id"
        ></comment-list>
        <!-- 文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button @click="is_post_show = true" class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="total_comment_count" color="#777" />
          <collect-article
            :article_id="article.art_id"
            v-model="article.is_collected"
            class="btn-item"
          />
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article_id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="is_post_show" position="bottom">
          <comment-post @post-success="on_post_success" :target="article.art_id"></comment-post>
        </van-popup>
        <!-- 发布评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="err_state === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="load_article" class="retry-btn"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { get_article_by_id } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comments-list'
import CommentPost from './components/comment-post'
import router from '@/router'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      article: {}, //文章详情
      loading: true, //加载中的loading状态
      err_state: 0, //失败的状态码
      follow_loading: false,
      total_comment_count: 0,
      is_post_show: false, //控制发布评论弹出层显示与否
      comment_list: []  //评论列表
    }
  },
  computed: {},
  watch: {},
  created() {
    this.load_article()
  },
  mounted() {},
  methods: {
    preview_image() {
      const article_content = this.$refs['article-content']
      const imgs = article_content.querySelectorAll('img')
      const imgs_url = []
      imgs.forEach((img, index) => {
        imgs_url.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images: imgs_url,
            startPosition: index,
          })
        }
      })
    },
    async load_article() {
      this.loading = true //重新加载时再次显示加载中
      try {
        const { data } = await get_article_by_id(this.articleId)
        // if (Math.random() > 0.5) JSON.parse('wqdwqd')  //模拟请求失败情况
        // 数据驱动视图不是立即的
        this.article = data.data
        // 初始化图片点击预览
        setTimeout(() => {
          this.preview_image()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.err_state = 404
        }
        this.$toast('获取数据失败')
      }
      this.loading = false
    },
    on_post_success (data) {
      this.is_post_show = false
      this.comment_list.unshift(data.new_obj)
    },
    onClickLeft () {
      router.back()
    }
  },
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>