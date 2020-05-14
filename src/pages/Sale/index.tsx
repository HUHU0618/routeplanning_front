import { Button, Divider, Dropdown, Form, 
    Icon, Menu, message, Table, 
    Card, Col, Row, InputNumber } from 'antd';
  import React, { useState, useRef } from 'react';
  import { PageHeaderWrapper } from '@ant-design/pro-layout';
  import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
  import StyledCard from '../../components/StyledCard';
  import { queryBook, addSale } from '../../services/general';
 

// 库存书籍列表 组件
  const BookList = props => {
    // 选中的行
    let [selectedRows, setSelectedRows] = useState([]);
  
    const { handleAddSale } = props;
  
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
        render: (text, record) => 
          <a href={`/book_detail?id=${record.id}`}>
            {text}
          </a>,
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
        title: '售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        valueType: 'money',
        hideInSearch: true,
        sorter: (a, b) => (a.salePrice - b.salePrice),
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
        key: 'option',
        valueType: 'option',
        render: (_, record) => (
            <a onClick={() => handleAddSale(record)}>添加到订单</a>
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
      </div>
    );
  };
  
  
  // 订单 组件
  const SaleList = props => {
    const { data, handleDeleteSale, handleSaleNumChange } = props;
  
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
        title: '售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: val => `￥ ${val}`,
      },
      {
        title: '库存数量',
        dataIndex: 'stockNum',
        key: 'stockNum',
        render: val => `${val} 本`,
      },
      {
        title: '出售数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        render: (_, record) => (
          <InputNumber 
            onChange={(val)=> handleSaleNumChange(val, record)}
            size='small' 
            placeholder='数量' 
            value={record.saleNum} 
            min={0} max={record.stockNum} step={1}/>
        )
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        key: 'option',
        render: (_, record) => (
            <a onClick={() => {handleDeleteSale(record)}}>删除</a>
        ),
      },
    ];
  
    return (
      <Table columns={columns} dataSource={data}/>
    )
  }
  
  
  class Sale extends React.Component {
    state = {
      saleList: [],
      count: 0,
      sum: 0,
    }
  
  
    // todo: 
    // 向后端提交订单
    handleSubmitSale = async () => {
      const { sum, count, saleList } = this.state;
      if(count === 0) return;
      const submit = {
        sales: sum,
        typeCount: count,
        saleList,
      }
      const hide = message.loading('正在提交订单...');
      const res = await addSale(submit); // 添加操作
      hide(); // 正在添加loading消失
      if(!res.success) return false; // 如果失败就return false
      message.success('提交成功！'); //成功则提示添加成功并return true
      this.handleResetSale(); // 清空采购单
      return true;
    }
  
  
    // 将书籍添加至订单
    handleAddSale = record => {
      let { sum, count } = this.state;
      let flag = false;
      let newlist = [...this.state.saleList];
  
      // 判断采购单中是否有同id书籍，若有则数量加1
      newlist.map(item => {
        if(item.id === record.id) {
          item.saleNum += 1;
          flag = true;
          sum += 1 * item.salePrice;
        }
      });
  
      // 若没有重复书籍, 则添加新书(默认购买1本)
      if (!flag) {
        newlist = [...newlist, {...record, saleNum: 1}];
        count += 1;
        sum += 1 * record.salePrice;
      }
      this.setState({ saleList: newlist, sum, count });
    }
  
  
    // 改变订单中的购买数量
    handleSaleNumChange = (val, record) => {
      const newList = this.state.saleList;
      let sum = 0;
      newList.map(item => {
        if (item.id === record.id) {
          item.saleNum = val;
          sum += item.salePrice * val;
        } else {
          sum += item.saleNum * item.salePrice;
        }
      })
      this.setState({ saleList: newList, sum });
    }
  
  
    // 将书籍从订单中删除
    handleDeleteSale = record => {
      console.log('del:', record);
      console.log('old sale list: ', this.state.saleList);
      let newList = [...this.state.saleList];
      let sum = 0;
  
      // 找到record对应的项目并删除
      newList = newList.filter(item => {
        if(item != record) sum += item.saleNum * item.salePrice;
        return item != record;
      });
  
      console.log('new sale list', newList);
      this.setState({
        saleList: newList,
        count: newList.length,
        sum,
       });
    }
  
  
    // 清空订单
    handleResetSale = () => {
      this.setState({ saleList: [], count: 0, sum: 0 });
    }


    render(){
      const { saleList, count, sum } = this.state;
      return (
        <PageHeaderWrapper title="收银台">
          <StyledCard
            title='库存书籍列表'
            renderContent={() => (
              <BookList 
                handleAddSale={this.handleAddSale.bind(this)}
              />
            )}
          />
          <StyledCard
            title='订单'
            renderTitleRight={() => (
              <div>
                <Button onClick={() => this.handleResetSale()}>清空</Button>
                <Button icon="check" type="primary" onClick={() => this.handleSubmitSale()}>
                确认购买
                </Button>
                <div style={{float: 'right', margin:'2px 10px 20px', fontSize:'18px'}}>
                共 {count} 件，总计 {sum} 元
                </div>
              </div>
            )}
            renderContent={() => (
              <SaleList 
                data={saleList}
                handleDeleteSale={this.handleDeleteSale.bind(this)}
                handleSaleNumChange={this.handleSaleNumChange.bind(this)}
              /> 
            )}
          />
        </PageHeaderWrapper>
      )
    }
  }
  export default Form.create()(Sale);
