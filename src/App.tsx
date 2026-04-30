import logo from './assets/logo.png'
import { TodoLists } from './TodoLists'

function App() {
  return (
    <>
      <img src={logo} alt="logo" width={400}/>
      <TodoLists />
    </>
  )
}

export default App