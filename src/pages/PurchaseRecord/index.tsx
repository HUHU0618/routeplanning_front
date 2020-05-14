import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import { DetailModal } from '@/components/DetailModal';
import { TableListItem } from './data';
import { queryPurchase, queryPurchaseDetail, updatePurchaseStatus  } from '../../services/general';
import moment from 'moment';
import { beforeSearchSubmit } from '../../utils/convert';


const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {}

const handleChangeStatus = async (id, status, action) => {
    const hide = message.loading('正在修改货物状态...');
    const res = await updatePurchaseStatus({ id, status });
    hide(); // 正在添加loading消失
    if(!res.success) return false; // 如果失败就return false
    message.success('修改状态成功'); //成功则提示添加成功并return true
    action.reload(); // 刷新表格
    return true;
}

const TableList: React.FC<TableListProps> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState({});

  
  const handleShowDetail = async id => {
    const descConfig = {
      title: '采购详情',
      subtitles: {
        'id': '订单号',
        'expend': '总支出',
        'typeCount': '书籍种类数',
        'status': '订单状态',
        'remark': '订单备注',
        'createdAt': '订单创建时间',
        'updatedAt': '订单上次修改时间'
      },
    };
    const tableConfig = {
      title: '采购书籍详情',
      columns: [
        {
          title: '书籍id',
          dataIndex: 'bId',
          key: 'bId',
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
          title: '作者',
          dataIndex: 'author',
          key: 'author',
        },
        {
          title: '出版社',
          dataIndex: 'publisher',
          key: 'publisher',
        },
        {
          title: '采购数量',
          dataIndex: 'bNum',
          key: 'bNum',
        },
        {
          title: '采购价',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
        },
        {
          title: '备注',
          dataIndex: 'bRemark',
          key: 'bRemark',
        },
      ]
    }
    const res = await queryPurchaseDetail({id});
    setModalData({
      descData: res.data.purchase,
      tableData: res.data.purchaseDetail,
      tableConfig,
      descConfig
    })
    setModalVisible(true);
  }

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '订单号',
      dataIndex: 'id',
    },
    {
      title: '订单支出',
      dataIndex: 'expend',
      valueType: 'money',
      hideInSearch: true,
      sorter: (a, b) => (a.expend - b.expend),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '未到货', status: 'Default' },
        1: { text: '已到货，未入库', status: 'Processing' },
        2: { text: '已入库', status: 'Success' },
        3: { text: '异常待处理', status: 'Error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '采购时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      renderFormItem: (_, config) => (<RangePicker {...config}/>), // 在搜索表单中，渲染该项（定制化）
      formItemProps: {prop: {onReset: () => console.log('createdAt reset')}}
    },
    {
      title: '上次更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      renderFormItem: (_, config) => (<RangePicker {...config}/>), // 在搜索表单中，渲染该项（定制化）
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, index, action) => (
        <>
          <a onClick={() => handleShowDetail(record.id)}>
            查看详情
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="修改后无法改变，确认到货吗?"
            onConfirm={() => handleChangeStatus(record.id, 1, action)}
            okText="Yes"
            cancelText="No"
          >
            <a disabled={record.status !== 0 && record.status !== 3}>确认到货</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            title="修改后无法改变，确认标记异常吗?"
            onConfirm={() => handleChangeStatus(record.id, 3, action)}
            okText="Yes"
            cancelText="No"
          >
            <a disabled={record.status !== 0}>标记异常</a>
          </Popconfirm>
          </>
      ),
    },
  ];


  return (
    <PageHeaderWrapper>
      <StyledCard
          title='采购记录'
          renderContent={() => (
          <ProTable<TableListItem>
            headerTitle="查询表格"
            columns={columns}
            rowKey="key"
            request={params => queryPurchase(params)}
            actionRef={actionRef}
            toolBarRender={() => []}
            beforeSearchSubmit={beforeSearchSubmit}
          />
          )}
      />
      {(!modalVisible) ? (<div></div>) : (      
        <DetailModal
          visible={modalVisible}
          changeVisible={setModalVisible.bind(this)}
          descConfig={modalData.descConfig}
          tableConfig={modalData.tableConfig}
          descData={modalData.descData}
          tableData={modalData.tableData}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
