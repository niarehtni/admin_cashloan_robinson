const DemoData = {
  Common: {
    True: true,
    False: false,
    Void: 'void'
  },
  envconf: {
    env: 'serverEnvName'
  }
  // 其他demo数据添加在这里
}

// 以下为例子，可以模拟不同的错误，可以删除
const DemoErrorExample = {
  // 模拟http正常，ApiResponse返回错误码
  returnApiResponse: {
    module: 'test',
    code: 10001,
    message: '错误的ID，balahbalah',
    data: null
  },
  // 模拟收到服务器端的非200的响应状态码
  returnHttpResponseNot200: {
    isHttpResponse: true,
    // status 为-1模拟未能成功发送
    status: 404,
    // 从服务器返回的http状态文本
    statusText: 'OK',
    // 响应头信息
    headers: {},
    // `config`是在请求的时候的一些配置信息
    config: {},
    // 数据
    data: null
  },
  // 模拟发送请求失败，本地抛出异常
  returnHttpRequestError: {
    isHttpResponse: true,
    // 错误信息
    error: 'Network Error',
    // status 为-1模拟未能成功发送
    status: null,
    // 从服务器返回的http状态文本
    statusText: 'OK',
    // 响应头信息
    headers: {},
    // `config`是在请求的时候的一些配置信息
    config: {},
    // 数据
    data: null
  }
}

export default {
  '/envconf/v1/': DemoData.envconf,
  // 其他demo数据uri添加在这里

  '/example/ReturnVoid': DemoData.Common.Void, // 模拟服务器端返回null，请使用DemoData.Common.Void，否则会弹出无演示版数据警告
  '/example/ApiResponse': DemoErrorExample.returnApiResponse,
  '/example/HttpResponse/Not200:': DemoErrorExample.returnHttpResponseNot200,
  '/example/HttpResponse/RequestError:': DemoErrorExample.returnHttpRequestError
}
