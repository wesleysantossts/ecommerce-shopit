import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Produtos = ({ produto }) => {
  return (
    <Fragment>
      <div className="col-sm-12 col-md-6 col-lg-3 my-3">
        <div className="card p-3 rounded">
          <img
            className="card-img-top mx-auto"
            src={produto.imagens[0].url}
            alt={produto.nome}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              <Link to={`/produto/${produto._id}`}>{produto.nome}</Link>
            </h5>
            <div className="ratings mt-auto">
              <div className="rating-outer">
                <div className="rating-inner" style={{ width: `${(produto.avaliacaoNota / 5) * 100}%` }}></div>
              </div>
              <span id="no_of_reviews">({produto.quantidadeReviews} Reviews)</span>
            </div>
            <p className="card-text">R$ {produto.preco}</p>
            <Link to={`/produto/${produto._id}`} id="view_btn" className="btn btn-block">View Details</Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default Produtos;