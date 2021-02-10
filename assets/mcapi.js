(function () {
  'use strict';
  var SyfaroAPI, MinecraftAPI, baseURL;
  baseURL = 'https://mcapi.us';
  SyfaroAPI = (function () {
    function SyfaroAPI() { }
    SyfaroAPI.prototype.queryString = function (params) {
      var str, p;
      str = [];
      for (p in params) {
        if (params[p] === undefined) {
          continue;
        }
        if (params.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
        }
      }
      return '?' + str.join('&');
    };
    SyfaroAPI.prototype.loadJSON = function (endpoint, params, callback) {
      var xhr, url;
      if (typeof (params) === 'function') {
        callback = params;
        params = {};
      }
      params = this.queryString(params);
      url = baseURL + endpoint + params;
      xhr = new XMLHttpRequest();
      xhr.onerror = function () {
        callback(true);
      };
      xhr.onload = function () {
        var data;
        try {
          data = JSON.parse(xhr.responseText);
        } catch (e) {
          return callback(e);
        }
        if (data.status === 'error') {
          return callback(data.error);
        }
        callback(undefined, data);
      };
      xhr.open('GET', url, true);
      xhr.send();
    };
    return SyfaroAPI;
  }());
  MinecraftAPI = (function () {
    var api;
    function MinecraftAPI() { }
    api = new SyfaroAPI();
    MinecraftAPI.prototype.getServerStatus = function (ip, options, callback) {
      if (typeof (options) === 'function') {
        callback = options;
        options = {};
      }
      options['ip'] = ip;
      api.loadJSON('/server/status', options, callback);
    };
    MinecraftAPI.prototype['getServerStatus'] = MinecraftAPI.prototype.getServerStatus;
    MinecraftAPI.prototype.getServerQuery = function (ip, options, callback) {
      if (typeof (options) === 'function') {
        callback = options;
        options = {};
      }
      options['ip'] = ip;
      api.loadJSON('/server/query', options, callback);
    };
    MinecraftAPI.prototype['getServerQuery'] = MinecraftAPI.prototype.getServerQuery;
    return MinecraftAPI;
  }());
  window['MinecraftAPI'] = new MinecraftAPI();
}());
