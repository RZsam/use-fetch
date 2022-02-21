import "./App.css";
import CustomFetch from "./pages/custom-fetch";
import ReactQueryFetch from "./pages/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="linksConttainer">
                <Link className="link" to="/custom-fetch">
                  custom-fetch
                </Link>
                <Link className="link" to="react-qurey">
                  react-query
                </Link>
              </div>
            }
          />
          <Route exact path="/custom-fetch" element={<CustomFetch />} />
          <Route
            path="/react-qurey"
            element={
              <QueryClientProvider client={queryClient}>
                <ReactQueryFetch />
              </QueryClientProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
