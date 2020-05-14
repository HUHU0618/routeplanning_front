import { Form, Input, InputNumber, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, onSubmit: handleSubmit, onCancel } = props;
  const okHandle = () => {
    form.validateFields(async (err, fieldsValue) => {
      if (err) return;

      //添加成功则reset
      const reset = await handleSubmit(fieldsValue);
      if (reset) form.resetFields();
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加未收录书籍"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="书名">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入书名！', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="售价">
        {form.getFieldDecorator('salePrice', {
          rules: [{ required: true, message: '请输入售价！' }],
        })(<InputNumber placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="进货价">
        {form.getFieldDecorator('purchasePrice', {
          rules: [{ required: true, message: '请输入进货价！' }],
        })(<InputNumber placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
        {form.getFieldDecorator('author', {
          rules: [{ required: true, message: '请输入书籍作者或编者！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出版社">
        {form.getFieldDecorator('publisher', {
          rules: [{ required: true, message: '请输入书籍出版社！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="书籍分类">
        {form.getFieldDecorator('category', {
          rules: [{ required: true, message: '请输入书籍分类！' }],
        })(<InputNumber placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          // rules: [{ required: true, message: '请输入书籍描述！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
