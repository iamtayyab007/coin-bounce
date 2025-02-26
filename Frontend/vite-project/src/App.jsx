import { Navbar } from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />

          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />
            <Route
              path="crypto"
              exact
              element={<div className={styles.main}>Crypto Page</div>}
            />

            <Route
              path="blogs"
              exact
              element={<div className={styles.main}>blogs Page</div>}
            />

            <Route
              path="submit"
              exact
              element={<div className={styles.main}>Submit a Blog</div>}
            />

            <Route
              path="log-in"
              exact
              element={<div className={styles.main}>log in page</div>}
            />

            <Route
              path="crypto"
              exact
              element={<div className={styles.main}>Sign up</div>}
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
