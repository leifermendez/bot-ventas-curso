class ChatWood {
  token = "";
  config = { accounts: 1 };
  api = ``;

  constructor(_token = "", _api = "", _config = {}) {
    this.token = _token;
    this.api = _api;
    this.config = { ...this.config, ..._config };
  }

  buildHeader = () => {
    const header = new Headers();
    header.append("api_access_token", this.token);
    header.append("Content-Type", "application/json");
    return header;
  };

  /**
   *
   * @param dataIn
   * @returns
   */
  getInbox = async () => {
    const requestOptions = {
      method: "GET",
      headers: this.buildHeader(),
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/inboxes`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data.payload;
  };

  /**
   *
   * @returns
   */
  searchByNumber = async (phone) => {
    const requestOptions = {
      method: "GET",
      headers: this.buildHeader(),
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/contacts/search?include_contact_inboxes=false&page=1&sort=-last_activity_at&q=${phone}`,
      requestOptions
    );
    const data = await dataAPI.json();
    console.log(data.payload)
    return data.payload;
  };

  /**
   *
   * @param dataIn
   * @returns
   */
  createInbox = async (dataIn) => {
    const payload = {
      name: "BOTWS",
      channel: {
        type: "api",
        webhook_url: "",
      },
    };
    const raw = JSON.stringify({ ...payload, ...dataIn });

    const requestOptions = {
      method: "POST",
      headers: this.buildHeader(),
      body: raw,
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/inboxes`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data;
  };

  /**
   *
   * @param dataIn
   * @returns
   */
  createContact = async (dataIn) => {
    const payload = {
      phone_number: dataIn.phone_number,
      custom_attributes: { phone_number: dataIn.phone_number },
    };
    const raw = JSON.stringify({ ...payload, ...dataIn });

    const requestOptions = {
      method: "POST",
      headers: this.buildHeader(),
      body: raw,
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/contacts`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data;
  };

  /**
   *
   * @returns
   */
  getConversations = async () => {
    const requestOptions = {
      method: "GET",
      headers: this.buildHeader(),
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/inboxes`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data.payload;
  };
  /**
   *
   * @param dataIn
   * @returns
   */
  createConversation = async (dataIn) => {
    const payload = {
      custom_attributes: { phone_number: dataIn.phone_number },
    };
    const raw = JSON.stringify({ ...dataIn, ...payload });

    const requestOptions = {
      method: "POST",
      headers: this.buildHeader(),
      body: raw,
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/conversations`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data;
  };
  /**
   *
   * @param dataIn
   * @returns
   */
  filterConversation = async (dataIn) => {
    const payload = [
      {
        attribute_key: "phone_number",
        attribute_model: "standard",
        filter_operator: "equal_to",
        values: [dataIn.phone_number],
        custom_attribute_type: "",
      },
    ];
    const raw = JSON.stringify({payload});

    const requestOptions = {
      method: "POST",
      headers: this.buildHeader(),
      body: raw,
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/conversations/filter`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data;
  };

  /**
   *
   * @param msg
   * @param mode
   * @returns
   */
  createMessage = async (dataIn) => {

    const raw = JSON.stringify({
      content: dataIn.msg,
      message_type: dataIn.mode,
      private: true,
    });

    const requestOptions = {
      method: "POST",
      headers: this.buildHeader(),
      body: raw,
    };

    const dataAPI = await fetch(
      `${this.api}/api/v1/accounts/${this.config.accounts}/conversations/${dataIn.conversationId}/messages`,
      requestOptions
    );
    const data = await dataAPI.json();
    return data;
  };
}

module.exports = ChatWood