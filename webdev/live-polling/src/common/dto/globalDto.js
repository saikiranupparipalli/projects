import Joi from "joi";

function globalDto() {
  const schema = Joi.object({});

  const validate = (data) => {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return { errors, value: null };
    }
    return { error: null, value };
  };
}

export default globalDto;
