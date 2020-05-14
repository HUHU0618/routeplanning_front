import { Button, Divider, Dropdown, Form, 
  Icon, Menu, message, Table, 
  Card, Col, Row, InputNumber, 
  Input, Select, DatePicker, notification } from 'antd';
import React, { useState, useRef } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm  from './components/CreateForm';
import StyledCard from '../../components/StyledCard';
import { BookListItem } from './data.d';
import { queryBook, addBook, addPurchase } from '../../services/general';


const BookList = props => {
  // 选中的行
  let [selectedRows, setSelectedRows] = useState([]);

  const { modalVisible, changeModalVisible, handleAddBook, handleAddPurchase } = props;

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: record => ({
    //   disabled: record.title === 'Disabled User', // Column configuration not to be checked
    //   title: record.title,
    // }),
  };

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<BookListItem>[] = [
    {
      title: '书籍id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ISBN',
      dataIndex: 'ISBN',
      key: 'ISBN',
    },
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
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
      title: '进货价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      valueType: 'money',
      hideInSearch: true,
      sorter: (a, b) => (a.purchasePrice - b.purchasePrice),
    },
    {
      title: '库存数量',
      dataIndex: 'stockNum',
      key: 'stockNum',
      renderText: (val: string) => `${val} 本`,
      sorter: (a, b) => (a.stockNum - b.stockNum),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      valueType: 'option',
      render: (_, record) => (
          <a onClick={() => handleAddPurchase(record)}>添加到采购单</a>
      ),
    },
  ];


  return (
    <div>
      <ProTable<BookListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="key"
        // rowSelection={rowSelection} // 暂时去掉多选
        options={false}
        tableAlertRender={(selectedRowKeys, rows) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            <a style={{float: 'right'}} onClick={() => console.log('批量添加:',selectedRowKeys, rows)}>
             批量添加到采购单
            </a>
          </div>
        )}
        request={(params) => queryBook(params)}
        columns={columns}
        search={}
      />

      {/* 新增未收录书籍 */}
      <CreateForm
        onSubmit={async value => {
          const success = await handleAddBook(value);
          console.log('add book: ', value);
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


// 采购单 组件
const PurchaseList = props => {
  const { data, handleDeletePurchase, handlePurNumChange } = props;

  const columns = [
    {
      title: '书籍id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ISBN',
      dataIndex: 'ISBN',
      key: 'ISBN',
    },
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
    },
    {
      title: '进货价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: val => `￥ ${val}`,
    },
    {
      title: '库存数量',
      dataIndex: 'stockNum',
      key: 'stockNum',
      render: val => `${val} 本`,
    },
    {
      title: '购入数量',
      dataIndex: 'purchaseNum',
      key: 'purchaseNum',
      render: (_, record) => (
        <InputNumber 
          onChange={(val)=> handlePurNumChange(val, record)}
          size='small' 
          placeholder='数量' 
          value={record.purchaseNum} 
          min={0} step={10}/>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
          <a onClick={() => {handleDeletePurchase(record)}}>删除</a>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data}/>
  )
}


class Purchase extends React.Component {
  state = {
    purchaseList: [],
    count: 0,
    sum: 0,
    modalVisible: false,
  }


  // request error 处理模版（）
  // 添加未收录书籍
  handleAddBook = async (fields, action) => {
    const hide = message.loading('正在添加...'); // 正在添加loading出现
    const res = await addBook({...fields, stockNum: 0}); // 添加操作
    hide(); // 正在添加loading消失
    if(!res.success) return false; // 如果失败就return false
    message.success('添加成功！'); //成功则提示添加成功并return true
    return true;
  };


  // 向后端提交采购单
  handleSubmitPurchase = async () => {
    const { sum, count, purchaseList } = this.state;
    if(count === 0) return;
    const submit = {
      expend: sum,
      typeCount: count,
      status: 0,
      purchaseList,
    }
    const hide = message.loading('正在提交订单...');
    const res = await addPurchase(submit); // 添加操作
    hide(); // 正在添加loading消失
    if(!res.success) return false; // 如果失败就return false
    message.success('提交成功！'); //成功则提示添加成功并return true
    this.handleResetPurchase(); // 清空采购单
    return true;
  }


  // 将书籍添加至采购单
  handleAddPurchase = record => {
    let { sum, count } = this.state;
    let flag = false;
    let newlist = [...this.state.purchaseList];

    // 判断采购单中是否有同id书籍，若有则数量加10
    newlist.map(item => {
      if(item.id === record.id) {
        item.purchaseNum += 10;
        flag = true;
        sum += 10 * item.purchasePrice;
      }
    });

    // 若没有重复书籍, 则添加新书(默认购买10本)
    if (!flag) {
      newlist = [...newlist, {...record, purchaseNum: 10}];
      count += 1;
      sum += 10 * record.purchasePrice;
    }
    this.setState({ purchaseList: newlist, sum, count });
  }


  // 改变采购单中的购买数量
  handlePurNumChange = (val, record) => {
    const newList = this.state.purchaseList;
    let sum = 0;
    newList.map(item => {
      if (item.id === record.id) {
        item.purchaseNum = val;
        sum += item.purchasePrice * val;
      } else {
        sum += item.purchaseNum * item.purchasePrice;
      }
    })
    this.setState({ purchaseList: newList, sum });
  }


  // 将书籍从采购单中删除
  handleDeletePurchase = record => {
    console.log('del:', record);
    console.log('old pur list: ', this.state.purchaseList);
    let newList = [...this.state.purchaseList];
    let sum = 0;

    // 找到record对应的项目并删除
    newList = newList.filter(item => {
      if(item != record) sum += item.purchaseNum * item.purchasePrice;
      return item != record;
    });

    console.log('new pur list', newList);
    this.setState({
      purchaseList: newList,
      count: newList.length,
      sum,
     });
  }


  // 清空采购单
  handleResetPurchase = () => {
    this.setState({ purchaseList: [], count: 0, sum: 0 });
  }


  // 显示添加新书籍modal
  changeModalVisible = visible => {
    this.setState({ modalVisible: visible });
  }


  render(){
    const { purchaseList, count, sum, modalVisible } = this.state;
    return (
      <PageHeaderWrapper title="书籍采购">
        <StyledCard
          title='库存书籍列表'
          renderTitleRight={() => (
            <div>
              <Button icon="plus" type="primary" onClick={() => this.changeModalVisible(true)}>
                新增未收录书籍
              </Button>
            </div>
          )}
          renderContent={() => (
            <BookList 
              modalVisible={modalVisible}
              changeModalVisible={this.changeModalVisible.bind(this)}
              handleAddPurchase={this.handleAddPurchase.bind(this)}
              handleAddBook={this.handleAddBook.bind(this)}
            />
          )}
          />
        <StyledCard
          title='采购单'
          renderTitleRight={() => (
            <div>
              <Button onClick={() => this.handleResetPurchase()}>清空</Button>
              <Button icon="check" type="primary" onClick={() => this.handleSubmitPurchase()}>
                确认采购
              </Button>
              <div>
                共 {count} 件，总计 {sum} 元
              </div>
            </div>
          )}
          renderContent={() => (
            <PurchaseList 
              data={purchaseList}
              handleDeletePurchase={this.handleDeletePurchase.bind(this)}
              handlePurNumChange={this.handlePurNumChange.bind(this)}
            />
          )}
          />
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(Purchase);