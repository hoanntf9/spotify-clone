const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

const contentTypes = {
  "Content-Type": "application/json",
};

class HttpRequest {
  constructor() {
    this.baseUrl = "https://spotify.f8team.dev/api";
  }

  async _send(path, method, data, options = {}) {
    try {
      const _option = {
        ...options,
        method,
        headers: {
          ...options.headers,
          ...contentTypes,
        },
      };

      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        method,
        headers: {
          ...options.headers,
          contentTypes,
        },
      });

      if (data) {
        _option.body = JSON.stringify(data);
      }

      if (!res.ok) throw new Error(`HTTP error: `, res.status);
      const response = await res.json();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async get(path, options) {
    return await this._send(path, METHODS.GET, null, options);
  }

  async post(path, options) {
    return await this._send(path, METHODS.POST, data, options);
  }

  async put(path, data, options) {
    return await this._send(path, METHODS.PUT, data, options);
  }

  async patch(path, data, options) {
    return await this._send(path, METHODS.PATCH, data, options);
  }

  async del(path, options) {
    return await this._send(path, METHODS.DELETE, null, options);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
