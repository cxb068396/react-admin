import React, { Component } from 'react';
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

class Bar extends Component {
    state = {
        sales: [5, 20, 36, 10, 10, 20],//销量
        stores: [10, 25, 16, 13, 6, 50] //库存
    }
    //返回柱状图的配置对象
    getOption = (stores, sales) => {
        return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            }, {
                name: '库存',
                type: 'bar',
                data: stores
            }]
        };
    }
    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.map(store => store - 1),
        }))
    }
    render() {
        const { stores, sales } = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update} >更新</Button>
                </Card>
                <Card title='柱状图'>
                    <ReactEcharts option={this.getOption(stores, sales)}></ReactEcharts>
                </Card>
            </div>
        );
    }
}

export default Bar