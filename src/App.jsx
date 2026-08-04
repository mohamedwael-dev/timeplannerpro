import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import NotFound from './pages/NotFound'
import './App.css'

const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route
          path="about"
          element={
            <Suspense
              fallback={
                <div className="page-status" role="status">
                  Loading About page...
                </div>
              }
            >
              <About />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
