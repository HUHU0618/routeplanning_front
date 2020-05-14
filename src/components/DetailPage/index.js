import React, { Fragment } from 'react';
import { Table, Card, Descriptions, Divider, Skeleton, Tag } from 'antd';
import StyledCard from '@/components/StyledCard';


export const DetailPage = props => {
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
    <Fragment>
      <StyledCard 
      title={descConfig.title}
      renderContent={() => renderDesc(descConfig, descData)}
      />
      <StyledCard 
      title={tableConfig.title}
      renderContent={() => renderTable(tableConfig, tableData)}
      />
    </Fragment>
  )
}
