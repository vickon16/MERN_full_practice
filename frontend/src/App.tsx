import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import NotePage from "./pages/note-page";
import NotFound from "./pages/not-found";
import AuthButton from "./components/auth-button";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen">
        <header className="h-[70px] flex items-center justify-between shadow-sm shadow-white/20 px-5 w-full">
          <h2 className="text-2xl font-semibold">MERN Notes</h2>
          <div className="flex items-center gap-5">
            <AuthButton />
          </div>
        </header>

        <main className="flex flex-col gap-5 px-5 py-10 w-full max-w-[1600px] mx-auto space-y-4 h-full min-h-[300px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes/:noteId" element={<NotePage />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
