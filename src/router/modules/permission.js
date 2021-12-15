// 审批模块
import Layout from '@/layout'

export default {
  path: '/permission',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permission',
      component: () => import('@/views/permission'),
      meta: { title: '审批', icon: 'lock' }
    }
  ]
}