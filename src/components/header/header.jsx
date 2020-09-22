import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'
import './header.less'
import { Modal } from 'antd';
import LinkButton from '../link-button'
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //当前时间
        dayPictureUrl: '',//天气的图片
        weather: '',//天气

    }
    getTime = () => {
        this.timer = setInterval(() => {
            //每隔一秒中获取当前时间并且更新当前时间
            const currentTime = formateDate(Date.now()) //当前时间
            this.setState({
                currentTime
            })
        }, 1000)
    }
    getWeather = async () => {
        const { dayPictureUrl,
            weather } = await reqWeather('杭州')
        this.setState({
            dayPictureUrl,
            weather
        })
    }
    //获取当前页的title
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { //如果当前的对象的key于path匹配
                title = item.title
            } else if (item.children) {
                //在所有子item中查找匹配
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果有值说明匹配成功
                if (cItem) {
                    //取出title
                    title = cItem.title
                }
            }
        })
        return title
    }
    //退出登录
    logout = () => {
        Modal.confirm({
            content: '您确定要退出后台吗',
            onOk: () => {
                //清除保存的user数据,跳转到login页面
                storageUtils.removerUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
            onCancel() { },
        });
    }
    componentDidMount() {
        //显示当前的时间
        this.getTime()
        //获取当前的天气
        this.getWeather()

    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const username = memoryUtils.user.username
        //取出当前页对应的title
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎,{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);