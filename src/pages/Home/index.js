import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import { ProductList } from './styles';

import * as CartActions from '../../store/modules/cart/actions';

function Home({ amount, addToCartRequest }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id) {
    // quem injeta essa prop é o  connect do react-redux

    addToCartRequest(id);
  }

  /** Tomar cuidado com funções que são chamadas
   *  desnecessariamente no render */

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong> {product.title} </strong>
          <span> {product.priceFormatted} </span>
          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdShoppingCart color="#fff" size={16} />
              {amount[product.id] || 0}
            </div>
            <span> ADD TO CART </span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);
// null pq ainda não tem mapStateToProps
export default connect(mapStateToProps, mapDispatchToProps)(Home);
