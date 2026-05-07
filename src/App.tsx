import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { StarryBackground } from './components/StarryBackground';
import { MainPage } from './pages/MainPage';
import { AdminPage } from './pages/AdminPage';
import { SnakeGame } from './pages/SnakeGame';
import { MinesweeperGame } from './pages/MinesweeperGame';
import './styles/global.css';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <StarryBackground />
        <div className="app">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/game/snake" element={<SnakeGame />} />
            <Route path="/game/minesweeper" element={<MinesweeperGame />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
