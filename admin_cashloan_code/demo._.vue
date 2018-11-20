<template>
  <el-row id="page">
    <script type="text/template" id="html-head">
      <link href="_lib/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <style> html,body { height: 100%; padding: 0px; margin: 0px; } </style>
    </script>
    <el-col v-if="(!menuFloat)||menuShow" :xs=24 :sm=7 :md=5 :lg=4 :class="menuFloat?'menubar floating':(menuCollapse?'menubar collapse':'menubar')">
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
        <template v-for="menu in menuList">
          <hr v-if="menu.hr" :key="menu.name + '__hr'">
          <el-submenu v-if="menu.submenus && menu.title" :index="menu.name" :key="menu.name">
            <template slot="title">
              <i v-if="menu.iconClass" :class="menu.iconClass"></i>
              <span slot="title">{{menu.title}}</span>
            </template>
            <template v-for="submenu in menu.submenus">
              <el-submenu v-if="submenu.submenus" :index="submenu.name" :key="submenu.name">
                <template slot="title">
                  <i v-if="submenu.iconClass" :class="submenu.iconClass"></i>
                  <span slot="title">{{submenu.title}}</span>
                </template>
                <el-menu-item v-for="submenu2 in submenu.submenus" :index="submenu2.url" :key="submenu2.url">{{submenu2.title}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="submenu.url" :key="submenu.url">{{submenu.title}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-if="!menu.submenus && menu.title" :index="menu.url" :key="menu.name?menu.name:menu.url">
            <i v-if="menu.iconClass" :class="menu.iconClass"></i>
            <template slot="title">
              <span slot="title">{{menu.title}}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <el-col :xs=24 :sm=17 :md=19 :lg=20 :style="((menuCollapse&&!menuFloat)?'width:calc(100% - 64px);':'') + 'height: 100%;'">
      <div class="el-header">
        <div style="float: left;">
          <span class="hidden-xs-only">
            <el-button :icon="menuCollapse?'el-icon-arrow-right':'el-icon-arrow-left'" @click="menuCollapse=!menuCollapse" size="small" circle></el-button>
            Demo版
          </span>
          <span class="hidden-sm-and-up">
            <el-button :icon="menuShow?'el-icon-arrow-up':'fa fa-bars'" @click="menuCollapse=true;menuShow=!menuShow" size="small" circle></el-button>
          </span>
        </div>
        <div style="float: right; text-align: right;">
          <el-dropdown>
            <el-button size="small">
              <span class="hidden-xs-only">测试</span>引导<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="background-color: #2A3F54; color: #fff; padding: 20px 24px 20px 0px; font-size: 14px;">
              <span v-if="DemoSetting.pageTips[selectedMenu]" v-html="'<ul><li>'+DemoSetting.pageTips[selectedMenu].join('</li><br><li>') + '</li><ul/>'"></span>
              <span v-else v-html="'<ul><li>'+DemoSetting.defaultPageTip.join('</li><br><li>') + '</li><ul/>'"></span>
            </el-dropdown-menu>
          </el-dropdown>
          <DemoLoginCtx ref="demoLoginCtx" @submit="onDemoAuthCtxSubmit"></DemoLoginCtx>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div class="el-main">
        <iframe v-if="mainFrameSrc" id="mainframe" name="mainframe" frameborder="0" scrolling="0" width="100%" :src="mainFrameSrc"></iframe>
        <h4 v-else>这是Demo首页，请点击左侧菜单，选择页面</h4>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import Frameset from '@/frameset.js'
import Auth from '@/auth.js'
import Env from '~/__env/env.js'
import Common from '~/_js/common.js'
import Server from '~/_js/server.js'
import PageAuthSetting from '~/_js/frame/page_auth_setting.js'
import DemoMenu from '~/_js/frame/menu.js'
import DemoSetting from '~/_js/frame/setting.js'
import DemoLoginCtx from '@/DemoLoginCtx'

Vue.use(ElementUI)
const Message = ElementUI.Message

Common.initHtmlHead('CashLoanAdmin Demo')

let _data = {
  siteConfig: DemoSetting.siteConfig,
  menuFloat: false,
  menuShow: true,
  menuCollapse: false,
  menuList: Common.mergeArrayByKey(DemoMenu, DemoSetting.menuViewConfig, 'name'),
  mainFrameSrc: self.location.hash ? self.location.hash.substr(1) : '',
  selectedMenu: Common.getPath(self.location.hash ? self.location.hash.substr(1) : ''),
  Env: Env,
  DemoSetting: DemoSetting
}

var _mainFrameEle = document.getElementById('mainframe')

let Page
export default {
  components: {
    DemoLoginCtx
  },
  data () {
    return _data
  },
  computed: {
  },
  created () {
    Page = this
    if (document.body.offsetWidth > 1056) {
      _data.menuCollapse = false
    } else if (document.body.offsetWidth > 768) {
      _data.menuCollapse = true
    } else {
      _data.menuShow = false
      _data.menuFloat = true
    }

    let pageAuthConfigs = {}
    for (let componentPrefix in PageAuthSetting) {
      for (let pageUri in PageAuthSetting[componentPrefix]) {
        let fullPageUrl = Server.fullPageUrl(componentPrefix + pageUri)
        pageAuthConfigs[fullPageUrl] = PageAuthSetting[componentPrefix][pageUri]
      }
    }
    Auth.setPageAuthConfigs(pageAuthConfigs)
  },
  mounted () {
    Env.systemId = this.$refs.demoLoginCtx.init(Env.systemId, DemoSetting.demoAuthorityKeys, DemoSetting.initDemoAuthCtx)

    Auth.setLoginCtx(this.$refs.demoLoginCtx.ctx)

    _mainFrameEle = document.getElementById('mainframe')
    Frameset.Parent.init({
      onSonCreatedFunc: this.onSonCreated,
      onSonFlowDoneFunc: this.onSonFlowDone,
      onSonErrorFunc: this.onSonError,
      sonGoUrlFunc: this.sonGoUrl
    })
    // 权限判断示例
    if (Auth.hasAuth('XXX')) {
      console.log('您有doXxxThing的权限，行为权限测试通过！')
    }
  },
  methods: {
    onLoadError: function (errorModule, errorCode, errorMsg) {
      Message.error({
        duration: 0,
        showClose: true,
        message: '加载失败！' + errorModule + '.' + errorCode + '/' + errorMsg
      })
    },
    onActionError: function (errorModule, errorCode, errorMsg) {
      Message.error({
        duration: 0,
        showClose: true,
        message: '操作失败！' + errorModule + '.' + errorCode + '/' + errorMsg
      })
    },
    menuTitleClicked: function () {
      Page.mainFrameGoUrl(DemoSetting.siteConfig.titleObj.url)
      _data.menuShow = false
    },
    onMenuSelect: function (index, indexPath) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      Page.mainFrameGoUrl(index)
      _data.menuShow = false
    },
    mainFrameGoUrl: function (toUrl) {
      if (toUrl !== '') {
        toUrl = Server.pageUrl(toUrl)
        _data.mainFrameSrc = toUrl + '#iframerand' + Math.random()
      } else {
        _data.mainFrameSrc = ''
      }
      _data.selectedMenu = toUrl
      history.replaceState('', '', '#' + toUrl) // 不使用location.hash是因为不想产生新历史记录
    },
    sonGoUrl: function (iframeEle, toUrl, toTarget, fromUrl) {
      if (toTarget) {
        toUrl = Server.pageUrl(toUrl, fromUrl)
        window.open(Common.getPathQuery() + '#' + toUrl, toTarget)
        return
      }
      if (iframeEle === _mainFrameEle) {
        Page.mainFrameGoUrl(toUrl)
      } else {
        if (toUrl === null) {
          toUrl = ''
        }
        iframeEle.src = toUrl
      }
    },
    onSonCreated: function (iframeEle, pageUrl) {
      var pageRelativePath = Common.getRelativePath(pageUrl)
      _data.selectedMenu = pageRelativePath
      history.replaceState('', '', '#' + pageRelativePath + Common.getQueryHashString(pageUrl)) // 不使用location.hash是因为不想产生新历史记录
      Frameset.Parent.sendLoginCtx(iframeEle.name, Env, this.$refs.demoLoginCtx.ctx, Auth.getPageConfigs(Server.fullPageUrl(pageRelativePath)))
    },
    onSonFlowDone: function (iframeEle, pageUrl, data) {
      var pageRelativePath = Common.getRelativePath(pageUrl)
      if (iframeEle.name === 'mainframe') {
        if (pageRelativePath === 'demo/form.html') {
          Message.success({
            message: '操作成功：' + JSON.stringify(data) + '，          下一步...'
          })
          Page.mainFrameGoUrl('demo/table.html')
        }
      }
    },
    onSonError: function (iframeEle, pageUrl, errorModule, errorCode, errorMsg) {
      switch (errorCode) {
        case Auth.ErrorCode.NOT_LOGIN.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '请先登录！'
          })

          Page.localLogout(true)
          break
        case Auth.ErrorCode.URI_AUTH.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '您无该操作权限！'
          })

          break
        case Auth.ErrorCode.DATA_AUTH.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '数据权限错误！'
          })

          break
        case Auth.ErrorCode.KICKED_OUT.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '账号在他处登录，您已被迫下线！'
          })

          Page.localLogout(true)
          break
        case Auth.ErrorCode.PAGE_AUTH.v:
          Message.error({
            duration: 3000,
            showClose: true,
            message: '您无权访问该页面，为您跳转前一个页面！',
            onClose: function () {
              Message.warning({
                duration: 3000,
                showClose: true,
                message: '为了调试，跳转代码被注释掉了'
              })
              // Frameset.Parent.sendGoUrl('mainframe', -1)
            }
          })

          break
        default:
          Page.onActionError(errorModule, errorCode, errorMsg)
      }
    },
    localLogout: function (noTip) {
      Message.warning({
        duration: 3000,
        showClose: true,
        message: '为了调试，清除session，并跳转到登录页的代码被去掉了'
      })
    },
    onDemoAuthCtxSubmit: function (demoLoginCtx) {
      console.log(demoLoginCtx)
      Env.systemId = demoLoginCtx.systemId
      Frameset.Parent.sendLoginCtx('mainframe', Env, demoLoginCtx, Auth.getPageConfigs(Server.fullPageUrl(_data.selectedMenu)))
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: yellow;
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
  /*border: solid 1px #eeeeee;*/
  /*width: calc(100% - 2px)*/
}
</style>
