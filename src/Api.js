class Api {
  constructor({ baseUrl, supplierId }) {
    this._baseUrl = baseUrl;
    this._supplierId = supplierId;
    this._headers = {
      'Content-Type': 'application/json',
    };
  }
  async _handleResponse(res) {
    const result = await res.json();
    return res.ok ? result : Promise.reject(result);
  }

  getCards() {
    return fetch(`${this._baseUrl}/get_supplier_cards?supplier_id=${this._supplierId}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._handleResponse);
  }
  getCardsDetail(arr) {
    return fetch(`${this._baseUrl}/cards_detail`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        nm_ids: arr,
      }),
    }).then(this._handleResponse);
  }
  getCardsPhoto(arr) {
    return fetch(`${this._baseUrl}/cards_photo`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        nm_ids: arr,
      }),
    }).then(this._handleResponse);
  }
}

export default new Api({
  baseUrl: 'http://80.78.246.144:8888',
  supplierId: '31460',
});
