import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import { DetailModal } from '@/components/DetailModal';
import { TableListItem } from './data';
import { queryPurchase, queryPurchaseDetail, addInstock  } from '../../services/general';
import moment from 'moment';


const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {}


const handleInstock = async (record, action) => {
    const hide = message.loading('正在提交信息...');
    const res = await addInstock({ id: record.id });
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

  // 在搜索表单中，“搜索时间段”的渲染方法
  const renderRangePicker = 
    (item, config: {value,onChange}) =>
      (<RangePicker
            // defaultValue={config.value}
            onChange={(value) => {
              console.log('changed: ', config.value)
              config.onChange([
                moment(value[0]).format('YYYY-MM-DD'), 
                moment(value[1]).format('YYYY-MM-DD')
            ])}
          }
      />)
    ;

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '订单号',
      dataIndex: 'id',
    },
    {
      title: '订单价格',
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
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    // },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化)
      formItemProps: {prop: {onReset: () => console.log('createdAt reset')}}
    },
    {
      title: '上次更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
      renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化）
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, index, action) => (
        <>
          <a onClick={() => handleShowDetail(record.id)} >
            查看详情
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="修改后无法改变，确认入库吗?"
            onConfirm={() => handleInstock(record, action)}
            okText="Yes"
            cancelText="No"
          >
            <a disabled={record.status !== 1}>确认入库</a>
          </Popconfirm>
          </>
      ),
    },
  ];


  return (
    <PageHeaderWrapper>
      <StyledCard
          title='待入库订单列表'
          renderContent={() => (
          <ProTable<TableListItem>
            headerTitle="查询表格"
            columns={columns}
            rowKey="key"
            request={params => queryPurchase(params)}
            actionRef={actionRef}
            toolBarRender={() => []}
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

