import Header from './components/Header';
import Footer from './components/Footer';
import Meter from './components/Meter';
import Vignette from './components/Vignette';
import Grain from './components/Grain';
import Fiducials from './components/Fiducials';
import Stories from './components/Stories';
import Scene3D from './components/Scene3D';
import { useKeyboardNav } from './hooks/useKeyboardNav';

const TOTAL = 4;

const App = () => {
  useKeyboardNav(TOTAL);
  return (
    <>
      <Scene3D />
      <div className="stage">
        <Header />
        <main>
          <Vignette />
          <Fiducials />
          <div className="center">
            <div className="scroll-driver" id="scroll-driver" />
          </div>
          <Stories />
          <Meter />
          <Grain />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
