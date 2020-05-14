// 路线规划

import {
  Button, Divider, Dropdown, Form,
  Icon, Menu, message, Table,
  Card, Col, Row, InputNumber
} from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import StyledCard from '../../components/StyledCard';
import { TableListItem } from './data';
import { queryTask, addTask, updateTask, deleteTask } from '../../services/general';
import CreateForm from './components/CreateForm';

// 配送点 组件
export const TaskList = props => {
  // 选中的行
  // let [selectedRows, setSelectedRows] = useState([]);

  const { data, changeModalVisible, handleAddTask, handleDeleteTask } = props;

  // // rowSelection object indicates the need for row selection
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRows(selectedRows);
  //     // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   // getCheckboxProps: record => ({
  //   //   disabled: record.title === 'Disabled User', // Column configuration not to be checked
  //   //   title: record.title,
  //   // }),
  // };

  const actionRef = useRef<ActionType>();
  const columns = [
    {
      title: '配送点编号',
      dataIndex: 'id',
      key: 'id',

    },
    {
      title: '横坐标',
      dataIndex: 'xaxis',
      key: 'xaxis',
      sorter: (a, b) => (a.xaxis - b.xaxis),
    },
    {
      title: '纵坐标',
      dataIndex: 'yaxis',
      key: 'yaxis',
      sorter: (a, b) => (a.yaxis - b.yaxis),
    },
    {
      title: '删除',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <a onClick={() => { handleDeleteTask(record) }}>删除</a>
      ),
    },
  ];


  return (
    // <Table columns={columns} dataSource={data} />
    <div>
      {/* 新增配送点 */}
      <CreateForm
        onSubmit={async value => {
          const success = await handleAddTask(value);
          console.log('add task: ', value);
          if (!success) return false;
          changeModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        onCancel={() => changeModalVisible(false)}
        modalVisible={modalVisible}
      />
    </div>
  );
};




// import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm, InputNumber } from 'antd';
// import React, { useState, useRef } from 'react';
// import { FormComponentProps } from 'antd/es/form';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
// import StyledCard from '../../components/StyledCard';
// import FormModal from '../../components/FormModal';
// import { TableListItem } from './data';
// import { queryTask, addTask, deleteTask, updateTask } from '../../services/general';


// interface TableListProps extends FormComponentProps { }

// const TableList: React.FC<TableListProps> = () => {
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [record, setRecord] = useState(0);

//   const actionRef = useRef<ActionType>();
//   const columns: ProColumns<TableListItem>[] = [
//     {
//       title: '配送点编号',
//       dataIndex: 'id',
//       key: 'id',
//       sorter: (a, b) => (a.id - b.id),
//     },
//     {
//       title: '横坐标',
//       dataIndex: 'xaxis',
//       key: 'xaxis',
//       sorter: (a, b) => (a.xaxis - b.xaxis),
//     },
//     {
//       title: '纵坐标',
//       dataIndex: 'yaxis',
//       key: 'yaxis',
//       sorter: (a, b) => (a.yaxis - b.yaxis),
//     },
//     {
//       title: '需求量',
//       dataIndex: 'demand',
//       key: 'demand',
//       sorter: (a, b) => (a.demand - b.demand),
//     },

//     {
//       title: '创建时间',
//       dataIndex: 'createdAt',
//       valueType: 'dateTime',
//       sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
//       formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
//     },
//     {
//       title: '上次更新时间',
//       dataIndex: 'updatedAt',
//       sorter: true,
//       valueType: 'dateTime',
//       sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),

//     },
//     {
//       title: '删除',
//       dataIndex: 'option',
//       valueType: 'option',
//       render: (record, action) => (
//         <a onClick={() => { handleDeleteTask(record, action) }}>删除</a>
//       ),
//     },
//     {
//       title: '操作',
//       dataIndex: 'option',
//       valueType: 'option',
//       render: (_, record, action) => (
//         <a onClick={() => { handleUpdateDemand(record, action) }}>更新</a>
//       ),
//     },
//   ];

//   const handleDeleteTask = async (record, action) => {
//     const hide = message.loading('正在删除信息...');
//     const res = await deleteTask({ id: record.id });
//     hide(); // 正在添加loading消失
//     if (!res.success) return false; // 如果失败就return false
//     message.success('删除成功'); // 成功则提示添加成功并return true
//     action.reload(); // 刷新表格
//     return true;
//   };

//   const handleUpdateDemand = async (id, demand) => {
//     const hide = message.loading('正在修改配送点需求量...');
//     const res = await updateTask({ id, demand });
//     hide(); // 正在添加loading消失
//     if (!res.success) return false; // 如果失败就return false
//     message.success('修改状态成功'); //成功则提示添加成功并return true
//     action.reload(); // 刷新表格
//     return true;
//   }

//   return (
//     <PageHeaderWrapper>
//       <StyledCard
//         title='配送点列表'
//         renderContent={() => (
//           <ProTable<TableListItem>
//             headerTitle="查询表格"
//             columns={columns}
//             rowKey="key"
//             request={params => queryTask(params)}
//             actionRef={actionRef}
//             toolBarRender={() => []}
//           />
//         )}
//       />

//     </PageHeaderWrapper>
//   );
// };

// export default Form.create<TableListProps>()(TableList);


