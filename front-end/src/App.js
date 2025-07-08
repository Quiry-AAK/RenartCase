import './App.css';
import ProductList from './Components/ProductList';

function App() {
  return (
    <div className="App">
      <div className='product-list'>
        <h1 className='product-list-title'>Product List</h1>
        <div className="product-list-data-container">
          <ProductList />
        </div>
      </div>
    </div>
  );
}

export default App;
