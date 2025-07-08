import './App.css'
import Forms from './components/Forms/'
import {Route, Routes} from 'react-router-dom'
import RoomPage from './pages/RoomPage'


const App=()=> {

  return (
    <>
      <div className='conatainer'>
        <Routes>
          <Route path="/" element={<Forms/>} />

          <Route path="/:roomId" element={<RoomPage/>} />
        </Routes> 
      </div>
    </>
  )
}

export default App
