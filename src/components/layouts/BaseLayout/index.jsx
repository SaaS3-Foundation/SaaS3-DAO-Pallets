import { Layout } from '@douyinfe/semi-ui';
import Header from './Header';

export default function BaseLayout({ children }) {
  return (
    <Layout className="h-full">
      <Header />
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  );
}
