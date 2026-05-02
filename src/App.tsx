import logo from './assets/logo.png'
import { Route, Routes } from 'react-router-dom'
import { PageShell } from './components/PageShell'
import { TodoLists } from './features/todo-lists/TodoLists'
import { TodoItems } from './features/todo-items/TodoItems'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageShell>
            <header className="mb-10 text-center">
              <img
                src={logo}
                alt=""
                className="mx-auto h-14 w-auto opacity-[0.92] drop-shadow-sm sm:h-16"
              />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700/70">
                Todo
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Your lists
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                Create lists, add tasks, and stay on top of what matters.
              </p>
            </header>
            <TodoLists />
          </PageShell>
        }
      />
      <Route
        path="/lists/:listId"
        element={
          <PageShell>
            <TodoItems />
          </PageShell>
        }
      />
    </Routes>
  )
}

export default App
