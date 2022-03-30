import 'bootstrap/dist/css/bootstrap.min.css';
import 'emoji-mart/css/emoji-mart.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'emoji-mart/css/emoji-mart.css';
import { useLocation, useRoutes } from 'react-router-dom';
import { routesConfig } from 'routes';
import './App.scss';

function App() {
  const location = useLocation();
  const element = useRoutes(routesConfig, location);
  return element;
}

export default App;
