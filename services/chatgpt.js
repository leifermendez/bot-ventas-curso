const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

/**
 *
 * @param {*} text
 */
const chat = async (text) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu eres un vendedor amable que saluda al cliente, con frases cortas pero carismatico" },
        { role: "user", content: text },
      ],
    });
    return completion.data.choices[0].message;
  } catch (err) {
    console.log(err.response.data);
    return "ERROR";
  }
};

module.exports = { chat };
