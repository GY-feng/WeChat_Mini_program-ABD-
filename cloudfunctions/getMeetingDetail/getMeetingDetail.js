// cloudfunctions/getMeetingDetail/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { meetingId } = event
    
    if (!meetingId) {
      return {
        success: false,
        error: '会议ID不能为空'
      }
    }
    
    // 获取会议详情
    const result = await db.collection('meetings').doc(meetingId).get()
    
    if (!result.data) {
      return {
        success: false,
        error: '会议不存在'
      }
    }
    
    // 更新浏览次数
    await db.collection('meetings').doc(meetingId).update({
      data: {
        viewCount: db.command.inc(1)
      }
    })
    
    return {
      success: true,
      data: result.data
    }
    
  } catch (error) {
    console.error('获取会议详情失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}