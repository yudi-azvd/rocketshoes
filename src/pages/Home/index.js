import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import { ProductList } from './styles';

import * as CartActions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProduct = id => {
    // quem injeta essa prop é o  connect do react-redux
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  // heyo
  render() {
    /** Tomar cuidado com funções que são chamadas
     *  desnecessariamente no render */
    const { products } = this.state;
    const { amount } = this.props;

    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong> {product.title} </strong>
            <span> {product.priceFormatted} </span>
            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
            >
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
