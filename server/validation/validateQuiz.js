const Joi = require("joi");

const quizSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
    language: Joi.string()
    .valid("cpp", "python", "javascript")
    .required(),
    isFinal: Joi.boolean().default(false),
  questions: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().min(1).required(),
        options: Joi.array()
          .items(Joi.string().min(1))
          .min(2)
          .max(7)
          .required(),
        correctAnswerIndex: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

const validateQuiz = (req, res, next) => {
  const { error } = quizSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((err) => err.message) });
  }
  next();
};

module.exports = validateQuiz;
