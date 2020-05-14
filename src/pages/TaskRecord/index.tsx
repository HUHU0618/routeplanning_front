// 查看 更新 修改

import { Input, Button, Divider, Dropdown, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import StyledCard from '../../components/StyledCard';
import { TableListItem } from './data';
import { queryTask, updateTask, addTask } from '../../services/general';

import CreateForm from './components/CreateForm'


const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps { }

const TableList: React.FC<TableListProps> = () => {
  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState(0);

  // 在搜索表单中，“搜索时间段”的渲染方法
  const renderRangePicker =
    (item, config: { value, onChange }) =>
      (<RangePicker
        onChange={(value) => {
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
      title: '配送点编号',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => (a.id - b.id),
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
      // hideInSearch: true,
    },
    {
      title: '需求量',
      dataIndex: 'demand',
      key: 'demand',
      sorter: (a, b) => (a.demand - b.demand),
      // hideInSearch: true,
    },
    {
      title: '修改',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (text, record, index, action) => (
        <a
          onClick={() => handleShowModal(record)}
        >
          修改需求
        </a>
      ),

    },
  ];

  const handleShowModal = (record) => {
    setModalVisible(true);
    setRecord(record);
  }

  const handleSubmitTask = async value => {
    const hide = message.loading('正在提交信息...');
    console.log('value: ', value);
    const res = await updateTask({
      // id: record.id,
      demand: record.demand,
      // remark: value.remark,
    });
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success('提交成功'); // 成功则提示添加成功并return true
    return true;
  }


  return (
    <PageHeaderWrapper>
      <StyledCard
        title='配送点记录'
        renderTitleRight={() => (
          <div>
            <Button icon="plus" type="primary" onClick={() => console.log('hello')}>
              新增配送点
            </Button>
            <Button type="primary" onClick={() => console.log('hello')}>
              规划路径
            </Button>
          </div>
        )}
        renderContent={() => (
          <ProTable<TableListItem>
            columns={columns}
            rowKey="key"
            request={params => queryTask(params)}
            actionRef={actionRef}
            toolBarRender={() => []}
          />
        )}
      />
      {/* {(!modalVisible) ? (<div>hello</div>) : (
        <DetailModal
          visible={modalVisible}
          changeVisible={setModalVisible.bind(this)}
          descConfig={modalData.descConfig}
          tableConfig={modalData.tableConfig}
          descData={modalData.descData}
          tableData={modalData.tableData}
        />
      )} */}
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
