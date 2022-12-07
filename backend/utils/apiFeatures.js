export default class ApiFeatures {
  constructor (query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // const keyword = this.queryStr.keyword && {
      //   name: {
    //     $regex: this.queryStr.keyword,
    //     // case-insensitive
    //     $options: 'i'
    //   }
    // };
    const { keyword } = this.queryStr;
    
    if (keyword) {
      // 'i' - transforma em case-insensitive
      const queryStrRegex = new RegExp(keyword, 'i')
      this.query = this.query.find({ nome: queryStrRegex });
    }
    console.log(this.query)
    return this;
  }
}