import { Form, Input, Modal } from "antd";

import { FormComponentProps } from "antd/es/form";
import React from "react";

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  // const okHandle = () => {
  //   form.validateFields(async (err, fieldsValue) => {
  //     if (err) return;

  //     // 添加成功则reset
  //     const reset = await handleSubmit(fieldsValue);
  //     if (reset) form.resetFields();
  //   });
  // };
  return (
    <Modal
      destroyOnClose
      title="新增车辆型号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="车辆油耗"
      >
        {form.getFieldDecorator("cost", {
          rules: [{ required: true, message: "请输入车辆油耗！", min: 1 }]
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="车辆载重/吨"
      >
        {form.getFieldDecorator("xaxis", {
          rules: [{ required: true, message: "请输入横坐标！", min: 1 }]
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
