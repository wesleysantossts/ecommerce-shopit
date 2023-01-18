import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    // BrowserRouter - para englobar as rotas
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          {/* Routes - para informar onde vão ficar as rotas */}
          <Routes>
            {/* <Route path="/" element={<Elemento />} /> - aponta qual é o componente que será mostrado na rota. Propriedade "path" indica a rota que será digitada no navegador, a propriedade "element" indica o componente que será mostrado nessa rota */}
            <Route path="/" element={<Home />} />  
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
