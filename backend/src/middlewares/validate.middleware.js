// Validate middleware placeholder (Zod)
// Implementation intentionally omitted per user request
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json(err.errors);
  }
};