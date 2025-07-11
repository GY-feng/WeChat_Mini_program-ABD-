// cloudfunctions/publishMeeting/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const {
      title,
      type,
      date,
      time,
      place,
      members,
      introduction,
      images = []
    } = event
    
    // 数据验证
    if (!title || !type || !date || !place) {
      return {
        success: false,
        error: '请填写必要信息'
      }
    }
    
    // 处理会议日期
    const meetingDate = new Date(date)
    const createTime = new Date()
    
    // 插入数据
    const result = await db.collection('meetings').add({
      data: {
        title,
        type,
        date,
        time,
        place,
        members,
        introduction,
        images,
        meetingDate,
        createTime,
        updateTime: createTime,
        publisherId: wxContext.OPENID,
        status: 'active', // 状态：active-活跃，cancelled-已取消，completed-已完成
        viewCount: 0,
        participantCount: 0
      }
    })
    
    return {
      success: true,
      data: {
        id: result._id,
        message: '发布成功'
      }
    }
    
  } catch (error) {
    console.error('发布会议失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}