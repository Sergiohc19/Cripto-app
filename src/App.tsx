import { CriptoSearchForm } from "./components/CriptoSearchForm";



export const App = () => {



  return (
    <div className="container">
      <h1 className="app-title">
        Cotizador de <span>Criptomonedas</span>
      </h1>

      <div className="content">
        <CriptoSearchForm />
      </div>
    </div>
  );
};
