import React, { Fragment, useState, useEffect } from 'react';
import Metadata from './layout/Metadata';
import Produtos from './products/products';
import Loader from './layout/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/modules/produtos/actions'; // deve-se importar as funções dos actions para funcionar
import { useAlert } from 'react-alert';

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector(state => state.products)
  const alert = useAlert();
  
  useEffect(() => {
    if (error) return alert.error(error || 'Erro ao buscar os produtos')

    dispatch(getProducts)
  }, [dispatch, alert, error])
  
  return (
    <Fragment>
      <Metadata title="Melhores Produtos Online" />
      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        {loading ? 
          <Loader />
          :
          <div className="row">
            {products && products.map((item, index) => (<Produtos key={index} produto={item} />))}
          </div>
        }
      </section>
    </Fragment>
  )
};

export default Home;