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
import {
  queryVehicleType,
  addVehicle,
  addVehicleType
} from "../../services/general";
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
  ];

  const handleAddVehicleType = async (fields, action) => {
    const hide = message.loading("正在添加..."); // 正在添加loading出现
    const res = await addVehicleType({ ...fields }); // 添加操作
    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success("添加成功！"); //成功则提示添加成功并return true
    return true;
  };

  const changeModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

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
        onSubmit={async value => {
          const success = await handleAddVehicleType(value);
          console.log("add vehicletype: ", value);
          if (!success) return false;
          // changeModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
