import PollSchema from "./model.js";

const createPoll = async ({ question, options }) => {
  const details = await PollSchema.create({ question, options });
  return details;
};

const getPoll = async (id) => {
  const findid = await PollSchema.findById(id);
  return findid;
};
const votePoll = async (pollid, optionId) => {
  const poll = await PollSchema.findById(pollid);
  if (!poll) {
    return null;
  }

  const option = poll.optionSchema.id(optionId);
  if (!option) {
    return null;
  }
  option.vote += 1;
  await poll.save();
  return poll;
};
export  {getPoll, createPoll, votePoll};
