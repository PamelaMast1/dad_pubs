import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import MapPage from "./pages/MapPage";
import Timeline from "./pages/Timeline";
import Facts from "./pages/Facts";
import About from "./pages/About";
import Photos from "./pages/Photos";

function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/facts" element={<Facts />} />
          <Route path="/about" element={<About />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
