import { useRoutes } from 'react-router';
import * as reactIs from 'react-is';
import React from 'react';
import { routersConfig } from './config';

// router before each component
function RouterBeforeEach(props) {
  const { children } = props;

  // const location = useLocation();
  // const { pathname } = location;
  // const access_token = localStorage.getItem('access_token');
  // const accessLogin = ['/register', '/login'].find((path) => pathname.startsWith(path));
  // if (route.meta?.title !== undefined) {
  //   document.title = route.meta.title;
  // }
  // if (!accessLogin && !access_token) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}

const getLayoutComponent = (item) => {
  const { layout: Layout } = item;
  if (reactIs.isValidElementType(Layout)) return Layout;
  return ({ children }) => children;
};

const wrapper = (configItem) => {
  const { element: Child, cutomFallBack } = configItem;
  const Layout = getLayoutComponent(configItem);
  if (reactIs.isElement(Child)) { // element
    return <Layout>{Child}</Layout>;
  }
  const HandledChild = (
    <RouterBeforeEach route={configItem}>
      <React.Suspense fallback={cutomFallBack || <>...</>}>
        <Child />
      </React.Suspense>
    </RouterBeforeEach>
  );
  return ( // lazy component
    <Layout>
      {HandledChild}
    </Layout>
  );
};

const config = routersConfig.map((item) => ({
  ...item,
  element: wrapper(item),
}));

export const RenderRouters = () => useRoutes(config);
