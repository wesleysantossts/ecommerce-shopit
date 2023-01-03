export default class ApiFeatures {
  constructor (query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const { keyword } = this.queryStr;
    
    if (keyword) {
      // 'i' - transforma em case-insensitive
      const queryStrRegex = new RegExp(keyword, 'i')
      this.query = this.query.find({ nome: queryStrRegex });
    }

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removendo os campos da consulta
    const removeFields = ['keyword', 'limit', 'page'];
    removeFields.forEach(el => delete queryCopy[el]);

    // Filtro avançado de preço, avaliações, etc
    let queryStr = JSON.stringify(queryCopy);
    // Expressão regular para bater as condições (maior "gt", maior ou igual "gte", menor "lt", menor ou igual "lte")
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    // skip - é o salto de itens por página
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}