# 小程序项目说明
优化了发布界面，但是地点和类型还没优化，预览界面稍微做了一点

---

## 2025.7.12 后端更新：

云函数：

获取会议列表的云函数

发布会议的云函数

获取会议详情的云函数

用户信息管理云函数

 图片上传云函数

### 仍待解决的问题：

1，云函数可用性未测试

```txt
上传云函数 getMeetingDetail 失败
2%
查看详情v
Error:请在编辑器云函数根目录(cloudfumctionRoot)选择
一个云环境

Edit
这个错误是因为还没有配置云环境。需要按照以下步骤来解决：

1. 首先开通云开发服务
在微信开发者工具中，点击顶部菜单栏的 "云开发"
如果是第一次使用，会提示开通云开发服务
点击 "开通" 按钮
选择付费方式（可以选择免费的基础版）
创建云环境，给环境起一个名字（比如：meeting-app-env）
2. 配置云环境ID
开通后会得到一个云环境ID（格式类似：meeting-app-env-xxxxx），需要在两个地方配置：

在 app.js 中配置：
javascript
// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "your-env-id-here", // 📌 这里填入您的云环境ID
        traceUser: true,
      });
    }
    this.globalData = {};
  },
});
在微信开发者工具中选择云环境：
在开发者工具中，找到左侧文件目录中的 cloudfunctions 文件夹
右键点击 cloudfunctions 文件夹
选择 "选择云开发环境"
在弹出的对话框中选择您刚才创建的云环境
3. 重新上传云函数
完成上述配置后：

在 cloudfunctions 文件夹下创建各个云函数文件夹
将对应的 index.js 和 package.json 文件放入各自的文件夹中
右键点击每个云函数文件夹（如 getMeetingDetail）
选择 "上传并部署：云端安装依赖"
4. 验证环境配置
在开发者工具的控制台中，可以通过以下代码验证云环境是否配置正确：

javascript
// 在开发者工具的控制台中执行
wx.cloud.callFunction({
  name: 'getMeetingDetail',
  data: {
    meetingId: 'test'
  }
}).then(res => {
  console.log('云函数调用成功:', res)
}).catch(err => {
  console.error('云函数调用失败:', err)
})
5. 常见问题排查
如果仍然遇到问题，请检查：

小程序AppID是否正确：确保 project.config.json 中的 appid 是您的小程序AppID
基础库版本：确保基础库版本在 2.2.3 以上
网络连接：确保网络连接正常
权限问题：确保您的微信账号有该小程序的开发权限
完成这些步骤后，应该就能成功上传云函数了。如果还有问题，请告诉我具体的错误信息。
```

2，数据库的创建：

```txt
文件目录结构和部署说明
文件放置位置：
your-project/
├── cloudfunctions/           # 云函数根目录
│   ├── getMeetings/         # 获取会议列表
│   │   ├── index.js
│   │   └── package.json
│   ├── publishMeeting/      # 发布会议
│   │   ├── index.js
│   │   └── package.json
│   ├── getMeetingDetail/    # 获取会议详情
│   │   ├── index.js
│   │   └── package.json
│   ├── userInfo/           # 用户信息管理
│   │   ├── index.js
│   │   └── package.json
│   └── uploadImage/        # 图片上传处理
│       ├── index.js
│       └── package.json
├── miniprogram/            # 小程序前端代码
│   ├── pages/
│   ├── app.js
│   ├── app.json
│   └── ...
└── project.config.json
需要配置的账号信息：

微信小程序AppID：

在 project.config.json 中的 appid 字段
当前值：wx73765fed43011c1c（需要替换为您的实际AppID）


云环境ID：

在 app.js 中的 wx.cloud.init() 中的 env 参数
当前为空字符串，需要填入您的云环境ID


云函数部署：

在微信开发者工具中，右键点击每个云函数文件夹
选择"上传并部署：云端安装依赖"



数据库集合创建：
在微信开发者工具的云开发控制台中创建以下集合：

meetings - 会议信息
users - 用户信息
images - 图片信息
messages - 原有消息集合（可选）

权限设置：
在云开发控制台中，为每个集合设置合适的权限：

读权限：所有用户可读
写权限：仅创建者可写

这样就完成了后端功能的完善，前端代码基本不需要修改，只需要在现有基础上集成云函数调用即可。
```

