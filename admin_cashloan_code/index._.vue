<template>
  <el-row id="page">
    <script type="text/template" id="html-head">
      <link href="_lib/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <style> html,body { height: 100%; padding: 0px; margin: 0px; } </style>
    </script>
    <el-col v-if="menuAuth&& ((!menuFloat)||menuShow)" :xs=24 :sm=7 :md=5 :lg=4 :class="menuFloat?'menubar floating':(menuCollapse?'menubar collapse':'menubar')">
      <el-menu
        ref="demoMenu"
        background-color="#2A3F54"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="vertical"
        :default-active="selectedMenu"
        :collapse="menuCollapse"
        @select="onMenuSelect"
        >
        <li v-if="siteConfig && siteConfig.titleObj" class="site-title" @click="menuTitleClicked">
          <i v-if="siteConfig.titleObj.iconClass" :class="siteConfig.titleObj.iconClass"></i>
          <img v-if="siteConfig.titleObj.imgUrl" :src="siteConfig.titleObj.imgUrl">
          <div class="_title">{{siteConfig.titleObj.title}}</div>
          <div style="clear: both;"></div>
        </li>
        <template v-if="menuList&&menuList.length">
        <template v-for="menu in menuList">
          <hr v-if="menu.hr && menu.auth" :key="menu.name + '__hr'">
          <el-submenu v-if="menu.submenus && menu.title && !menu.demo && menu.auth" :index="menu.name" :key="menu.name">
            <template slot="title">
              <i v-if="menu.iconClass" :class="menu.iconClass"></i>
              <span slot="title">{{menu.title}}</span>
            </template>
            <template v-for="submenu in menu.submenus" v-if="submenu.auth">
              <el-submenu v-if="submenu.submenus" :index="submenu.name" :key="submenu.name">
                <template slot="title">
                  <i v-if="submenu.iconClass" :class="submenu.iconClass"></i>
                  <span slot="title">{{submenu.title}}</span>
                </template>
                <el-menu-item v-for="submenu2 in submenu.submenus" v-if="submenu2.auth" :index="submenu2.url" :key="submenu2.url">{{submenu2.title}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="submenu.url" :key="submenu.url">{{submenu.title}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-if="!menu.submenus && menu.title && !menu.demo && menu.auth" :index="menu.url" :key="menu.name?menu.name:menu.url">
            <i v-if="menu.iconClass" :class="menu.iconClass"></i>
            <template slot="title">
              <span slot="title">{{menu.title}}</span>
            </template>
          </el-menu-item>
        </template>
        </template>
        <template v-else>
          <el-submenu index="loading" key="loading">
            <template slot="title">
              <i class="el-icon-loading"></i>
              <span slot="title" class="hidden-xs-only">加载中...</span>
            </template>
            <el-menu-item-group class="hidden-sm-and-up">
              <template slot="title">加载中...</template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
    <el-col :xs=24 :sm=17 :md=19 :lg=20 :style="(menuAuth?((menuCollapse&&!menuFloat)?'width:calc(100% - 64px);':''):'width:100%;') + 'height: 100%;'">
      <div class="el-header">
        <div style="float: left;">
          <span class="hidden-xs-only">
            <el-button size="medium" v-if="menuAuth" :icon="menuCollapse?'el-icon-arrow-right':'el-icon-arrow-left'" @click="menuCollapse=!menuCollapse" circle></el-button>
            现金贷管理系统
          </span>
          <span v-if="menuAuth" class="hidden-sm-and-up">
            <el-button size="medium" :icon="menuShow?'el-icon-arrow-up':'fa fa-bars'" @click="menuCollapse=true;menuShow=!menuShow" circle></el-button>
          </span>
        </div>
        <div style="float: right; text-align: right;">
          <el-dropdown size="small" split-button :type="Auth.login?'success':'primary'" :hide-timeout=1000 @click="onAccountCommand(Auth.login?'toLogout':'toLogin')" @command="onAccountCommand">
            {{Auth.login?'退出':'登录'}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="Auth.login" command="toChangePassword">修改密码</el-dropdown-item>
              <el-dropdown-item v-if="!Auth.login" command="toLogin">登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-if="Env.mock">
            <el-button size="small">
              <span class="hidden-xs-only">测试</span>引导<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="background-color: #2A3F54; color: #fff; padding: 20px 24px 20px 0px; font-size: 14px;">
              <span v-if="DemoSetting.pageTips[selectedMenu]" v-html="'<ul><li>'+DemoSetting.pageTips[selectedMenu].join('</li><br><li>') + '</li><ul/>'"></span>
              <span v-else v-html="'<ul><li>'+DemoSetting.defaultPageTip.join('</li><br><li>') + '</li><ul/>'"></span>
            </el-dropdown-menu>
          </el-dropdown>
          <DemoLoginCtx v-if="Env.mock" ref="demoLoginCtx" @submit="onDemoAuthCtxSubmit"></DemoLoginCtx>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div class="el-main">
        <iframe v-if="mainFrameSrc" id="mainframe" name="mainframe" frameborder="0" scrolling="0" width="100%" :src="mainFrameSrc"></iframe>
        <h4 v-else>欢迎使用风驰信贷-现金贷管理系统！</h4>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// code_tip: 因为内部有iframe，导致local环境调试的时候，无法查看本页的源代码，所以吧js部分单独到vue.js中
import Page from './index.js'
export default Page
</script>

<style scoped>
.menubar >.el-menu .site-title {
  color: white;
}
.menubar >.el-menu .site-title i.fa {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border-radius: 1000px;
  border: solid 1px white;
}
.el-header {
  background-color: #EDEDED;
  color: #333;
  line-height: 44px;
  font-size: 16px;
  padding: 0px 10px;
}
.el-main {
  margin: 0px;
  padding: 10px;
  height: calc(100% - 53px);
  z-index: 900;
  -webkit-overflow-scrolling: touch;
}
.el-main iframe {
  border: none;
  min-height: calc(100% - 50px);
  /*border: solid 1px #eeeeee;*/
  /*width: calc(100% - 2px)*/
}
</style>
