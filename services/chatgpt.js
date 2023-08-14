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

/**
 * 
 * @returns 
 */
const completion = async (dataIn = '') => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: dataIn,
    max_tokens: 256,
    temperature: 0,
  });

  return response
}

module.exports = { chat, completion };
