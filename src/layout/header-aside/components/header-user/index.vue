<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="toPersonalData">
        <i class="el-icon-postcard" style="font-size: 16px"></i>
        个人信息
      </el-dropdown-item>
      <el-dropdown-item @click.native="toSystem" v-if="judgeAuthority()">
        <i class="el-icon-setting" style="font-size: 16px"></i>
        系统设置
      </el-dropdown-item>
      <!-- @click.native="helpFeedback" -->
      <el-dropdown-item >
        <i class="el-icon-chat-line-square" style="font-size: 16px"></i>
        帮助反馈
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <i class="el-icon-switch-button" style="font-size: 16px"></i>
        退出登录
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    toPersonalData(){
      this.$router.push({
          path: '/personal-information/personal-data'
      })
    },
    /**
     * @description 跳转系统设置界面
     */
    toSystem () {
      this.$router.push({
        path: '/systemManagement/organize'
      })
    },
    // 帮助反馈
    helpFeedback () {
      this.$router.push({
        path: '/helpFeedback'
      })
    },
    judgeAuthority () {
      let item = this.$router.options.routes.find (f => f.path === '/systemManagement')
      if (item) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
