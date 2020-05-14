import { Input, Table, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import { TableListItem } from './data';
import { queryVehicle, addVehicle, deleteVehicle } from '../../services/general';
import moment from 'moment';
import CreateForm from './components/CreateForm';

const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps { }

// 车辆 组件
const VehicleList = props => {
  // 选中的行
  //  let [selectedRows, setSelectedRows] = useState([]);

  const { data, changeModalVisible, handleDeleteVehicle } = props;

  //  // rowSelection object indicates the need for row selection
  //   const rowSelection = {
  //       onChange: (selectedRowKeys, selectedRows) => {
  //         setSelectedRows(selectedRows);
  //         // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //       },
  //       // getCheckboxProps: record => ({
  //       //   disabled: record.title === 'Disabled User', // Column configuration not to be checked
  //       //   title: record.title,
  //       // }),
  //     };

  // const actionRef = useRef<ActionType>();
  const columns = [
    {
      title: '车辆编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id - b.id),
    },
    {
      title: '车辆型号',
      dataIndex: 'typeId',
      key: 'typeId',
      sorter: (a, b) => (a.typeId - b.typeId),
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
    },
    {
      title: '删除',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <a onClick={() => { handleDeleteVehicle(record) }}>删除</a>
      ),
    },
  ];


  return (
    <Table columns={columns} dataSource={data} />
  );
};

class Vehicle extends React.Component {
  state = {

    modalVisible: false,
  }

  // columns = [
  //   {
  //     title: '车辆编号',
  //     dataIndex: 'id',
  //     key: 'id',
  //     sorter: (a, b) => (a.id - b.id),
  //   },
  //   {
  //     title: '车辆型号',
  //     dataIndex: 'typeId',
  //     key: 'typeId',
  //     sorter: (a, b) => (a.typeId - b.typeId),
  //   },

  //   {
  //     title: '创建时间',
  //     dataIndex: 'createdAt',
  //     valueType: 'dateTime',
  //     sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
  //     formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
  //   },
  //   // {
  //   //   title: '车辆状态',
  //   //   dataIndex: 'status',
  //   //   key: 'status',
  //   //   valueEnum: {
  //   //     0: { text: '未配送', status: 'Default' },
  //   //     1: { text: '配送中', status: 'Processing' },
  //   //     2: { text: '已配送', status: 'Success' },
  //   //   },
  //   // },
  //   // {
  //   //   title: '上次更新时间',
  //   //   dataIndex: 'updatedAt',
  //   //   sorter: true,
  //   //   valueType: 'dateTime',
  //   //   sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
  //   // },

  // ];

  handleAddVehicle = async (fields) => {
    const hide = message.loading('正在添加...'); // 正在添加loading出现
    const res = await addVehicle({ ...fields }); // 添加操作
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success('添加成功！'); //成功则提示添加成功并return true
    return true;
  };

  handleDeleteVehicle = async (record, action) => {
    const hide = message.loading('正在删除信息...');
    const res = await deleteVehicle({ id: record.id });
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success('删除成功'); //成功则提示添加成功并return true
    action.reload(); // 刷新表格
    return true;
  }

  // 显示添加新用户modal
  changeModalVisible = visible => {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <StyledCard
          titleRight={() => (
            <div>
              <Button icon="plus" type="primary" onClick={() => this.changeModalVisible(true)}>
                新增车辆
                </Button>
            </div>
          )}
          title='车辆信息'
          content={() => (
            <ProTable<TableListItem>
              columns={this.columns}
              rowKey="key"
              request={params => queryVehicle(params)}
              toolBarRender={() => []}
            />
          )}
        />
        <CreateForm
          onSubmit={async value => {
            const success = await this.handleAddVehicle(value);
            console.log('add vehicle: ', value);
            if (!success) return false;
            this.changeModalVisible(false);
            // if (actionRef.current) {
            // actionRef.current.reload();
            // }
            return true;
          }}
          onCancel={() => this.changeModalVisible(false)}
          modalVisible={modalVisible}
        />
      </PageHeaderWrapper>
    );
  };
};

export default Form.create()(Vehicle);
