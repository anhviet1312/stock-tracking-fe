import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AuthProvider } from './lib/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AuthProvider>
  );
}

export default App;
