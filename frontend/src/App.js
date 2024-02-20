import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Matrices from './pages/matricesPage';
import Logs from './pages/logsPage';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Matrices />} />
        <Route path='/logs' element={<Logs />} />
      </Routes>
    </div></BrowserRouter>
  );
}

export default App;
