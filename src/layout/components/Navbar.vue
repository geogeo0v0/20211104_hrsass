<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      geogeoooooo 0v0 ~~~
    </div>

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            src="staffPhoto"
            class="user-avatar"
            v-imgerror="defaultImg"
          >
          <span
            class="name"
            v-defaultColor="'#194a50'"
          >{{name}}</span>
          <i
            class="el-icon-caret-bottom"
            style="color:#fff"
          />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://xxx.com"
          >
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item
            divided
            @click.native="clickLogout"
          >
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import imgerror from '@/assets/404_images/imgerror.jpg'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      defaultImg: imgerror
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'staffPhoto'
    ])
  },
  created() {
  },
  methods: {
    ...mapActions('user', ['logout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    clickLogout() {
      // 清除用戶信息和token
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff ;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
    color: #97a8be;
  cursor: text;

}

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

     .avatar-wrapper {
  position: relative;

  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    vertical-align: middle;
  }
  .name {
    cursor: pointer;
    color: #5a5e66;
    vertical-align: middle;
    margin-left:5px;
  }
  .user-dropdown {
    color: #5a5e66;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 20px;
    font-size: 12px;
  }
}
    }
  }
}
</style>
