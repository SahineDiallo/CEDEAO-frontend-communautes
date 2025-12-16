// src/App.jsx

import { BrowserRouter as Router } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import AppRoutes from './components/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoutes />
          <ToastContainer
              position="top-right" 
              autoClose={5000} 
              hideProgressBar={false}
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
            />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
