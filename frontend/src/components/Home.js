import React, { Fragment, useState, useEffect } from 'react';
import Metadata from './layout/Metadata';
import Produtos from './products/products';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/modules/produtos/actions'; // deve-se importar as funções dos actions para funcionar

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, error, productsCount } = useSelector(state => state.products)
  
  useEffect(() => {
    dispatch(getProducts)
  }, [dispatch])
  
  return (
    <Fragment>
      <Metadata title="Melhores Produtos Online" />
      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        {loading ? 
          <h2>Carregando...</h2>
          :
          <div className="row">
            {products && products.map(item => (<Produtos produto={item} />))}
          </div>
        }
      </section>
    </Fragment>
  )
};

export default Home;