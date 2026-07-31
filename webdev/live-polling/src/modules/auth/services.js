import PollSchema from "./model.js";

const createPoll = async ({question, options}) => {
  const details = await PollSchema.create({question, options});
  return details;
};

export default createPoll;
