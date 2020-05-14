import { Input, Button, Table, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import { TableListItem } from './data';
import { queryVehicleType, addVehicleType, deleteVehicleType } from '../../services/general';
import moment from 'moment';
import CreateForm from './components/CreateForm';

// 车辆类型 组件
const VehicleTypeList = props => {
  // 选中的行
  //  let [selectedRows, setSelectedRows] = useState([]);

  const { data, changeModalVisible, handleAddTask, handleDeleteVehicleType } = props;

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
      title: '车辆类型编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id - b.id),
    },
    {
      title: '车辆开销',
      dataIndex: 'cost',
      key: 'cost',
      sorter: (a, b) => (a.cost - b.cost),
    },
    {
      title: '车辆载重',
      dataIndex: 'load',
      key: 'load',
      sorter: (a, b) => (a.load - b.load),
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
    },
    {
      title: '上次更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),

    },
    {
      title: '删除',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <a onClick={() => { handleDeleteVehicleType(record) }}>删除</a>
      ),
    },
  ];


  return (
    <Table columns={columns} dataSource={data} />
  );
};


class VehicleType extends React.Component {
  state = {
    modalVisible: false,
  }

  // columns = [
  //   {
  //     title: '车辆类型编号',
  //     dataIndex: 'id',
  //     key: 'id',
  //     sorter: (a, b) => (a.id - b.id),
  //   },
  //   {
  //     title: '车辆开销',
  //     dataIndex: 'cost',
  //     key: 'cost',
  //     sorter: (a, b) => (a.cost - b.cost),
  //   },
  //   {
  //     title: '车辆载重',
  //     dataIndex: 'load',
  //     key: 'load',
  //     sorter: (a, b) => (a.load - b.load),
  //   },

  //   {
  //     title: '创建时间',
  //     dataIndex: 'createdAt',
  //     valueType: 'dateTime',
  //     sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
  //     formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
  //   },
  //   {
  //     title: '上次更新时间',
  //     dataIndex: 'updatedAt',
  //     sorter: true,
  //     valueType: 'dateTime',
  //     sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),

  //   },

  // ];

  handleAddVehicleType = async (fields) => {
    const hide = message.loading('正在添加...'); // 正在添加loading出现
    const res = await addVehicleType({ ...fields }); // 添加操作
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success('添加成功！'); //成功则提示添加成功并return true
    return true;
  };

  handleDeleteVehicleType = async (record, action) => {
    const hide = message.loading('正在删除信息...');
    const res = await deleteVehicleType({ id: record.id });
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success('删除成功'); //成功则提示添加成功并return true
    action.reload(); // 刷新表格
    return true;
  }

  // handleChangeStatus = async (record, action) => {
  //   const hide = message.loading('正在提交信息...');
  //   const res = await updateBorrowStatus({ status: record.status });
  //   hide(); // 正在添加loading消失
  //   if (!res.success) return false; // 如果失败就return false
  //   message.success('修改状态成功'); //成功则提示添加成功并return true
  //   action.reload(); // 刷新表格
  //   return true;
  // }
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
                新增车辆类型
              </Button>
            </div>
          )}
          title='车辆类型'
          content={() => (
            <ProTable<TableListItem>
              headerTitle="查询表格"
              columns={this.columns}
              rowKey="key"
              request={params => queryVehicleType(params)}
              // actionRef={actionRef}
              toolBarRender={() => []}
              beforeSearchSubmit={params => {
                // 提交search前，查看search form的数据
                // console.log('search params: ', params);
                return params;
              }
              }
            />
          )}
        />
        {/* styledcard结束 */}
        <CreateForm
          onSubmit={async value => {
            const success = await this.handleAddVehicleType(value);
            console.log('add vehicleType: ', value);
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
      </PageHeaderWrapper >
    );// return的反括号
  };
};// class

export default Form.create()(VehicleType);

