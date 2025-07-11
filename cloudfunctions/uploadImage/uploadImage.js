// cloudfunctions/uploadImage/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { fileID, fileName, fileType = 'meeting' } = event
    
    // 这里可以添加图片处理逻辑，比如压缩、格式转换等
    // 也可以记录图片上传日志
    
    const result = await cloud.database().collection('images').add({
      data: {
        fileID,
        fileName,
        fileType,
        uploaderId: wxContext.OPENID,
        uploadTime: new Date()
      }
    })
    
    return {
      success: true,
      data: {
        id: result._id,
        fileID,
        message: '上传成功'
      }
    }
    
  } catch (error) {
    console.error('图片上传处理失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}