import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import { ProductList } from './styles';

import * as CartActions from '../../store/modules/cart/actions';

export default function Home() {
  const [products, setProducts] = useState([]);

  const amount = useSelector(state =>
    state.cart.reduce((totalAmount, product) => {
      totalAmount[product.id] = product.amount;
      return totalAmount;
    }, {})
  );

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

  const dispatch = useDispatch();

  function handleAddProduct(id) {
    // quem injeta essa prop é o  connect do react-redux
    dispatch(CartActions.addToCartRequest(id));
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
