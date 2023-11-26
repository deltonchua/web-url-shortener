import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import URL from './URL';

export default function App() {
  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:id' element={<URL />} />
      </Routes>
    </div>
  );
}
