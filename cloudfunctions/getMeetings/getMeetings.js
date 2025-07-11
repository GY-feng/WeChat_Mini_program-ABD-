// cloudfunctions/getMeetings/index.js
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
      timeFilter = 0,     // 时间筛选：0-默认，1-发布时间，2-会议时间
      locationFilter = 'a', // 地区筛选
      typeFilter = 'A',     // 类型筛选
      searchKeyword = '',   // 搜索关键词
      page = 1,            // 页码
      pageSize = 10        // 每页数量
    } = event

    // 构建查询条件
    let query = db.collection('meetings')
    
    // 搜索关键词过滤
    if (searchKeyword) {
      query = query.where({
        title: db.RegExp({
          regexp: searchKeyword,
          options: 'i'
        })
      })
    }
    
    // 地区过滤
    if (locationFilter !== 'a') {
      query = query.where({
        location: locationFilter
      })
    }
    
    // 类型过滤
    if (typeFilter !== 'A') {
      query = query.where({
        type: typeFilter
      })
    }
    
    // 排序
    if (timeFilter === 1) {
      // 按发布时间排序
      query = query.orderBy('createTime', 'desc')
    } else if (timeFilter === 2) {
      // 按会议时间排序
      query = query.orderBy('meetingDate', 'asc')
    } else {
      // 默认排序
      query = query.orderBy('createTime', 'desc')
    }
    
    // 分页
    const result = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    // 获取总数
    const countResult = await query.count()
    
    return {
      success: true,
      data: result.data,
      total: countResult.total,
      page,
      pageSize
    }
    
  } catch (error) {
    console.error('获取会议列表失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}