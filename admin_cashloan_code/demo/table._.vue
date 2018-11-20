<template>
  <section id="page">
    <script type="text/template" id="html-head">
      <link href="../_lib/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
    </script>
    <header class="title-button-line">
      <div class="page-title">Demo-表格示例页</div>
      <div>
        <el-button size="medium" onclick="history.go(-1)">返回</el-button>
        <el-button size="medium" @click="load">刷新</el-button>
        <a class="el-button size-medium" href="form.html">直接跳转到测试页面-表单</a>
      </div>
      <div class="tip">
        类似列表的页面，请复制本页面代码，然后修改！<br>
        换行了，这是本页的说明文字的示例，操作提示等balabala说明文字，操作提示等balabala说明文字，操作提示等balabala说明文字，操作提示等balabala
      </div>
    </header>
    <section>
      <el-form size="medium" class="size-medium multiline-row">
        <el-row :gutter=10>
          <el-col :xs=12 :sm=4 :md=3>
            <label>名称：</label>
          </el-col>
          <el-col :xs=12 :sm=4 :md=3>
            <el-input type="text" v-model="searchForm.userName" placeholder="英文字母代码"></el-input>
          </el-col>
          <el-col :xs=12 :sm=4 :md=3>
            <label>手机号：</label>
          </el-col>
          <el-col :xs=12 :sm=4 :md=3>
            <el-input type="text" v-model="searchForm.userPhone" placeholder="英文字母代码"></el-input>
          </el-col>
          <el-col :xs=0 :sm=8 :md=0 class="space"></el-col>
          <el-col :xs=12 :sm=4 :md=3>
            <label>XX状态：</label>
          </el-col>
          <el-col :xs=12 :sm=12 :md=9>
            <el-select v-model="searchForm.statuss" multiple placeholder="请选择" style="width: 100%">
              <el-option v-for="item in AbcStatus.enums" :key="item.v" :value="item.v" :label="item.s"></el-option>
            </el-select>
          </el-col>
          <el-col :xs=0 :sm=8 :md=0 class="space"></el-col>
          <el-col :xs=12 :sm=4 :md=3>
            <label>创建日期：</label>
          </el-col>
          <el-col :xs=24 :sm=12 :md=10>
            <DateRangeGeLt v-model="searchForm.createdTimeGeLt" />
          </el-col>
          <el-col :xs=12 :sm=4 :md=4>
            <el-button style="width: 100%" type="primary" @click="$refs.mainTable.loadFirstPage()" @keyup.enter="$refs.mainTable.loadFirstPage()">查 询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section v-if="mainTableSelected">
      <el-button size="medium" type="primary" @click="load">操作按钮</el-button>
      <a class="el-button el-button--primary" :href="'form.html?someId='+mainTableSelected.id">跳转到编辑页</a>
      <a class="el-button el-button--primary" target="_blank" :href="'../demo.html#demo/form.html?someId='+mainTableSelected.id">新开编辑页</a>
      <el-button size="medium" type="primary" @click="frameGoUrl('demo/form.html?someId='+mainTableSelected.id)">通过父页面跳转</el-button><!-- 跳转到其他组件页面时使用 -->
      <el-button size="medium" v-if="Auth.hasAuth('XXX')" @click="$refs.mainTable.clearSelection">有权限才能看到</el-button><!-- 权限判断示例 -->
      <el-button size="medium" @click="$refs.mainTable.clearSelection">清除选择</el-button>
    </section>
    <section v-else>请选择表格中的一行，进行操作！</section>
    <PagingTable ref="mainTable" v-model="mainTableSelected" @loadFunc="loadMainTable" :multiMode=false :initPageSize=10>
      <el-table-column prop="id" label="ID" width=80 />
      <el-table-column prop="date" label="日期" width=200 />
      <el-table-column prop="name" label="名称" width=150 />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="status" label="XX状态" :formatter="mainTableFormatter.status" />
    </PagingTable>
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
import Common from '~/_js/common.js'
import Server from '~/_js/server.js'
import PagingTable from '@/PagingTable.vue'
import DateRangeGeLt from '@/DateRangeGeLt.vue'

Vue.use(ElementUI)
const Message = ElementUI.Message

Common.initHtmlHead('表格示例页面')

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
  searchForm: {
    createdTimeGeLt: [] // 第一个为开始日期，第二个为结束日期
  },
  mainTableSelected: null,
  mainTableFormatter: {
    status: function (row, column) {
      var value = row[column.property]
      return AbcStatus.s(value)
    }
  },
  AbcStatus: AbcStatus,
  Auth: Auth,
  actionTip: ''
}

let Page
export default {
  name: 'Page',
  components: {
    PagingTable,
    DateRangeGeLt
  },
  created () {
    Page = this
    Frameset.Son.init({
      reloadFunc: this.load
    })
    // this.load()
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
    mainTableSelectedUrl: function () {
      return null
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
    load: function () {
      // 检查本页面权限，执行处理器，返回是否有权限。可选参数是未登录处理器和无权限处理器，不传使用server.js中默认的配置的
      if (Auth.checkPageAuth() === false) {
        return false
      }
      Message.warning({
        duration: 0,
        showClose: true,
        message: '页面权限测试通过！'
      })
      // _data.searchForm.systemId = Env.systemId

      // 权限判断示例
      if (Auth.hasAuth('XXX')) {
        Message.warning({
          duration: 0,
          showClose: true,
          message: '您有doXxxThing的权限，行为权限测试通过！'
        })
      }

      Page.loadMainTable()
    },
    loadMainTable: function () {
      Page.searchForm.paging = Page.$refs.mainTable.paging

      Server.$().uri('/someurl').data(_data.searchForm)
        .success(function (data) {
          console.log(data)

          // 正式代码不需要做此判断 demo/table仅为填充演示数据
          if (data) {
            _data.mainTableData.forEach(function (mainTableItem) {
              console.log(mainTableItem)
            })
          } else { // 正式代码请删除判断及else中的内容，demo/table仅为填充演示数据
            data = {
              paging: {
                dataTotal: 108
              },
              list: []
            }
            var lastId = 1
            for (var i = 0; i < Page.searchForm.paging.pageSize; i++) {
              data.list.push({
                id: (lastId++),
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                status: Math.floor(Math.random() * 7)
              })
            }
          }

          Page.$refs.mainTable.setPagingList(data)
          Message.success({
            message: '列表加载成功'
          })
        })
        .error(Page.onLoadError)
        .post()
    },
    frameGoUrl: function (url) {
      Frameset.Son.sendGoUrl(url)
    },
    closeSelf: function () {
      Frameset.Son.sendGoUrl(null)
    }
  }
}
</script>
<style scoped>
</style>
