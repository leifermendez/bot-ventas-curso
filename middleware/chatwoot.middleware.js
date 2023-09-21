module.exports = async (ctx, options) => {
    const globalState = options.globalState.getMyState();
    const inboxId = globalState.inbox_id;
    const chatwood = options.extensions.chatwood;
    const checkIsSave = (await chatwood.searchByNumber(`${ctx.from}`));
    const name = ctx?.pushName ?? ctx.ProfileName.split(" ").shift();
    if (!checkIsSave.length) {
        const contactSave = await chatwood.createContact({
          phone_number: `+${ctx.from}`,
          name: name,
        });
        await options.state.update({
          chat_wood_id: contactSave.payload.contact.id ?? checkIsSave[0].id,
        });
      } else {
        await options.state.update({ chat_wood_id: checkIsSave[0].id });
      }
      const currentState = options.state.getMyState();

      const filterConversation = await chatwood.filterConversation({
        phone_number: ctx.from,
      });
  
      await options.state.update({
        conversation_id: filterConversation.payload.length ? filterConversation.payload[0].id : 0,
      });

      if (!filterConversation.payload.length) {
        const conversation = await chatwood.createConversation({
          inbox_id: inboxId,
          contact_id: currentState.chat_wood_id,
          phone_number: ctx.from,
        });
        
        await options.state.update({ conversation_id: conversation.id });
      }
        //Si tienes asignado agente no continua
      if (filterConversation.payload.length && filterConversation.payload[0].meta) {
        const assignee = filterConversation.payload[0].meta?.assignee
        if (assignee) return await options.endFlow()
      }
}