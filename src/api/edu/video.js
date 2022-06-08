import request from '@/utils/request'
export default {
  addVideo(video) {
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },

  updateVideo(video) {
    return request({
      url: `/eduservice/video/updateVideo`,
      method: 'post',
      data: video
    })
  },

  deleteVideo(videoId) {
    return request({
      url: `/eduservice/video/${videoId}`,
      method: 'delete'
    })
  },

  getVideo(videoId) {
    return request({
      url: `/eduservice/video/getVideoInfo/${videoId}`,
      method: 'get'
    })
  },

  removeAliyunVideo(id) {
    return request({
      url: `/eduvod/video/removeAliyunVideo/${id}`,
      method: 'delete'
    })
  }
}
