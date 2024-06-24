import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { Donate } from "./components/Donate";
import { Paysuccess } from "./components/Paysuccess";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-center" />
        <div className="container mx-auto">
          <Header />
          <div className="mt-8 px-4 md:px-0">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/paysuccess" element={<Paysuccess />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
