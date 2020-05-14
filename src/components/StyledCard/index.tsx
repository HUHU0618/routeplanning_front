import React, { ReactNode } from 'react';
import { Card, Row } from 'antd';
import styles from './index.less';

interface StyledCardProps {
  title: string,
  renderContent: () => ReactNode,
  renderTitleRight?: () => ReactNode,
}

const StyledCard: React.FC<StyledCardProps> = props => {
  const { title, renderTitleRight, renderContent } = props;

  return (
    // 为Card加上class customSelect，方便自定义组件样式
    <Card className={styles.customSelect}>
        <Row>
            <div className={styles.title} >{title}</div>
            {renderTitleRight ? (
                <div className={styles.titleRight}>{renderTitleRight()}</div>
            ):(
                null
            )}
        </Row>
        {renderContent()}
    </Card>
  );
};

export default StyledCard;
