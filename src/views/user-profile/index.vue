<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      @click-left="$router.back()"
      left-arrow
      class="page-nav-bar"
      title="个人信息"
    ></van-nav-bar>
    <!-- 导航栏 -->

    <input type="file" hidden ref="file" @change="on_file_change">

    <!-- 个人信息 -->
    <van-cell @click="$refs['file'].click()" title="头像" is-link>
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="user.photo"
      ></van-image>
    </van-cell>
    <van-cell @click="is_update_name_show = true" title="昵称" :value="user.name" is-link></van-cell>
    <van-cell @click="is_update_gender_show = true" title="性别" :value="user.gender === 0 ? '男' : '女'" is-link></van-cell>
    <van-cell @click="is_update_birthday_show = true" title="生日" :value="user.birthday" is-link></van-cell>
    <!-- 个人信息 -->

    <!-- 编辑昵称弹出层 -->
    <van-popup position="bottom" v-model="is_update_name_show" style="height: 100%">
      <update-name v-if="is_update_name_show" v-model="user.name" @close="is_update_name_show = false"></update-name>
    </van-popup>
    <!-- 编辑昵称弹出层 -->

    <!-- 编辑性别弹出层 -->
    <van-popup position="bottom" v-model="is_update_gender_show">
      <update-gender v-if="is_update_gender_show" v-model="user.gender" @close="is_update_gender_show = false"></update-gender>
    </van-popup>
    <!-- 编辑性别弹出层 -->

    <!-- 编辑生日弹出层 -->
    <van-popup position="bottom" v-model="is_update_birthday_show">
      <update-birthday v-if="is_update_birthday_show" v-model="user.birthday" @close="is_update_birthday_show = false"></update-birthday>
    </van-popup>
    <!-- 编辑生日弹出层 -->

    <!-- 编辑头像弹出层 -->
    <van-popup position="bottom" v-model="is_update_photo_show" style="height: 100%">
      <update-photo @update-photo="user.photo = $event" v-if="is_update_photo_show" @close="is_update_photo_show = false" :img="img"></update-photo>
    </van-popup>
    <!-- 编辑头像弹出层 -->
  </div>
</template>

<script>
import {get_user_profile} from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created () {
    this.load_use_profile()
  },
  data () {
    return {
      is_update_name_show: false,
      user: {},  //用户个人信息
      is_update_gender_show: false,
      is_update_birthday_show: false,
      is_update_photo_show: false,
      img: null
    }
  },
  methods: {
    async load_use_profile () {
      try {
        const {data} = await get_user_profile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    on_file_change () {
      const file = this.$refs.file.files[0]
      this.img = window.URL.createObjectURL(file)
      this.is_update_photo_show = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>