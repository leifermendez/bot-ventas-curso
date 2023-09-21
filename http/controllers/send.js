const ctrlSend = async (req, res) => {
  const adapterProvider = req.ws;
  const body = req.body
  const message = body.content
  const phone = body.conversation.meta.sender.phone_number.replace('+','')

  if(body.message_type !== 'outgoin'){
    res.send({a:1})
    return
  }

  await adapterProvider.sendText(
    `${phone}@c.us`,message);
  console.log({phone, message})
  res.send({phone, message})
};

module.exports = { ctrlSend };
