import { Navigate, Route, Routes } from "react-router-dom"

import { StartView } from "@/views/start-view"
import { HomeView } from "@/views/home-view"
import { HistoryView } from "@/views/history-view"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<StartView />} />
      <Route path="/jugar" element={<HomeView />} />
      <Route path="/historial" element={<HistoryView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App