
const AppError = require("./AppErrors")
class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // filtration query
 const queryObj = {...this.queryString}
 const excludes = ["limit", "page", "sort", "fields", "keyword" ];
excludes.forEach((feilds)=> delete queryObj[feilds] )
let queryString = JSON.stringify(queryObj)
queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

const finalQuery = JSON.parse(queryString)
this.mongooseQuery = this.mongooseQuery.find(finalQuery) 
return this
  }

  sort(){
    if(this.queryString.sort) {
      
      // if(Array.isArray(this.queryString.sort)){
      //   throw new AppError("Duplicate sort parameter is not allowed", 400);
      // }
      const sortQuery = this.queryString.sort.split(",").join(" ")
      
      this.mongooseQuery = this.mongooseQuery.sort(sortQuery)
     } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
     }
     return this
  }

  fields(){
    if(this.queryString.fields) {
      const fieldsQuery = this.queryString.fields.split(",").join(" ")
      this.mongooseQuery = this.mongooseQuery.select(fieldsQuery)
     }else{
      this.mongooseQuery = this.mongooseQuery.select("-__v")
     }
     return this
  }

  search(){
    if(this.queryString.keyword) {
      const queryKeyword = {}
      queryKeyword.$or = [
      {title: {$regex: this.queryString.keyword, $options: "i"}},
      {description: {$regex: this.queryString.keyword, $options: "i"}}
      ]
      this.mongooseQuery = this.mongooseQuery.find(queryKeyword)
    }
    return this
  }

  paginate(countDucoment){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit

    const pagination = {}
  
    pagination.currentPage = page
    pagination.limit = limit
    pagination.pageOfCount =  Math.ceil(countDucoment / limit) 
    if(endIndex < countDucoment){
      pagination.next = page + 1
    }
    if(skip > 0){
      pagination.prev = page - 1
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
    this.ResultPagination = pagination
   return this 
  }

}

module.exports = ApiFeature

