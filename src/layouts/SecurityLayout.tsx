import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}
//  <SecurityLayoutProps, SecurityLayoutState>
class SecurityLayout extends React.Component {
  state: SecurityLayoutState = {
    isReady: false,
  };

  // componentDidMount() {
  //   this.setState({
  //     isReady: true,
  //   });
  //   const { dispatch } = this.props;
  //   if (dispatch) {
  //     dispatch({
  //       type: 'user/fetchCurrent',
  //     });
  //   }

  // }

  render() {
    return (<React.Fragment>{this.props.children}</React.Fragment>)

    // const { isReady } = this.state;
    // const { children, loading, currentUser } = this.props;
    // // console.log('cur user: ', currentUser)

    // // You can replace it to your authentication rule (such as check token exists)
    // // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = currentUser && currentUser.user_name;
    // // const isLogin = currentUser && currentUser.userid;
    // const queryString = stringify({
    //   redirect: window.location.href,
    // });

    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }
    // if (!isLogin) {
    //   return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    // }
    // return children;
  }
}

export default connect(({ user, loading, login }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
