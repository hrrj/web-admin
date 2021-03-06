import React, { ComponentType, LazyExoticComponent } from 'react';
import Layout from '../views/layout/index';
import Login from '../views/login/index';
import { routerGuard } from '../permission';
const Home = routerGuard(React.lazy(() => import('../views/home/index')));
const TablePage = routerGuard(React.lazy(() => import('../views/table/index')));
const TreePage = routerGuard(React.lazy(() => import('../views/tree/index')));
const Child1 = routerGuard(React.lazy(() => import('../views/table/children/Child1')));
const Child2 = routerGuard(React.lazy(() => import('../views/table/children/Child2')));
const Child11 = routerGuard(React.lazy(() => import('../views/table/children/children/Child1-1')));
const Child12 = routerGuard(React.lazy(() => import('../views/table/children/children/Child1-2')));

export type AppRouteComponent = ComponentType | LazyExoticComponent<any>;
export interface AppRoute {
  path: string;
  component?: AppRouteComponent;
  name?: string;
  redirect?: string;
  exact?: boolean;
  meta?: any;
  children?: AppRoute[];
}

export const menuData: AppRoute[] = [
  {
    path: '/home',
    meta: {title: 'Home', icon: 'home'},
    component: Home,
  }, {
    path: '/example',
    meta: {title: 'Example', icon: 'example'},
    children: [
      {
        path: '/example',
        redirect: '/example/table',
      },
      {
        path: 'table',
        component: TablePage,
        meta: {title: 'Table', icon: 'table'},
        children: [
          {
            path: '/example/table',
            redirect: '/example/table/child1',
          },
          {
            path: 'child1',
            component: Child1,
            meta: {title: 'Child1'},
            children: [
              {
                path: '/example/table/child1',
                redirect: '/example/table/child1/child1-1',
              },
              {
                path: 'child1-1',
                component: Child11,
                meta: {title: 'Child1-1'},
              }, {
                path: 'child1-2',
                component: Child12,
                meta: {title: 'Child1-2'},
              },
            ],
          }, {
            path: 'child2',
            component: Child2,
            meta: {title: 'Child2'},
          },
        ],
      }, {
        path: 'tree',
        component: TreePage,
        meta: {title: 'Tree', icon: 'tree'},
      },
    ],
  }, {
    path: 'https://www.baidu.com',
    meta: {title: 'ExternalLink', icon: 'link', target: '_blank'},
  },
];

const routerData: AppRoute[] = [
  {
    path: '/login',
    component: Login,
  }, {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        redirect: '/home',
      },
      ...menuData,
    ],
  },
];

// 格式化路由，redirect放在当前路由层级最后
const formatRouterData = (data: AppRoute[]): AppRoute[] => {
  data.forEach((route) => {
    if (route.children) {
      return formatRouterData(route.children);
    }
    return route;
  });
  return data.sort((a, b) => {
    const aNum = a.redirect ? 1 : 0;
    const bNum = b.redirect ? 1 : 0;
    return aNum - bNum;
  });
};

export default formatRouterData(routerData);
