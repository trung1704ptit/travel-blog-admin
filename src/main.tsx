import App from '@/App';
import Loader from '@/components/loader';
import { antdConfig } from '@/constants';
import '@/index.css';
import { injectStore } from '@/lib/http';
import { store } from '@/store';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const persistor = persistStore(store);
injectStore(store);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider {...antdConfig}>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ConfigProvider>
);

window?.addEventListener('vite:preloadError', () => {
  window?.location?.reload();
});
