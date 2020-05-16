import {
  Input,
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Menu,
  message,
  Card,
  Row,
  DatePicker,
  Popconfirm
} from "antd";
import React, { useState, useRef } from "react";
import { FormComponentProps } from "antd/es/form";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import ProTable, { ProColumns, ActionType } from "@ant-design/pro-table";
import StyledCard from "../../components/StyledCard";
import { TableListItem } from "./data";
import { queryVehicleType } from "../../services/general";
import moment from "moment";
import CreateForm from "./components/CreateForm";

const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {}

const TableList: React.FC<TableListProps> = () => {
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormValues, setStepFormValues] = useState({});

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState(0);

  // 在搜索表单中，“搜索时间段”的渲染方法
  const renderRangePicker = (item, config: { value; onChange }) => (
    <RangePicker
      onChange={value => {
        console.log("changed: ", config.value);
        config.onChange([
          moment(value[0]).format("YYYY-MM-DD"),
          moment(value[1]).format("YYYY-MM-DD")
        ]);
      }}
    />
  );

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "车辆类型编号",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "车辆油耗",
      dataIndex: "cost",
      key: "cost",
      sorter: (a, b) => a.cost - b.cost
    },
    {
      title: "车辆载重",
      dataIndex: "load",
      key: "load",
      sorter: (a, b) => a.load - b.load
    }

    // {
    //   title: '添加时间',
    //   dataIndex: 'createdAt',
    //   valueType: 'dateTime',
    //   sorter: (a, b) => moment(a.createdAt).isBefore(b.createdAt),
    //   renderFormItem: renderRangePicker, // 在搜索表单中，渲染该项（定制化)
    //   formItemProps: { prop: { onReset: () => console.log('createdAt reset') } }
    // },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    // },
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
    //     <a
    //       onClick={() => {
    //         // handleUpdateModalVisible(true);
    //         // setStepFormValues(record);
    //       }}
    //     >
    //       查看详情
    //     </a>
    //   ),
    // },
  ];

  return (
    <PageHeaderWrapper>
      <StyledCard
        title="车辆型号记录"
        renderTitleRight={() => (
          <div>
            <Button
              icon="plus"
              type="primary"
              onClick={() => setCreateModalVisible(true)}
            >
              新增车辆型号
            </Button>
          </div>
        )}
        renderContent={() => (
          <ProTable<TableListItem>
            columns={columns}
            rowKey="key"
            request={params => queryVehicleType(params)}
            actionRef={actionRef}
            toolBarRender={() => []}
          />
        )}
      />

      {/* 新增车辆型号的 Modal */}
      <CreateForm
        // onSubmit={async value => {
        //   const success = await handleAddBook(value);
        //   console.log('add book: ', value);
        //   if (!success) return false;
        //   changeModalVisible(false);
        //   if (actionRef.current) {
        //     actionRef.current.reload();
        //   }
        //   return true;
        // }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
