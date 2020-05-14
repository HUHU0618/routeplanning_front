import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import { TableListItem } from './data';
import { queryLost  } from '../../services/general';
import moment from 'moment';


const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {}

// const handleChangeStatus = async (record, action) => {
//     const hide = message.loading('正在修改货物状态...');
//     const res = await updatePurchaseStatus({ id: record.id, status: '1' });
//     hide(); // 正在添加loading消失
//     if(!res.success) return false; // 如果失败就return false
//     message.success('修改状态成功'); //成功则提示添加成功并return true
//     action.reload(); // 刷新表格
//     return true;
// }

const TableList: React.FC<TableListProps> = () => {
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormValues, setStepFormValues] = useState({});

  // 在搜索表单中，“搜索时间段”的渲染方法
  const renderRangePicker = 
    (item, config: {value,onChange}) =>
      (<RangePicker
          onChange = {(value) => {
              console.log('changed: ', config.value)
              config.onChange([
                moment(value[0]).format('YYYY-MM-DD'), 
                moment(value[1]).format('YYYY-MM-DD')
              ])
            }
          }
      />)


  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '报失单号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id - b.id),
    }, 
    {
      title: '书籍id',
      dataIndex: 'bId',
      key: 'bId',
      sorter: (a, b) => (a.bId - b.bId),
    },
    {
      title: 'ISBN',
      dataIndex: 'ISBN',
      key: 'ISBN',
    },
    {
      title: '书籍名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '报失数量',
      dataIndex: 'lostNum',
      key: 'lostNum',
      hideInSearch: true,
      sorter: (a, b) => (a.lostNum - b.lostNum),
    },
    {
      title: '报失时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化)
      formItemProps: {prop: {onReset: () => console.log('createdAt reset')}}
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    // {
    //   title: '上次更新时间',
    //   dataIndex: 'updatedAt',
    //   sorter: true,
    //   valueType: 'dateTime',
    //   sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
    //   renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化）
    // },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (text, record, index, action) => (
    //     <>
    //       <a
    //         onClick={() => {
    //           // handleUpdateModalVisible(true);
    //           // setStepFormValues(record);
    //         }}
    //       >
    //         查看详情
    //       </a>
    //       {/* <Divider type="vertical" />
    //       <Popconfirm
    //         title="修改后无法改变，确认到货吗?"
    //         onConfirm={() => handleChangeStatus(record, action)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <a disabled={record.status !== 0}>确认到货</a>
    //       </Popconfirm> */}
    //       </>
    //   ),
    // },
  ];


  return (
    <PageHeaderWrapper>
      <StyledCard
          title='报失记录'
          renderContent={() => (
            <ProTable<TableListItem>
              columns={columns}
              rowKey="key"
              request={params => queryLost(params)}
              actionRef={actionRef}
            />
          )}
        />
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
