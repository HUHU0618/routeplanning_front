import React from 'react';
import { Table, Modal, Card, Descriptions, Divider, Skeleton, Tag } from 'antd';
import StyledCard from '@/components/StyledCard';


export const DetailModal = props => {
  const { visible, changeVisible } = props;
  const { descData, descConfig, tableConfig, tableData } = props;

  const renderDesc = (config, data) => {
    if(data === undefined) return (<div></div>)
    return (
        <Descriptions column={2}>
        {
            Object.keys(config.subtitles).map(key => (
            <Descriptions.Item label={config.subtitles[key]}>
                {data[key]}
            </Descriptions.Item>)
            )
        }
        </Descriptions>
    )
  }

  const renderTable = (config, data) => (
      <Table columns={config.columns} dataSource={data} pagination={false}/>
  )


  return (
    <Modal
        width={document.body.clientWidth - 200}
        bodyStyle={{ padding: '32px 40px 48px' }}
        title="订单详情"
        visible={visible}
        destroyOnClose
        onCancel={() => changeVisible(false)}
        footer={null}
    >
        <StyledCard
            title={descConfig.title}
            renderContent={() => renderDesc(descConfig, descData)}
        />
        <StyledCard 
            title={tableConfig.title}
            renderContent={() => renderTable(tableConfig, tableData)}
        />
    </Modal>
  )
}
