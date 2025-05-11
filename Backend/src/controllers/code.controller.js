import { executeCode } from "../services/code.service.js";

export async function executeCodeController(req, res) {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        status: "error",
        message: "Code and language are required",
      });
    }

    const output = await executeCode(code, language);
    res.status(200).json({
      status: "success",
      data: { output },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
