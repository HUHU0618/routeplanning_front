import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm, InputNumber } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import StyledCard from '../../components/StyledCard';
import FormModal from '../../components/FormModal';
import { TableListItem } from './data';
import { queryBook, addLost  } from '../../services/general';


interface TableListProps extends FormComponentProps {}

const TableList: React.FC<TableListProps> = () => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(false);
  const [ record, setRecord ] = useState(0);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '书籍id',
      dataIndex: 'id',
      key: 'id',
    }, 
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
    },
    {
      title: 'ISBN',
      dataIndex: 'ISBN',
      key: 'ISBN',
    },
    {
      title: '售价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      valueType: 'money',
      hideInSearch: true,
      sorter: (a, b) => (a.purchasePrice - b.purchasePrice),
    },
    {
      title: '进货价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      valueType: 'money',
      hideInSearch: true,
      sorter: (a, b) => (a.salePrice - b.salePrice),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '出版社',
      dataIndex:'publisher',
      key: 'publisher',
    },
    {
      title: '库存数量',
      dataIndex: 'stockNum',
      key: 'stockNum',
      hideInSearch: true,
      renderText: (val: string) => `${val} 本`,
      sorter: (a, b) => (a.stockNum - b.stockNum),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, index, action) => (
        <a 
          disabled={record.stockNum === 0}
          onClick={() => handleShowModal(record)}
        >
          申报丢失
        </a>
      ),
    },
  ];


  const handleShowModal = (record) => {
    setModalVisible(true);
    setRecord(record);
  }

  const handleSubmitLost = async value => {
    const hide = message.loading('正在提交信息...');
    console.log('value: ', value);
    const res = await addLost({
      id: record.id,
      lostNum: (record.stockNum - value.num),
      remark: value.remark,
    });
    hide(); // 正在添加loading消失
    if(!res.success) return false; // 如果失败就return false
    message.success('提交成功'); // 成功则提示添加成功并return true
    return true;
  }

  return (
    <PageHeaderWrapper>
      <StyledCard
          title='库存书籍列表'
          renderContent={() => (
            <ProTable<TableListItem>
              headerTitle="查询表格"
              columns={columns}
              rowKey="key"
              request={params => queryBook(params)}
              actionRef={actionRef}
              toolBarRender={() => []}
            />
          )}
      />
      {
        (!modalVisible) ? (
          null
        ):(
          <FormModal
          title='书籍报失'
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          handleSubmit={async value => {
            const success = await handleSubmitLost(value);
            // 若提交失败
            if (!success) return false;
            // 若提交成功则关闭modal，然后return true
            setModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            } 
            return true;
          }}
        />
        )
      }
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
