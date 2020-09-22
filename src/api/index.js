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
// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE_URL + '/manage/img/delete', {
    name
}, 'POST')

//更新分类
export const reqUpdateCategory = ({
    categoryId,
    categoryName
}) => ajax(BASE_URL + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')


//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE_URL + '/manage/product/list', {
    pageNum,
    pageSize
})

//搜索商品分页列表
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchType,
    searchName
}) => ajax(BASE_URL + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,

})
// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE_URL + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST')
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE_URL + '/manage/category/info', {
    categoryId
})

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE_URL + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//修改商品
//export const reqUpdateProduct=(product)=>ajax(BASE_URL+'/manag/product/update',product,'POST')

//获取所有角色列表
export const reqRoles = () => ajax(BASE_URL + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE_URL + '/manage/role/add', {
    roleName
}, 'POST')
//权限分配
export const reqUpdateRole = (role) => ajax(BASE_URL + '/manage/role/update', role, 'POST')
//获取用户列表
export const reqUsers = () => ajax(BASE_URL + '/manage/user/list')
//删除用户
export const reqDeleteUser = (userId) => ajax(BASE_URL + '/manage/user/delete', {
    userId
}, 'POST')
//添加/修改 用户
export const reqAddOrUpdateUser = (user) => ajax(BASE_URL + '/manage/user/' + (user._id ? 'update' : 'add'),
    user, 'POST')

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