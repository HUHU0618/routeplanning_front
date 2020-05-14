import {
    Button, Divider, Dropdown, Form,
    Icon, Menu, message, Table,
    Card, Col, Row, InputNumber,
    Input, Select, DatePicker, notification
} from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
// import CreateForm from './components/CreateForm';
import StyledCard from '../../components/StyledCard';

import { queryBook, addBook, addPurchase, queryTask } from '../../services/general';

const columns = [
    {
        title: '配送点编号',
        dataIndex: 'id',
        key: 'id',
        // sorter: (a, b) => (a.id - b.id),
    },
    {
        title: '横坐标',
        dataIndex: 'xaxis',
        key: 'xaxis',
        // sorter: (a, b) => (a.xaxis - b.xaxis),
    },
    {
        title: '纵坐标',
        dataIndex: 'yaxis',
        key: 'yaxis',
        // sorter: (a, b) => (a.yaxis - b.yaxis),
        // hideInSearch: true,
    },
    {
        title: '需求量',
        dataIndex: 'demand',
        key: 'demand',
        // sorter: (a, b) => (a.demand - b.demand),
        // hideInSearch: true,
    },
    {
        title: '修改',
        dataIndex: 'option',
        valueType: 'option',
        key: 'option',


    },
    // {
    //   title: '添加时间',
    //   dataIndex: 'createdAt',
    //   valueType: 'dateTime',
    //   sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
    //   renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化)
    //   formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
    // },

];



class Purchase extends React.Component {
    state = {
        purchaseList: [],
        count: 0,
        sum: 0,
        modalVisible: false,
    }

    componentDidMount() {
        console.log('queryTask()111', queryTask())
    }

    // const actionRef = useRef<ActionType>();

    render() {
        const { purchaseList, count, sum, modalVisible } = this.state;
        return (
            <PageHeaderWrapper title="书籍采购">
                <StyledCard
                    title='库存书籍列表'
                    renderTitleRight={() => (
                        <div>
                            <Button icon="plus" type="primary" onClick={() => console.log('add')}>
                                新增未收录书籍
                </Button>
                        </div>
                    )}
                    renderContent={() => (
                        <Button type="primary" >Create</Button>

                    )}
                />

            </PageHeaderWrapper>
        )
    }
}

export default Form.create()(Purchase);