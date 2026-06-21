
module.exports = (schema)=> {
    return (req, res, next)=> {
        const {error, value} = schema.validate(req.body)

        if(error) {
            console.log(error)
        }
        req.body = value
        next()
    }
    

}