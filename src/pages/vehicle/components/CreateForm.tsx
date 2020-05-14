import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

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
  return (
    <Modal
      destroyOnClose
      title="新增配送车辆"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户id">
      {form.getFieldDecorator('id', {
        rules: [{ required: true }],
      })(<Input placeholder="请输入" />)}
    </FormItem> */}
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="车辆型号">
        {form.getFieldDecorator('typeId', {
          rules: [{ required: true }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
