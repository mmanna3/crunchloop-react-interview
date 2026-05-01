import logo from './assets/logo.png'
import { Route, Routes } from 'react-router-dom'
import { TodoLists } from './features/todo-lists/TodoLists'
import { TodoItems } from './TodoItems'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <img src={logo} alt="logo" width={400} />
            <TodoLists />
          </>
        }
      />
      <Route path="/lists/:listId" element={<TodoItems />} />
    </Routes>
  )
}

export default App