const { decryptData } = require("../../utils/hash");
const { exchange, register } = require("../services/e-learning");

const COURSE_ID = process.env.COURSE_ID ?? "";

const ctrlCallBack = async (req, res) => {
  const payload = req.query.p;
  const adapterDB = req.db;
  const adapterProvider = req.ws;

  if (!payload) {
    res.send({ data: "Ups algo paso con pago intenta de nuevo!" });
    return;
  }

  const data = decryptData(payload);
  const [phone, status, email] = data.split("__") ?? [
    undefined,
    undefined,
    undefined,
  ];

  const check = await adapterDB.findIntent(phone);

  if (!check) {
    res.send({ data: "no exite registro de intencion de pago!" });
    return;
  }

  if (["success", "fail"].includes(check.status)) {
    res.send({ data: "Vuelve a intentar con el link de pago" });
    return;
  }

  if (status === "success") {
    await adapterProvider.sendText(
      `${phone}@c.us`,
      [
        "Felicitaciones! ya tienes acceso al curso 🙌",
        "un mail te llegara en los proximos minutos",
        "Si tienes algun inconveniente puedes escribirme un mail a leifer.contacto@gmail.com",
      ].join("\n")
    );
    const code = await exchange(COURSE_ID, email);
    console.log(`Registando usuario:${email}`)
    if (code === 404) {
      const tmpUser = await register(email);
      console.log(`Registando usuario otra vez:${email}`,tmpUser)
      const tmp = await exchange(COURSE_ID, email);
      console.log(`¿Se libero?:`,tmp)
    }
    res.redirect("https://app.codigoencasa.com/courses/curso-chatbot-whatsapp");
  }

  if (status === "fail") {
    await adapterProvider.sendText(`${phone}@c.us`, [
      "Algo opcurrio con tu pago. Intenta nuevamente 🤕",
      "Si tienes algun inconveniente puedes escribirme un mail a leifer.contacto@gmail.com",
    ].join("\n"));
    res.send({ data: "Algo opcurrio con tu pago. Intenta nuevamente 🤕" });
  }

  await adapterDB.updateIntent(phone, status);
};

module.exports = { ctrlCallBack };
