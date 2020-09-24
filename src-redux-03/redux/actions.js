/*
包含n个用来创建action的工厂函数(action creator)
 */
import {
    INCREMENT,
    DECREMENT,

} from './action-types'

/*
增加的同步action
 */
export const increment = number => ({
    type: INCREMENT,
    data: number
})
/*
减少的同步action: 返回对象
 */
export const decrement = number => ({
    type: DECREMENT,
    data: number
})

/*异步增肌的action */
export const incrementAsync = number => {
    return dispatch => {
        //执行异步代码  ,定时器,ajax请求,promise
        setTimeout(() => {
            //当异步任务执行完成,执行一个同步的action
            dispatch(increment(number))
        }, 1000)
    }
}