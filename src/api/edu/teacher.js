import request from '@/utils/request'

export default {
    // Teacher List (with page separator)
    // current: current page, limit: records per page, teacherQuery: query object
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery object, backend uses RequestBody to get data, here frontend uses data
            data: teacherQuery // meaning convert teacherQuery into json format
          })
    },
    deleteTeacherId(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    getTeacherInfo(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    updateTeacherInfo(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }
}
