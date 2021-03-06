/**
 * USER API
 * Namespace: User
 */

export const UserApi = {
  user: [
    {
      name: 'login',
      method: 'POST',
      path: '/api/base/login/login',
      mockPath: '/api/base/login/login',
      params: {
        userAccount: '',
        userPassword: ''
      },
      desc: '用户登录'
    },
    {
      name: 'logout',
      method: 'POST',
      path: '/api/base/login/logout',
      mockPath: '/api/base/login/logout',
      params: {
        userAccount: '',
        userId: ''
      },
      desc: '用户注销'
    },
    {
      name: 'reset',
      method: 'POST',
      path: '/api/base/user/resetPassWord',
      mockPath: '/api/base/user/resetPassWord',
      params: {
        id: ''
      },
      desc: '用户重置密码'
    },
    {
      name: 'password.edit',
      method: 'POST',
      path: '/api/base/user/updatePassWord',
      mockPath: '/api/base/user/updatePassWord',
      params: {
        oldUserPassword: '',
        userPassword: ''
      },
      desc: '修改登录用户密码'
    }
  ]
}
