import ApiError from "../../common/utils/api-errors.js";
import ApiResponse from "../../common/utils/api-res.js";
// import createPoll from "./services.js";
import { getPoll, createPoll } from "./services.js";

const createPollController = async (req, res, next) => {
  try {
    const body = await createPoll(req.body);
    if (body) {
      return res.json(ApiResponse.ok("data sent🙂"));
    }
    // return res.json(ApiResponse.ok("data sent"));
  } catch (err) {
    console.log(err);
    throw ApiError.badReq("something went wrong");
  }
  next();
};

const getPollController = async (req, res, next) => {
  const pollid = await getPoll(req.params.id);
  if (!pollid) {
    res.send("pollid id not received");
  }
  
  return res.json(ApiResponse.ok("success"));

  next();
};

export { createPollController, getPollController };
