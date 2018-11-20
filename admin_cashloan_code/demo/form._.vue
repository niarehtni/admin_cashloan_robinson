<template>
  <section id="page">
    <script type="text/template" id="html-head">
      <link href="../_lib/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
    </script>
    <header class="title-button-line">
      <div class="page-title">Demo-表单示例页</div>
      <div>
        <el-button size="medium" onclick="history.go(-1)">返回</el-button>
        <el-button size="medium" @click="load">刷新</el-button>
        <a class="el-button size-medium" href="table.html">直接跳转到测试页面-表格</a>
      </div>
      <div class="tip">
        类似表单的页面，请复制本页面代码，然后修改！<br>
        换行了，这是本页的说明文字的示例，操作提示等balabala说明文字，操作提示等balabala说明文字，操作提示等balabala说明文字，操作提示等balabala
      </div>
    </header>
    <section>
      <el-form size="medium" class="size-medium" ref="mainForm" label-width="100%" label-position="left">
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>列表排序：</label></el-col>
          <el-col :xs=24 :sm=10 class="form-value">
            阿斯顿发的方式
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>类目标识：</label></el-col>
          <el-col :xs=24 :sm=10 class="form-value">
            阿斯顿发的方式
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>XX类型：</label></el-col>
          <el-col :xs=24 :sm=10>
            <el-select v-model="mainForm.status" placeholder="请选择">
              <el-option v-for="item in AbcStatus.enums" :key="item.v" :value="item.v" :label="item.s"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>列表排序：</label></el-col>
          <el-col :xs=24 :sm=10>
            <el-input-number type="number" :step=100 v-model="mainForm.rank"></el-input-number>
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>类目标题：</label></el-col>
          <el-col :xs=24 :sm=10>
            <el-input type="text" v-model="mainForm.title"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=4 class="space"></el-col>
          <el-col :xs=24 :sm=4><label>类目说明：</label></el-col>
          <el-col :xs=24 :sm=10>
            <el-input type="textarea" v-model="mainForm.memo" rows=3></el-input>
          </el-col>
        </el-row>
        <el-row :gutter=10>
          <el-col :xs=24 :sm=8 class="space"></el-col>
          <el-col :xs=24 :sm=4 class="full-son">
            <el-button type="primary" @click="onSubmit">下一步</el-button>
          </el-col>
          <el-col :xs=24 :sm=1 class="space"></el-col>
          <el-col :xs=24 :sm=4 class="full-son">
            <el-button onclick="history.go(-1)">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section>
      <span>{{actionTip}}</span>
    </section>
  </section>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import Frameset from '@/frameset.js'
import Auth from '@/auth.js'
import Env from '~/__env/env.js'
import Common from '~/_js/common.js'
import Server from '~/_js/server.js'

Vue.use(ElementUI)
const Message = ElementUI.Message

Common.initHtmlHead('表单示例页面')

// XX状态常量定义
// 实际代码中，常量定义应放在bean.js中
const AbcStatus = Common.enumDef({
  UNPAID: [1, '待支付'],
  PAYING: [2, '支付中'],
  SUCCESS: [3, '支付成功'],
  FAILED: [4, '支付失败'],
  DELIVERED: [5, '已发货'],
  SALESRETURN: [6, '已退货']
})

let _queryObj = Common.getPageQueryObj()

let _data = {
  queryObj: _queryObj,
  mainForm: {},
  AbcStatus: AbcStatus,
  actionTip: ''
}

let Page
export default {
  name: 'Page',
  components: {
  },
  created () {
    Page = this
    Frameset.Son.init({
      reloadFunc: this.load
    })
  },
  mounted () {
    Frameset.Son.sendIframeHeight()
  },
  updated () {
    Frameset.Son.sendIframeHeight()
  },
  data () {
    return _data
  },
  computed: {
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
    load: function () {
      // 检查本页面权限，执行处理器，返回是否有权限。可选参数是未登录处理器和无权限处理器，不传使用server.js中默认的配置的
      if (Auth.checkPageAuth() === false) {
        Message.warning({
          duration: 0,
          showClose: true,
          message: '没有该页面权限，后续代码逻辑都不会执行，页面权限测试通过！'
        })
        return false
      }
      _data.mainForm.systemId = Env.systemId

      // 权限判断示例
      if (Auth.hasAuth('XX2') === false) {
        Message.warning({
          duration: 0,
          showClose: true,
          message: '您没有doXx2Thing权限，行为权限测试通过！'
        })
      }

      Server.$().uri('/someurl').data({abc: _queryObj.abc})
        .success(function (data) {
          _data.mainForm = data
          console.log(data)

          if (_data.mainForm) {
            _data.mainForm.forEach(function (someitem) {
              console.log(someitem)
            })
          } else {
            _data.mainForm = {}
          }
          Message.success({
            message: '数据加载成功'
          })
        })
        .error(Page.onLoadError)
        .post()
    },
    onSubmit: function () {
      Server.$().uri('/someurl').data(_data.mainForm)
        .success(function (data) {
          Frameset.Son.sendFlowDone({'resultAbc': 'ok哈哈'})
        })
        .error(Page.onActionError)
        .post()
    }
  }
}
</script>
<style scoped>
</style>
