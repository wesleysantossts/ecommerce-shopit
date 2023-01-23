import React, { Fragment, useState, useEffect } from 'react';
import Metadata from './layout/Metadata';
import Produtos from './products/products';
import Loader from './layout/Loader';
import Pagination from 'react-js-pagination';

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/modules/produtos/actions'; // deve-se importar as funções dos actions para funcionar
import { useAlert } from 'react-alert';

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, error, productsCount, resPerPage } = useSelector(state => state.products)
  console.log("🚀 ~ file: Home.js:14 ~ Home ~ productsCount", productsCount, resPerPage)
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState()
  
  useEffect(() => {
    if (error) return alert.error(error || 'Erro ao buscar os produtos')

    dispatch(getProducts(currentPage))
  }, [dispatch, alert, error, currentPage])
  
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
      <div className="d-flex justify-content-center w-100">
        <Pagination 
          activePage={currentPage} // pagina atual
          itemsCountPerPage={resPerPage} // resultados por página
          totalItemsCount={productsCount} // quantidade total de produtos
          onChange={(pageNumber) => setCurrentPage(pageNumber)} // mudar de página
          nextPageText={'Próxima'}
          prevPageText={'Anterior'}
          firstPageText={'Primeira'}
          lastPageText={'Última'}
          itemClass='page-item' // estilo de cada componente
          linkClass='page-link' // estilo dos links
        />
      </div>
    </Fragment>
  )
};

export default Home;