import React from 'react';
import { Helmet } from 'react-helmet'; // usado para inserir arquivos no head do site

const Metadata = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - ShopIT`}</title>
    </Helmet>
  )
};

export default Metadata;