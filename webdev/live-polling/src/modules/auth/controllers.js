import ApiError from "../../common/utils/api-errors.js";
import ApiResponse from "../../common/utils/api-res.js";
import createPoll from "./services.js";

const createPollController = async (req, res, next) => {
  try {
    const body = await createPoll(req.body);
    if (body) {
       return res.json(ApiResponse.ok('data sent🙂'))
   
    }
    // return res.json(ApiResponse.ok("data sent"));
  } catch (err) {
    console.log(err);
       throw ApiError.badReq("something went wrong");
  }
  next();
};

export default createPollController;
