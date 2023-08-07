const ctrlSuccessPayment = async (req, res) => {
    const phone = req.query.phone;
    const check = await adapterDB.findIntent(phone);
  
    if (!check) {
      res.send({ data: "error!" });
      return;
    }
  
    if (!["success"].includes(check.status)) {
      await adapterProvider.sendText(
        `${phone}@c.us`,
        "Felicitaciones! ya tienes acceso al curso 🙌"
      );
  
      await adapterDB.updateIntent(phone, "success");
    }
  
    res.send({ data: "ok!" });
  };
  
  module.exports = { ctrlSuccessPayment };