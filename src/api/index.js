//包含应用中所有请求的接口请求函数
import jsonp from 'jsonp'
import ajax from './ajax'
import {
    message
} from 'antd'

const BASE_URL = ''
//登录接口
export const reqLogin = (username, password) => ajax(BASE_URL + '/login', {
    username,
    password
}, 'POST')
//获取分类的列表一级或者二级
export const reqCategorys = (parentId) => ajax(BASE_URL + '/manage/category/list', {
    parentId
})
//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE_URL + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST')

//更新分类
export const reqUpdateCategory = ({
    categoryId,
    categoryName
}) => ajax(BASE_URL + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')




//jsop请求的接口请求函数
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if (!err && data.status === 'success') {
                // 取出需要的数据
                const {
                    dayPictureUrl,
                    weather
                } = data.results[0].weather_data[0]
                resolve({
                    dayPictureUrl,
                    weather
                })
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
}