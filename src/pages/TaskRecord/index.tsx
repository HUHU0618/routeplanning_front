// 查看 更新 修改

import { Input, Button, Form, Icon, Menu, message, Card, Row, DatePicker, Popconfirm, Table, Tag, Space } from "antd";
import React, { useState, useRef } from "react";
import { FormComponentProps } from "antd/es/form";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import ProTable, { ProColumns, ActionType } from "@ant-design/pro-table";
import moment from "moment";
import StyledCard from "../../components/StyledCard";
import { TableListItem } from "./data";
import {
  queryTask,
  updateTask,
  addTask,
  routePlanning
} from "../../services/general";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";

interface TableListProps extends FormComponentProps { }


const tableColumns = [
  {
    title: '车辆编号',
    dataIndex: 'id',
    // key: 'id',
    // render: text => <a>{text}</a>,
  },
  {
    title: '配送路线',
    dataIndex: 'route',
    // key: 'route', 
  },
];

const data = [];

const TableList: React.FC<TableListProps> = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [routeModalVisible, setRouteModalVisible] = useState<boolean>(false);
  const [id, setId] = useState(0);

  const handleShowUpdateModal = id => {
    setUpdateModalVisible(true);
    setId(id);
  };

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "配送点编号",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "横坐标",
      dataIndex: "xaxis",
      key: "xaxis",
      sorter: (a, b) => a.xaxis - b.xaxis
    },
    {
      title: "纵坐标",
      dataIndex: "yaxis",
      key: "yaxis",
      sorter: (a, b) => a.yaxis - b.yaxis
      // hideInSearch: true,
    },
    {
      title: "需求量",
      dataIndex: "demand",
      key: "demand",
      sorter: (a, b) => a.demand - b.demand
      // hideInSearch: true,
    },
    {
      title: "修改",
      dataIndex: "option",
      valueType: "option",
      key: "option",
      render: (_, record) => (
        <a
          onClick={() => handleShowUpdateModal(record.id)}
        >
          修改需求量
        </a>
      )
    }
  ];

  const handleUpdateTask = async (value) => {
    const hide = message.loading("正在修改需求量...");
    const res = await updateTask({ id, demand: value.demand });
    console.log(`value:${value}`);
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success("修改需求量成功"); //成功则提示添加成功并return true
    // action.reload(); // 刷新表格
    return true;
  };

  const handleAddTask = async (fields, action) => {
    const hide = message.loading("正在添加..."); // 正在添加loading出现
    const res = await addTask({ ...fields }); // 添加操作
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success("添加成功！"); //成功则提示添加成功并return true
    return true;
  };


  const handleRoutePlanning = async () => {
    const hide = message.loading("正在转换为字符串...");
    const res = await routePlanning();
    const tempPath = [];
    console.log("res:", res);
    // for (let i = 0; i < res.length; ++i){
    //   tempPath[i] = res[i].join("-->");
    // }

    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success("修改需求量成功"); //成功则提示添加成功并return true
    // action.reload(); // 刷新表格
    return true;
  };



  // const changeModalVisible = visible => {
  //   this.setState({ modalVisible: visible });
  // };

  return (
    <PageHeaderWrapper>
      <StyledCard
        title="配送点记录"
        renderTitleRight={() => (
          <div>
            <Button
              icon="plus"
              type="primary"
              onClick={() => setCreateModalVisible(true)}
            >
              新增配送点
            </Button>
            <Button type="primary" onClick={() => handleRoutePlanning()}>
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

      {/* 新增配送点的 Modal */}
      <CreateForm
        onSubmit={async value => {
          // const success = await handleAddTask(value);
          // console.log("add task: ", value);
          const success = await handleAddTask(value);
          if (!success) return false;
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />

      {/* 修改需求的 Modal */}
      <UpdateForm
        onSubmit={async demand => {
          const success = await handleUpdateTask(id, demand);
          console.log("update task: ", demand);
          if (!success) return false;
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        onCancel={() => setUpdateModalVisible(false)}
        modalVisible={updateModalVisible}
      />


    </PageHeaderWrapper>
  );
};


export default Form.create<TableListProps>()(TableList);
