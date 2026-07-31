import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        minlength: 1,
        maxlength:100,
        trim: true,
        required:[true, 'options...']
    },
    vote:{
        type: Number,
        default: 0,
    }
}, {_id: true})

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      minlength: 6,
      maxlength: 40,
      required: [true, "Question..."],
    },
   options:{
    type: [optionSchema],
    validate:{
        validator: (arr)=> arr.length>=2,
        message:'poll atleast need two '
    }
   }
  },
  { timestamps: true },
);

export default mongoose.model("PollSchema", pollSchema);
