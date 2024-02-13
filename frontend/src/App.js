import logo from './logo.svg';
import './App.css';
import Matrices from './pages/matrices';
import Logs from './pages/logs';
import Navbar from './components/navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
     <Matrices/>
     <Logs/>
    </div>
  );
}

export default App;
