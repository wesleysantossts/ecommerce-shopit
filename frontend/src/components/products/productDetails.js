import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-bootstrap';

import { getProductDetails } from '../../store/modules/produtos/actions';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader';

const ProductDetails = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { loading, error, product } = useSelector(state => state.productDetails)

  useEffect(() => {
    dispatch(getProductDetails(params.id))
  }, [dispatch])

  return (
    <Fragment>
      {loading || loading === undefined
        ? <Loader />
        :  
        <div className="row f-flex justify-content-around">
          <div className="col-12 col-lg-5 img-fluid" id="product_image">
            <Carousel
              pause="hover" 
            >
              {product?.imagens && product.imagens.map((item, index) => (
                <Carousel.Item 
                  key={index}
                >
                  <img className="d-block w-100" src={item.url} alt={product.nome} />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          <div className="col-12 col-lg-5 mt-5">
            <h3>{product.nome}</h3>
            <p id="product_id">Produto # {product._id}</p>

            <hr/>

            <div className="rating-outer">
              <div className="rating-inner" style={{ width: `${(product.avaliacaoNota / 5) * 100}%` }}></div>
            </div>
            <span id="no_of_reviews">({product.quantidadeReviews} Reviews)</span>

            <hr/>

            <p id="product_price">R$ {product.preco.toLocaleString('pt-BR')}</p>
            <div className="stockCounter d-inline">
              <span className="btn btn-danger minus">-</span>

              <input type="number" className="form-control count d-inline" value="1" readOnly />

              <span className="btn btn-primary plus">+</span>
            </div>
            <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button>

            <hr/>

            <p>Status: <span id="stock_status" className={product.estoque > 0 ? 'greenColor' : 'redColor'}>{product.estoque > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

            <hr/>

            <h4 className="mt-2">Description:</h4>
            <p>{product.descricao}</p>
            <hr/>
            <p id="product_seller mb-3">Sold by: <strong>{product.vendedor}</strong></p>
          
            <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
              Submit Your Review
            </button>
          </div>

          <div className="row mt-2 mb-5">
            <div className="rating w-50">
              <div className="modal fade" id="ratingModal" tabIndex="1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">

                      <ul className="stars" >
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                      </ul>

                      <textarea name="review" id="review" className="form-control mt-3"></textarea>

                      <button className={"btn my-3 float-right review-btn px-4 text-white"} data-dismiss="modal" aria-label="Close">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </Fragment>
  )
};

export default ProductDetails;