/**
 * Lista de agentes
 * @param {*} flows
 * @returns
 */
const employees = async (flows, adapterDB) => {
  let listAgents = await adapterDB.getAgents();
  listAgents = listAgents.map((agent) => {
    agent.flow = flows[parseInt(agent.flows)];
    return agent;
  });
  console.log(listAgents)
  return listAgents;
};

module.exports = { employees };
