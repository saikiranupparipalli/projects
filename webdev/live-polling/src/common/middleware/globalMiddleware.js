 
import ApiError from "../utils/api-errors.js";
function validate(data) {
  return (req, res, next) => {
    const { error, value } = data.validate(req.body);

    if (error) {
      throw new ApiError.badReq('INCORRECT- user details')
    }
    req.body = value;
    next()
  };
}

export default validate