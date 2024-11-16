import Joi from "joi";
import { contactModel } from "../models/contact.model.js";

export const contactController = {
  addContact: async (req, res, next) => {
    const contactSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      message: Joi.string().required(),
    });

    const { error } = contactSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      const { name, email, message } = req.body;

      const contact = await contactModel.create({
        name,
        email,
        message,
      });

      return res.status(200).json({
        success: true,
        message: "Your Submission is Successful, wait for reply",
        contact
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong" + error.message,
      });
    }
  },
};
