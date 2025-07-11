// cloudfunctions/userInfo/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { action, userInfo } = event
    
    switch (action) {
      case 'getUserInfo':
        // 获取用户信息
        const userResult = await db.collection('users').where({
          openid: wxContext.OPENID
        }).get()
        
        if (userResult.data.length === 0) {
          return {
            success: false,
            error: '用户不存在'
          }
        }
        
        return {
          success: true,
          data: userResult.data[0]
        }
        
      case 'updateUserInfo':
        // 更新用户信息
        const updateResult = await db.collection('users').where({
          openid: wxContext.OPENID
        }).update({
          data: {
            ...userInfo,
            updateTime: new Date()
          }
        })
        
        return {
          success: true,
          data: {
            updated: updateResult.stats.updated,
            message: '更新成功'
          }
        }
        
      case 'createUser':
        // 创建用户
        const createResult = await db.collection('users').add({
          data: {
            openid: wxContext.OPENID,
            ...userInfo,
            createTime: new Date(),
            updateTime: new Date()
          }
        })
        
        return {
          success: true,
          data: {
            id: createResult._id,
            message: '创建成功'
          }
        }
        
      case 'getMyMeetings':
        // 获取我发布的会议
        const myMeetingsResult = await db.collection('meetings').where({
          publisherId: wxContext.OPENID
        }).orderBy('createTime', 'desc').get()
        
        return {
          success: true,
          data: myMeetingsResult.data
        }
        
      default:
        return {
          success: false,
          error: '无效的操作'
        }
    }
    
  } catch (error) {
    console.error('用户信息操作失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}