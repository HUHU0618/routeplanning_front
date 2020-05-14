import React from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
// import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;

// interface FormProps extends FormComponentProps {
//   modalVisible: boolean;
//   onSubmit: (fieldsValue: { desc: string }) => void;
//   onCancel: () => void;
// }

const FormModal = props => {
  const { title, visible, onCancel, handleSubmit, form } = props;
  console.log('props: ', props);

  const okHandle = () => {
    form.validateFields(async (err, fieldsValue) => {
      // 先验证表单，验证失败则直接return
      if (err) return; 

      // 验证通过后，调用传进来的handleSubmit
      const reset = await handleSubmit(fieldsValue);

      // （调用结果）添加成功则reset，失败则不做任何改变
      if (reset) form.resetFields();
    });
  };
  
  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={() => onCancel()}
      onOk={okHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="现存数量">
        {form.getFieldDecorator('num', {
          rules: [{ required: true, message: '请输入书籍现存数量！' }],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          // rules: [{ required: true, message: '请输入书籍描述！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(FormModal);
