(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js
  var require_action_cable = __commonJS({
    "node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActionCable = {});
      })(exports, function(exports2) {
        "use strict";
        var adapters = {
          logger: self.console,
          WebSocket: self.WebSocket
        };
        var logger = {
          log: function log() {
            if (this.enabled) {
              var _adapters$logger;
              for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                messages[_key] = arguments[_key];
              }
              messages.push(Date.now());
              (_adapters$logger = adapters.logger).log.apply(_adapters$logger, ["[ActionCable]"].concat(messages));
            }
          }
        };
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps)
              defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var now = function now2() {
          return new Date().getTime();
        };
        var secondsSince = function secondsSince2(time) {
          return (now() - time) / 1e3;
        };
        var clamp = function clamp2(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };
        var ConnectionMonitor = function() {
          function ConnectionMonitor2(connection) {
            classCallCheck(this, ConnectionMonitor2);
            this.visibilityDidChange = this.visibilityDidChange.bind(this);
            this.connection = connection;
            this.reconnectAttempts = 0;
          }
          ConnectionMonitor2.prototype.start = function start3() {
            if (!this.isRunning()) {
              this.startedAt = now();
              delete this.stoppedAt;
              this.startPolling();
              addEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
            }
          };
          ConnectionMonitor2.prototype.stop = function stop() {
            if (this.isRunning()) {
              this.stoppedAt = now();
              this.stopPolling();
              removeEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor stopped");
            }
          };
          ConnectionMonitor2.prototype.isRunning = function isRunning() {
            return this.startedAt && !this.stoppedAt;
          };
          ConnectionMonitor2.prototype.recordPing = function recordPing() {
            this.pingedAt = now();
          };
          ConnectionMonitor2.prototype.recordConnect = function recordConnect() {
            this.reconnectAttempts = 0;
            this.recordPing();
            delete this.disconnectedAt;
            logger.log("ConnectionMonitor recorded connect");
          };
          ConnectionMonitor2.prototype.recordDisconnect = function recordDisconnect() {
            this.disconnectedAt = now();
            logger.log("ConnectionMonitor recorded disconnect");
          };
          ConnectionMonitor2.prototype.startPolling = function startPolling() {
            this.stopPolling();
            this.poll();
          };
          ConnectionMonitor2.prototype.stopPolling = function stopPolling() {
            clearTimeout(this.pollTimeout);
          };
          ConnectionMonitor2.prototype.poll = function poll() {
            var _this = this;
            this.pollTimeout = setTimeout(function() {
              _this.reconnectIfStale();
              _this.poll();
            }, this.getPollInterval());
          };
          ConnectionMonitor2.prototype.getPollInterval = function getPollInterval() {
            var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
            var interval = multiplier * Math.log(this.reconnectAttempts + 1);
            return Math.round(clamp(interval, min, max) * 1e3);
          };
          ConnectionMonitor2.prototype.reconnectIfStale = function reconnectIfStale() {
            if (this.connectionIsStale()) {
              logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
              this.reconnectAttempts++;
              if (this.disconnectedRecently()) {
                logger.log("ConnectionMonitor skipping reopening recent disconnect");
              } else {
                logger.log("ConnectionMonitor reopening");
                this.connection.reopen();
              }
            }
          };
          ConnectionMonitor2.prototype.connectionIsStale = function connectionIsStale() {
            return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
          };
          ConnectionMonitor2.prototype.disconnectedRecently = function disconnectedRecently() {
            return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
          };
          ConnectionMonitor2.prototype.visibilityDidChange = function visibilityDidChange() {
            var _this2 = this;
            if (document.visibilityState === "visible") {
              setTimeout(function() {
                if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
                  logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
                  _this2.connection.reopen();
                }
              }, 200);
            }
          };
          return ConnectionMonitor2;
        }();
        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30,
          multiplier: 5
        };
        ConnectionMonitor.staleThreshold = 6;
        var INTERNAL = {
          message_types: {
            welcome: "welcome",
            disconnect: "disconnect",
            ping: "ping",
            confirmation: "confirm_subscription",
            rejection: "reject_subscription"
          },
          disconnect_reasons: {
            unauthorized: "unauthorized",
            invalid_request: "invalid_request",
            server_restart: "server_restart"
          },
          default_mount_path: "/cable",
          protocols: ["actioncable-v1-json", "actioncable-unsupported"]
        };
        var message_types = INTERNAL.message_types, protocols = INTERNAL.protocols;
        var supportedProtocols = protocols.slice(0, protocols.length - 1);
        var indexOf = [].indexOf;
        var Connection = function() {
          function Connection2(consumer4) {
            classCallCheck(this, Connection2);
            this.open = this.open.bind(this);
            this.consumer = consumer4;
            this.subscriptions = this.consumer.subscriptions;
            this.monitor = new ConnectionMonitor(this);
            this.disconnected = true;
          }
          Connection2.prototype.send = function send(data) {
            if (this.isOpen()) {
              this.webSocket.send(JSON.stringify(data));
              return true;
            } else {
              return false;
            }
          };
          Connection2.prototype.open = function open() {
            if (this.isActive()) {
              logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
              return false;
            } else {
              logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols);
              if (this.webSocket) {
                this.uninstallEventHandlers();
              }
              this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
              this.installEventHandlers();
              this.monitor.start();
              return true;
            }
          };
          Connection2.prototype.close = function close() {
            var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
              allowReconnect: true
            }, allowReconnect = _ref.allowReconnect;
            if (!allowReconnect) {
              this.monitor.stop();
            }
            if (this.isActive()) {
              return this.webSocket.close();
            }
          };
          Connection2.prototype.reopen = function reopen() {
            logger.log("Reopening WebSocket, current state is " + this.getState());
            if (this.isActive()) {
              try {
                return this.close();
              } catch (error4) {
                logger.log("Failed to reopen WebSocket", error4);
              } finally {
                logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
                setTimeout(this.open, this.constructor.reopenDelay);
              }
            } else {
              return this.open();
            }
          };
          Connection2.prototype.getProtocol = function getProtocol() {
            if (this.webSocket) {
              return this.webSocket.protocol;
            }
          };
          Connection2.prototype.isOpen = function isOpen() {
            return this.isState("open");
          };
          Connection2.prototype.isActive = function isActive() {
            return this.isState("open", "connecting");
          };
          Connection2.prototype.isProtocolSupported = function isProtocolSupported() {
            return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
          };
          Connection2.prototype.isState = function isState() {
            for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
              states[_key] = arguments[_key];
            }
            return indexOf.call(states, this.getState()) >= 0;
          };
          Connection2.prototype.getState = function getState() {
            if (this.webSocket) {
              for (var state in adapters.WebSocket) {
                if (adapters.WebSocket[state] === this.webSocket.readyState) {
                  return state.toLowerCase();
                }
              }
            }
            return null;
          };
          Connection2.prototype.installEventHandlers = function installEventHandlers() {
            for (var eventName in this.events) {
              var handler = this.events[eventName].bind(this);
              this.webSocket["on" + eventName] = handler;
            }
          };
          Connection2.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
            for (var eventName in this.events) {
              this.webSocket["on" + eventName] = function() {
              };
            }
          };
          return Connection2;
        }();
        Connection.reopenDelay = 500;
        Connection.prototype.events = {
          message: function message(event) {
            if (!this.isProtocolSupported()) {
              return;
            }
            var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message2 = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.disconnect:
                logger.log("Disconnecting. Reason: " + reason);
                return this.close({
                  allowReconnect: reconnect
                });
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                this.subscriptions.confirmSubscription(identifier);
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message2);
            }
          },
          open: function open() {
            logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function close(event) {
            logger.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function error4() {
            logger.log("WebSocket onerror event");
          }
        };
        var extend2 = function extend3(object, properties) {
          if (properties != null) {
            for (var key in properties) {
              var value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };
        var Subscription = function() {
          function Subscription2(consumer4) {
            var params2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var mixin = arguments[2];
            classCallCheck(this, Subscription2);
            this.consumer = consumer4;
            this.identifier = JSON.stringify(params2);
            extend2(this, mixin);
          }
          Subscription2.prototype.perform = function perform2(action) {
            var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            data.action = action;
            return this.send(data);
          };
          Subscription2.prototype.send = function send(data) {
            return this.consumer.send({
              command: "message",
              identifier: this.identifier,
              data: JSON.stringify(data)
            });
          };
          Subscription2.prototype.unsubscribe = function unsubscribe() {
            return this.consumer.subscriptions.remove(this);
          };
          return Subscription2;
        }();
        var SubscriptionGuarantor = function() {
          function SubscriptionGuarantor2(subscriptions) {
            classCallCheck(this, SubscriptionGuarantor2);
            this.subscriptions = subscriptions;
            this.pendingSubscriptions = [];
          }
          SubscriptionGuarantor2.prototype.guarantee = function guarantee(subscription) {
            if (this.pendingSubscriptions.indexOf(subscription) == -1) {
              logger.log("SubscriptionGuarantor guaranteeing " + subscription.identifier);
              this.pendingSubscriptions.push(subscription);
            } else {
              logger.log("SubscriptionGuarantor already guaranteeing " + subscription.identifier);
            }
            this.startGuaranteeing();
          };
          SubscriptionGuarantor2.prototype.forget = function forget(subscription) {
            logger.log("SubscriptionGuarantor forgetting " + subscription.identifier);
            this.pendingSubscriptions = this.pendingSubscriptions.filter(function(s) {
              return s !== subscription;
            });
          };
          SubscriptionGuarantor2.prototype.startGuaranteeing = function startGuaranteeing() {
            this.stopGuaranteeing();
            this.retrySubscribing();
          };
          SubscriptionGuarantor2.prototype.stopGuaranteeing = function stopGuaranteeing() {
            clearTimeout(this.retryTimeout);
          };
          SubscriptionGuarantor2.prototype.retrySubscribing = function retrySubscribing() {
            var _this = this;
            this.retryTimeout = setTimeout(function() {
              if (_this.subscriptions && typeof _this.subscriptions.subscribe === "function") {
                _this.pendingSubscriptions.map(function(subscription) {
                  logger.log("SubscriptionGuarantor resubscribing " + subscription.identifier);
                  _this.subscriptions.subscribe(subscription);
                });
              }
            }, 500);
          };
          return SubscriptionGuarantor2;
        }();
        var Subscriptions = function() {
          function Subscriptions2(consumer4) {
            classCallCheck(this, Subscriptions2);
            this.consumer = consumer4;
            this.guarantor = new SubscriptionGuarantor(this);
            this.subscriptions = [];
          }
          Subscriptions2.prototype.create = function create(channelName, mixin) {
            var channel = channelName;
            var params2 = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
              channel
            };
            var subscription = new Subscription(this.consumer, params2, mixin);
            return this.add(subscription);
          };
          Subscriptions2.prototype.add = function add3(subscription) {
            this.subscriptions.push(subscription);
            this.consumer.ensureActiveConnection();
            this.notify(subscription, "initialized");
            this.subscribe(subscription);
            return subscription;
          };
          Subscriptions2.prototype.remove = function remove(subscription) {
            this.forget(subscription);
            if (!this.findAll(subscription.identifier).length) {
              this.sendCommand(subscription, "unsubscribe");
            }
            return subscription;
          };
          Subscriptions2.prototype.reject = function reject(identifier) {
            var _this = this;
            return this.findAll(identifier).map(function(subscription) {
              _this.forget(subscription);
              _this.notify(subscription, "rejected");
              return subscription;
            });
          };
          Subscriptions2.prototype.forget = function forget(subscription) {
            this.guarantor.forget(subscription);
            this.subscriptions = this.subscriptions.filter(function(s) {
              return s !== subscription;
            });
            return subscription;
          };
          Subscriptions2.prototype.findAll = function findAll(identifier) {
            return this.subscriptions.filter(function(s) {
              return s.identifier === identifier;
            });
          };
          Subscriptions2.prototype.reload = function reload() {
            var _this2 = this;
            return this.subscriptions.map(function(subscription) {
              return _this2.subscribe(subscription);
            });
          };
          Subscriptions2.prototype.notifyAll = function notifyAll(callbackName) {
            var _this3 = this;
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return this.subscriptions.map(function(subscription) {
              return _this3.notify.apply(_this3, [subscription, callbackName].concat(args));
            });
          };
          Subscriptions2.prototype.notify = function notify2(subscription, callbackName) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            var subscriptions = void 0;
            if (typeof subscription === "string") {
              subscriptions = this.findAll(subscription);
            } else {
              subscriptions = [subscription];
            }
            return subscriptions.map(function(subscription2) {
              return typeof subscription2[callbackName] === "function" ? subscription2[callbackName].apply(subscription2, args) : void 0;
            });
          };
          Subscriptions2.prototype.subscribe = function subscribe(subscription) {
            if (this.sendCommand(subscription, "subscribe")) {
              this.guarantor.guarantee(subscription);
            }
          };
          Subscriptions2.prototype.confirmSubscription = function confirmSubscription(identifier) {
            var _this4 = this;
            logger.log("Subscription confirmed " + identifier);
            this.findAll(identifier).map(function(subscription) {
              return _this4.guarantor.forget(subscription);
            });
          };
          Subscriptions2.prototype.sendCommand = function sendCommand(subscription, command) {
            var identifier = subscription.identifier;
            return this.consumer.send({
              command,
              identifier
            });
          };
          return Subscriptions2;
        }();
        var Consumer = function() {
          function Consumer2(url2) {
            classCallCheck(this, Consumer2);
            this._url = url2;
            this.subscriptions = new Subscriptions(this);
            this.connection = new Connection(this);
          }
          Consumer2.prototype.send = function send(data) {
            return this.connection.send(data);
          };
          Consumer2.prototype.connect = function connect() {
            return this.connection.open();
          };
          Consumer2.prototype.disconnect = function disconnect() {
            return this.connection.close({
              allowReconnect: false
            });
          };
          Consumer2.prototype.ensureActiveConnection = function ensureActiveConnection() {
            if (!this.connection.isActive()) {
              return this.connection.open();
            }
          };
          createClass(Consumer2, [{
            key: "url",
            get: function get$$1() {
              return createWebSocketURL(this._url);
            }
          }]);
          return Consumer2;
        }();
        function createWebSocketURL(url2) {
          if (typeof url2 === "function") {
            url2 = url2();
          }
          if (url2 && !/^wss?:/i.test(url2)) {
            var a = document.createElement("a");
            a.href = url2;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url2;
          }
        }
        function createConsumer3() {
          var url2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getConfig("url") || INTERNAL.default_mount_path;
          return new Consumer(url2);
        }
        function getConfig(name) {
          var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          if (element) {
            return element.getAttribute("content");
          }
        }
        exports2.Connection = Connection;
        exports2.ConnectionMonitor = ConnectionMonitor;
        exports2.Consumer = Consumer;
        exports2.INTERNAL = INTERNAL;
        exports2.Subscription = Subscription;
        exports2.Subscriptions = Subscriptions;
        exports2.SubscriptionGuarantor = SubscriptionGuarantor;
        exports2.adapters = adapters;
        exports2.createWebSocketURL = createWebSocketURL;
        exports2.logger = logger;
        exports2.createConsumer = createConsumer3;
        exports2.getConfig = getConfig;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/trix/dist/trix.js
  var require_trix = __commonJS({
    "node_modules/trix/dist/trix.js"(exports, module) {
      (function() {
      }).call(exports), function() {
        var t;
        window.Set == null && (window.Set = t = function() {
          function t2() {
            this.clear();
          }
          return t2.prototype.clear = function() {
            return this.values = [];
          }, t2.prototype.has = function(t3) {
            return this.values.indexOf(t3) !== -1;
          }, t2.prototype.add = function(t3) {
            return this.has(t3) || this.values.push(t3), this;
          }, t2.prototype["delete"] = function(t3) {
            var e;
            return (e = this.values.indexOf(t3)) === -1 ? false : (this.values.splice(e, 1), true);
          }, t2.prototype.forEach = function() {
            var t3;
            return (t3 = this.values).forEach.apply(t3, arguments);
          }, t2;
        }());
      }.call(exports), function(t) {
        function e() {
        }
        function n(t2, e2) {
          return function() {
            t2.apply(e2, arguments);
          };
        }
        function i(t2) {
          if (typeof this != "object")
            throw new TypeError("Promises must be constructed via new");
          if (typeof t2 != "function")
            throw new TypeError("not a function");
          this._state = 0, this._handled = false, this._value = void 0, this._deferreds = [], c(t2, this);
        }
        function o(t2, e2) {
          for (; t2._state === 3; )
            t2 = t2._value;
          return t2._state === 0 ? void t2._deferreds.push(e2) : (t2._handled = true, void h(function() {
            var n2 = t2._state === 1 ? e2.onFulfilled : e2.onRejected;
            if (n2 === null)
              return void (t2._state === 1 ? r : s)(e2.promise, t2._value);
            var i2;
            try {
              i2 = n2(t2._value);
            } catch (o2) {
              return void s(e2.promise, o2);
            }
            r(e2.promise, i2);
          }));
        }
        function r(t2, e2) {
          try {
            if (e2 === t2)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (e2 && (typeof e2 == "object" || typeof e2 == "function")) {
              var o2 = e2.then;
              if (e2 instanceof i)
                return t2._state = 3, t2._value = e2, void a(t2);
              if (typeof o2 == "function")
                return void c(n(o2, e2), t2);
            }
            t2._state = 1, t2._value = e2, a(t2);
          } catch (r2) {
            s(t2, r2);
          }
        }
        function s(t2, e2) {
          t2._state = 2, t2._value = e2, a(t2);
        }
        function a(t2) {
          t2._state === 2 && t2._deferreds.length === 0 && setTimeout(function() {
            t2._handled || p(t2._value);
          }, 1);
          for (var e2 = 0, n2 = t2._deferreds.length; n2 > e2; e2++)
            o(t2, t2._deferreds[e2]);
          t2._deferreds = null;
        }
        function u(t2, e2, n2) {
          this.onFulfilled = typeof t2 == "function" ? t2 : null, this.onRejected = typeof e2 == "function" ? e2 : null, this.promise = n2;
        }
        function c(t2, e2) {
          var n2 = false;
          try {
            t2(function(t3) {
              n2 || (n2 = true, r(e2, t3));
            }, function(t3) {
              n2 || (n2 = true, s(e2, t3));
            });
          } catch (i2) {
            if (n2)
              return;
            n2 = true, s(e2, i2);
          }
        }
        var l = setTimeout, h = typeof setImmediate == "function" && setImmediate || function(t2) {
          l(t2, 1);
        }, p = function(t2) {
          typeof console != "undefined" && console && console.warn("Possible Unhandled Promise Rejection:", t2);
        };
        i.prototype["catch"] = function(t2) {
          return this.then(null, t2);
        }, i.prototype.then = function(t2, n2) {
          var r2 = new i(e);
          return o(this, new u(t2, n2, r2)), r2;
        }, i.all = function(t2) {
          var e2 = Array.prototype.slice.call(t2);
          return new i(function(t3, n2) {
            function i2(r3, s2) {
              try {
                if (s2 && (typeof s2 == "object" || typeof s2 == "function")) {
                  var a2 = s2.then;
                  if (typeof a2 == "function")
                    return void a2.call(s2, function(t4) {
                      i2(r3, t4);
                    }, n2);
                }
                e2[r3] = s2, --o2 === 0 && t3(e2);
              } catch (u2) {
                n2(u2);
              }
            }
            if (e2.length === 0)
              return t3([]);
            for (var o2 = e2.length, r2 = 0; r2 < e2.length; r2++)
              i2(r2, e2[r2]);
          });
        }, i.resolve = function(t2) {
          return t2 && typeof t2 == "object" && t2.constructor === i ? t2 : new i(function(e2) {
            e2(t2);
          });
        }, i.reject = function(t2) {
          return new i(function(e2, n2) {
            n2(t2);
          });
        }, i.race = function(t2) {
          return new i(function(e2, n2) {
            for (var i2 = 0, o2 = t2.length; o2 > i2; i2++)
              t2[i2].then(e2, n2);
          });
        }, i._setImmediateFn = function(t2) {
          h = t2;
        }, i._setUnhandledRejectionFn = function(t2) {
          p = t2;
        }, typeof module != "undefined" && module.exports ? module.exports = i : t.Promise || (t.Promise = i);
      }(exports), function() {
        var t = typeof window.customElements == "object", e = typeof document.registerElement == "function", n = t || e;
        n || (typeof WeakMap == "undefined" && !function() {
          var t2 = Object.defineProperty, e2 = Date.now() % 1e9, n2 = function() {
            this.name = "__st" + (1e9 * Math.random() >>> 0) + (e2++ + "__");
          };
          n2.prototype = { set: function(e3, n3) {
            var i = e3[this.name];
            return i && i[0] === e3 ? i[1] = n3 : t2(e3, this.name, { value: [e3, n3], writable: true }), this;
          }, get: function(t3) {
            var e3;
            return (e3 = t3[this.name]) && e3[0] === t3 ? e3[1] : void 0;
          }, "delete": function(t3) {
            var e3 = t3[this.name];
            return e3 && e3[0] === t3 ? (e3[0] = e3[1] = void 0, true) : false;
          }, has: function(t3) {
            var e3 = t3[this.name];
            return e3 ? e3[0] === t3 : false;
          } }, window.WeakMap = n2;
        }(), function(t2) {
          function e2(t3) {
            A.push(t3), b || (b = true, g(i));
          }
          function n2(t3) {
            return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(t3) || t3;
          }
          function i() {
            b = false;
            var t3 = A;
            A = [], t3.sort(function(t4, e4) {
              return t4.uid_ - e4.uid_;
            });
            var e3 = false;
            t3.forEach(function(t4) {
              var n3 = t4.takeRecords();
              o(t4), n3.length && (t4.callback_(n3, t4), e3 = true);
            }), e3 && i();
          }
          function o(t3) {
            t3.nodes_.forEach(function(e3) {
              var n3 = m.get(e3);
              n3 && n3.forEach(function(e4) {
                e4.observer === t3 && e4.removeTransientObservers();
              });
            });
          }
          function r(t3, e3) {
            for (var n3 = t3; n3; n3 = n3.parentNode) {
              var i2 = m.get(n3);
              if (i2)
                for (var o2 = 0; o2 < i2.length; o2++) {
                  var r2 = i2[o2], s2 = r2.options;
                  if (n3 === t3 || s2.subtree) {
                    var a2 = e3(s2);
                    a2 && r2.enqueue(a2);
                  }
                }
            }
          }
          function s(t3) {
            this.callback_ = t3, this.nodes_ = [], this.records_ = [], this.uid_ = ++C;
          }
          function a(t3, e3) {
            this.type = t3, this.target = e3, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null;
          }
          function u(t3) {
            var e3 = new a(t3.type, t3.target);
            return e3.addedNodes = t3.addedNodes.slice(), e3.removedNodes = t3.removedNodes.slice(), e3.previousSibling = t3.previousSibling, e3.nextSibling = t3.nextSibling, e3.attributeName = t3.attributeName, e3.attributeNamespace = t3.attributeNamespace, e3.oldValue = t3.oldValue, e3;
          }
          function c(t3, e3) {
            return x = new a(t3, e3);
          }
          function l(t3) {
            return w ? w : (w = u(x), w.oldValue = t3, w);
          }
          function h() {
            x = w = void 0;
          }
          function p(t3) {
            return t3 === w || t3 === x;
          }
          function d(t3, e3) {
            return t3 === e3 ? t3 : w && p(t3) ? w : null;
          }
          function f(t3, e3, n3) {
            this.observer = t3, this.target = e3, this.options = n3, this.transientObservedNodes = [];
          }
          if (!t2.JsMutationObserver) {
            var g, m = /* @__PURE__ */ new WeakMap();
            if (/Trident|Edge/.test(navigator.userAgent))
              g = setTimeout;
            else if (window.setImmediate)
              g = window.setImmediate;
            else {
              var v = [], y = String(Math.random());
              window.addEventListener("message", function(t3) {
                if (t3.data === y) {
                  var e3 = v;
                  v = [], e3.forEach(function(t4) {
                    t4();
                  });
                }
              }), g = function(t3) {
                v.push(t3), window.postMessage(y, "*");
              };
            }
            var b = false, A = [], C = 0;
            s.prototype = { observe: function(t3, e3) {
              if (t3 = n2(t3), !e3.childList && !e3.attributes && !e3.characterData || e3.attributeOldValue && !e3.attributes || e3.attributeFilter && e3.attributeFilter.length && !e3.attributes || e3.characterDataOldValue && !e3.characterData)
                throw new SyntaxError();
              var i2 = m.get(t3);
              i2 || m.set(t3, i2 = []);
              for (var o2, r2 = 0; r2 < i2.length; r2++)
                if (i2[r2].observer === this) {
                  o2 = i2[r2], o2.removeListeners(), o2.options = e3;
                  break;
                }
              o2 || (o2 = new f(this, t3, e3), i2.push(o2), this.nodes_.push(t3)), o2.addListeners();
            }, disconnect: function() {
              this.nodes_.forEach(function(t3) {
                for (var e3 = m.get(t3), n3 = 0; n3 < e3.length; n3++) {
                  var i2 = e3[n3];
                  if (i2.observer === this) {
                    i2.removeListeners(), e3.splice(n3, 1);
                    break;
                  }
                }
              }, this), this.records_ = [];
            }, takeRecords: function() {
              var t3 = this.records_;
              return this.records_ = [], t3;
            } };
            var x, w;
            f.prototype = { enqueue: function(t3) {
              var n3 = this.observer.records_, i2 = n3.length;
              if (n3.length > 0) {
                var o2 = n3[i2 - 1], r2 = d(o2, t3);
                if (r2)
                  return void (n3[i2 - 1] = r2);
              } else
                e2(this.observer);
              n3[i2] = t3;
            }, addListeners: function() {
              this.addListeners_(this.target);
            }, addListeners_: function(t3) {
              var e3 = this.options;
              e3.attributes && t3.addEventListener("DOMAttrModified", this, true), e3.characterData && t3.addEventListener("DOMCharacterDataModified", this, true), e3.childList && t3.addEventListener("DOMNodeInserted", this, true), (e3.childList || e3.subtree) && t3.addEventListener("DOMNodeRemoved", this, true);
            }, removeListeners: function() {
              this.removeListeners_(this.target);
            }, removeListeners_: function(t3) {
              var e3 = this.options;
              e3.attributes && t3.removeEventListener("DOMAttrModified", this, true), e3.characterData && t3.removeEventListener("DOMCharacterDataModified", this, true), e3.childList && t3.removeEventListener("DOMNodeInserted", this, true), (e3.childList || e3.subtree) && t3.removeEventListener("DOMNodeRemoved", this, true);
            }, addTransientObserver: function(t3) {
              if (t3 !== this.target) {
                this.addListeners_(t3), this.transientObservedNodes.push(t3);
                var e3 = m.get(t3);
                e3 || m.set(t3, e3 = []), e3.push(this);
              }
            }, removeTransientObservers: function() {
              var t3 = this.transientObservedNodes;
              this.transientObservedNodes = [], t3.forEach(function(t4) {
                this.removeListeners_(t4);
                for (var e3 = m.get(t4), n3 = 0; n3 < e3.length; n3++)
                  if (e3[n3] === this) {
                    e3.splice(n3, 1);
                    break;
                  }
              }, this);
            }, handleEvent: function(t3) {
              switch (t3.stopImmediatePropagation(), t3.type) {
                case "DOMAttrModified":
                  var e3 = t3.attrName, n3 = t3.relatedNode.namespaceURI, i2 = t3.target, o2 = new c("attributes", i2);
                  o2.attributeName = e3, o2.attributeNamespace = n3;
                  var s2 = t3.attrChange === MutationEvent.ADDITION ? null : t3.prevValue;
                  r(i2, function(t4) {
                    return !t4.attributes || t4.attributeFilter && t4.attributeFilter.length && t4.attributeFilter.indexOf(e3) === -1 && t4.attributeFilter.indexOf(n3) === -1 ? void 0 : t4.attributeOldValue ? l(s2) : o2;
                  });
                  break;
                case "DOMCharacterDataModified":
                  var i2 = t3.target, o2 = c("characterData", i2), s2 = t3.prevValue;
                  r(i2, function(t4) {
                    return t4.characterData ? t4.characterDataOldValue ? l(s2) : o2 : void 0;
                  });
                  break;
                case "DOMNodeRemoved":
                  this.addTransientObserver(t3.target);
                case "DOMNodeInserted":
                  var a2, u2, p2 = t3.target;
                  t3.type === "DOMNodeInserted" ? (a2 = [p2], u2 = []) : (a2 = [], u2 = [p2]);
                  var d2 = p2.previousSibling, f2 = p2.nextSibling, o2 = c("childList", t3.target.parentNode);
                  o2.addedNodes = a2, o2.removedNodes = u2, o2.previousSibling = d2, o2.nextSibling = f2, r(t3.relatedNode, function(t4) {
                    return t4.childList ? o2 : void 0;
                  });
              }
              h();
            } }, t2.JsMutationObserver = s, t2.MutationObserver || (t2.MutationObserver = s, s._isPolyfilled = true);
          }
        }(self), function() {
          "use strict";
          if (!window.performance || !window.performance.now) {
            var t2 = Date.now();
            window.performance = { now: function() {
              return Date.now() - t2;
            } };
          }
          window.requestAnimationFrame || (window.requestAnimationFrame = function() {
            var t3 = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            return t3 ? function(e3) {
              return t3(function() {
                e3(performance.now());
              });
            } : function(t4) {
              return window.setTimeout(t4, 1e3 / 60);
            };
          }()), window.cancelAnimationFrame || (window.cancelAnimationFrame = function() {
            return window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(t3) {
              clearTimeout(t3);
            };
          }());
          var e2 = function() {
            var t3 = document.createEvent("Event");
            return t3.initEvent("foo", true, true), t3.preventDefault(), t3.defaultPrevented;
          }();
          if (!e2) {
            var n2 = Event.prototype.preventDefault;
            Event.prototype.preventDefault = function() {
              this.cancelable && (n2.call(this), Object.defineProperty(this, "defaultPrevented", { get: function() {
                return true;
              }, configurable: true }));
            };
          }
          var i = /Trident/.test(navigator.userAgent);
          if ((!window.CustomEvent || i && typeof window.CustomEvent != "function") && (window.CustomEvent = function(t3, e3) {
            e3 = e3 || {};
            var n3 = document.createEvent("CustomEvent");
            return n3.initCustomEvent(t3, Boolean(e3.bubbles), Boolean(e3.cancelable), e3.detail), n3;
          }, window.CustomEvent.prototype = window.Event.prototype), !window.Event || i && typeof window.Event != "function") {
            var o = window.Event;
            window.Event = function(t3, e3) {
              e3 = e3 || {};
              var n3 = document.createEvent("Event");
              return n3.initEvent(t3, Boolean(e3.bubbles), Boolean(e3.cancelable)), n3;
            }, window.Event.prototype = o.prototype;
          }
        }(window.WebComponents), window.CustomElements = window.CustomElements || { flags: {} }, function(t2) {
          var e2 = t2.flags, n2 = [], i = function(t3) {
            n2.push(t3);
          }, o = function() {
            n2.forEach(function(e3) {
              e3(t2);
            });
          };
          t2.addModule = i, t2.initializeModules = o, t2.hasNative = Boolean(document.registerElement), t2.isIE = /Trident/.test(navigator.userAgent), t2.useNative = !e2.register && t2.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative);
        }(window.CustomElements), window.CustomElements.addModule(function(t2) {
          function e2(t3, e3) {
            n2(t3, function(t4) {
              return e3(t4) ? true : void i(t4, e3);
            }), i(t3, e3);
          }
          function n2(t3, e3, i2) {
            var o2 = t3.firstElementChild;
            if (!o2)
              for (o2 = t3.firstChild; o2 && o2.nodeType !== Node.ELEMENT_NODE; )
                o2 = o2.nextSibling;
            for (; o2; )
              e3(o2, i2) !== true && n2(o2, e3, i2), o2 = o2.nextElementSibling;
            return null;
          }
          function i(t3, n3) {
            for (var i2 = t3.shadowRoot; i2; )
              e2(i2, n3), i2 = i2.olderShadowRoot;
          }
          function o(t3, e3) {
            r(t3, e3, []);
          }
          function r(t3, e3, n3) {
            if (t3 = window.wrap(t3), !(n3.indexOf(t3) >= 0)) {
              n3.push(t3);
              for (var i2, o2 = t3.querySelectorAll("link[rel=" + s + "]"), a = 0, u = o2.length; u > a && (i2 = o2[a]); a++)
                i2.import && r(i2.import, e3, n3);
              e3(t3);
            }
          }
          var s = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";
          t2.forDocumentTree = o, t2.forSubtree = e2;
        }), window.CustomElements.addModule(function(t2) {
          function e2(t3, e3) {
            return n2(t3, e3) || i(t3, e3);
          }
          function n2(e3, n3) {
            return t2.upgrade(e3, n3) ? true : void (n3 && s(e3));
          }
          function i(t3, e3) {
            b(t3, function(t4) {
              return n2(t4, e3) ? true : void 0;
            });
          }
          function o(t3) {
            w.push(t3), x || (x = true, setTimeout(r));
          }
          function r() {
            x = false;
            for (var t3, e3 = w, n3 = 0, i2 = e3.length; i2 > n3 && (t3 = e3[n3]); n3++)
              t3();
            w = [];
          }
          function s(t3) {
            C ? o(function() {
              a(t3);
            }) : a(t3);
          }
          function a(t3) {
            t3.__upgraded__ && !t3.__attached && (t3.__attached = true, t3.attachedCallback && t3.attachedCallback());
          }
          function u(t3) {
            c(t3), b(t3, function(t4) {
              c(t4);
            });
          }
          function c(t3) {
            C ? o(function() {
              l(t3);
            }) : l(t3);
          }
          function l(t3) {
            t3.__upgraded__ && t3.__attached && (t3.__attached = false, t3.detachedCallback && t3.detachedCallback());
          }
          function h(t3) {
            for (var e3 = t3, n3 = window.wrap(document); e3; ) {
              if (e3 == n3)
                return true;
              e3 = e3.parentNode || e3.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e3.host;
            }
          }
          function p(t3) {
            if (t3.shadowRoot && !t3.shadowRoot.__watched) {
              y.dom && console.log("watching shadow-root for: ", t3.localName);
              for (var e3 = t3.shadowRoot; e3; )
                g(e3), e3 = e3.olderShadowRoot;
            }
          }
          function d(t3, n3) {
            if (y.dom) {
              var i2 = n3[0];
              if (i2 && i2.type === "childList" && i2.addedNodes && i2.addedNodes) {
                for (var o2 = i2.addedNodes[0]; o2 && o2 !== document && !o2.host; )
                  o2 = o2.parentNode;
                var r2 = o2 && (o2.URL || o2._URL || o2.host && o2.host.localName) || "";
                r2 = r2.split("/?").shift().split("/").pop();
              }
              console.group("mutations (%d) [%s]", n3.length, r2 || "");
            }
            var s2 = h(t3);
            n3.forEach(function(t4) {
              t4.type === "childList" && (E(t4.addedNodes, function(t5) {
                t5.localName && e2(t5, s2);
              }), E(t4.removedNodes, function(t5) {
                t5.localName && u(t5);
              }));
            }), y.dom && console.groupEnd();
          }
          function f(t3) {
            for (t3 = window.wrap(t3), t3 || (t3 = window.wrap(document)); t3.parentNode; )
              t3 = t3.parentNode;
            var e3 = t3.__observer;
            e3 && (d(t3, e3.takeRecords()), r());
          }
          function g(t3) {
            if (!t3.__observer) {
              var e3 = new MutationObserver(d.bind(this, t3));
              e3.observe(t3, { childList: true, subtree: true }), t3.__observer = e3;
            }
          }
          function m(t3) {
            t3 = window.wrap(t3), y.dom && console.group("upgradeDocument: ", t3.baseURI.split("/").pop());
            var n3 = t3 === window.wrap(document);
            e2(t3, n3), g(t3), y.dom && console.groupEnd();
          }
          function v(t3) {
            A(t3, m);
          }
          var y = t2.flags, b = t2.forSubtree, A = t2.forDocumentTree, C = window.MutationObserver._isPolyfilled && y["throttle-attached"];
          t2.hasPolyfillMutations = C, t2.hasThrottledAttached = C;
          var x = false, w = [], E = Array.prototype.forEach.call.bind(Array.prototype.forEach), S = Element.prototype.createShadowRoot;
          S && (Element.prototype.createShadowRoot = function() {
            var t3 = S.call(this);
            return window.CustomElements.watchShadow(this), t3;
          }), t2.watchShadow = p, t2.upgradeDocumentTree = v, t2.upgradeDocument = m, t2.upgradeSubtree = i, t2.upgradeAll = e2, t2.attached = s, t2.takeRecords = f;
        }), window.CustomElements.addModule(function(t2) {
          function e2(e3, i2) {
            if (e3.localName === "template" && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(e3), !e3.__upgraded__ && e3.nodeType === Node.ELEMENT_NODE) {
              var o2 = e3.getAttribute("is"), r2 = t2.getRegisteredDefinition(e3.localName) || t2.getRegisteredDefinition(o2);
              if (r2 && (o2 && r2.tag == e3.localName || !o2 && !r2.extends))
                return n2(e3, r2, i2);
            }
          }
          function n2(e3, n3, o2) {
            return s.upgrade && console.group("upgrade:", e3.localName), n3.is && e3.setAttribute("is", n3.is), i(e3, n3), e3.__upgraded__ = true, r(e3), o2 && t2.attached(e3), t2.upgradeSubtree(e3, o2), s.upgrade && console.groupEnd(), e3;
          }
          function i(t3, e3) {
            Object.__proto__ ? t3.__proto__ = e3.prototype : (o(t3, e3.prototype, e3.native), t3.__proto__ = e3.prototype);
          }
          function o(t3, e3, n3) {
            for (var i2 = {}, o2 = e3; o2 !== n3 && o2 !== HTMLElement.prototype; ) {
              for (var r2, s2 = Object.getOwnPropertyNames(o2), a = 0; r2 = s2[a]; a++)
                i2[r2] || (Object.defineProperty(t3, r2, Object.getOwnPropertyDescriptor(o2, r2)), i2[r2] = 1);
              o2 = Object.getPrototypeOf(o2);
            }
          }
          function r(t3) {
            t3.createdCallback && t3.createdCallback();
          }
          var s = t2.flags;
          t2.upgrade = e2, t2.upgradeWithDefinition = n2, t2.implementPrototype = i;
        }), window.CustomElements.addModule(function(t2) {
          function e2(e3, i2) {
            var u2 = i2 || {};
            if (!e3)
              throw new Error("document.registerElement: first argument `name` must not be empty");
            if (e3.indexOf("-") < 0)
              throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(e3) + "'.");
            if (o(e3))
              throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(e3) + "'. The type name is invalid.");
            if (c(e3))
              throw new Error("DuplicateDefinitionError: a type with name '" + String(e3) + "' is already registered");
            return u2.prototype || (u2.prototype = Object.create(HTMLElement.prototype)), u2.__name = e3.toLowerCase(), u2.extends && (u2.extends = u2.extends.toLowerCase()), u2.lifecycle = u2.lifecycle || {}, u2.ancestry = r(u2.extends), s(u2), a(u2), n2(u2.prototype), l(u2.__name, u2), u2.ctor = h(u2), u2.ctor.prototype = u2.prototype, u2.prototype.constructor = u2.ctor, t2.ready && m(document), u2.ctor;
          }
          function n2(t3) {
            if (!t3.setAttribute._polyfilled) {
              var e3 = t3.setAttribute;
              t3.setAttribute = function(t4, n4) {
                i.call(this, t4, n4, e3);
              };
              var n3 = t3.removeAttribute;
              t3.removeAttribute = function(t4) {
                i.call(this, t4, null, n3);
              }, t3.setAttribute._polyfilled = true;
            }
          }
          function i(t3, e3, n3) {
            t3 = t3.toLowerCase();
            var i2 = this.getAttribute(t3);
            n3.apply(this, arguments);
            var o2 = this.getAttribute(t3);
            this.attributeChangedCallback && o2 !== i2 && this.attributeChangedCallback(t3, i2, o2);
          }
          function o(t3) {
            for (var e3 = 0; e3 < C.length; e3++)
              if (t3 === C[e3])
                return true;
          }
          function r(t3) {
            var e3 = c(t3);
            return e3 ? r(e3.extends).concat([e3]) : [];
          }
          function s(t3) {
            for (var e3, n3 = t3.extends, i2 = 0; e3 = t3.ancestry[i2]; i2++)
              n3 = e3.is && e3.tag;
            t3.tag = n3 || t3.__name, n3 && (t3.is = t3.__name);
          }
          function a(t3) {
            if (!Object.__proto__) {
              var e3 = HTMLElement.prototype;
              if (t3.is) {
                var n3 = document.createElement(t3.tag);
                e3 = Object.getPrototypeOf(n3);
              }
              for (var i2, o2 = t3.prototype, r2 = false; o2; )
                o2 == e3 && (r2 = true), i2 = Object.getPrototypeOf(o2), i2 && (o2.__proto__ = i2), o2 = i2;
              r2 || console.warn(t3.tag + " prototype not found in prototype chain for " + t3.is), t3.native = e3;
            }
          }
          function u(t3) {
            return y(E(t3.tag), t3);
          }
          function c(t3) {
            return t3 ? x[t3.toLowerCase()] : void 0;
          }
          function l(t3, e3) {
            x[t3] = e3;
          }
          function h(t3) {
            return function() {
              return u(t3);
            };
          }
          function p(t3, e3, n3) {
            return t3 === w ? d(e3, n3) : S(t3, e3);
          }
          function d(t3, e3) {
            t3 && (t3 = t3.toLowerCase()), e3 && (e3 = e3.toLowerCase());
            var n3 = c(e3 || t3);
            if (n3) {
              if (t3 == n3.tag && e3 == n3.is)
                return new n3.ctor();
              if (!e3 && !n3.is)
                return new n3.ctor();
            }
            var i2;
            return e3 ? (i2 = d(t3), i2.setAttribute("is", e3), i2) : (i2 = E(t3), t3.indexOf("-") >= 0 && b(i2, HTMLElement), i2);
          }
          function f(t3, e3) {
            var n3 = t3[e3];
            t3[e3] = function() {
              var t4 = n3.apply(this, arguments);
              return v(t4), t4;
            };
          }
          var g, m = (t2.isIE, t2.upgradeDocumentTree), v = t2.upgradeAll, y = t2.upgradeWithDefinition, b = t2.implementPrototype, A = t2.useNative, C = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"], x = {}, w = "http://www.w3.org/1999/xhtml", E = document.createElement.bind(document), S = document.createElementNS.bind(document);
          g = Object.__proto__ || A ? function(t3, e3) {
            return t3 instanceof e3;
          } : function(t3, e3) {
            if (t3 instanceof e3)
              return true;
            for (var n3 = t3; n3; ) {
              if (n3 === e3.prototype)
                return true;
              n3 = n3.__proto__;
            }
            return false;
          }, f(Node.prototype, "cloneNode"), f(document, "importNode"), document.registerElement = e2, document.createElement = d, document.createElementNS = p, t2.registry = x, t2.instanceof = g, t2.reservedTagList = C, t2.getRegisteredDefinition = c, document.register = document.registerElement;
        }), function(t2) {
          function e2() {
            r(window.wrap(document)), window.CustomElements.ready = true;
            var t3 = window.requestAnimationFrame || function(t4) {
              setTimeout(t4, 16);
            };
            t3(function() {
              setTimeout(function() {
                window.CustomElements.readyTime = Date.now(), window.HTMLImports && (window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime), document.dispatchEvent(new CustomEvent("WebComponentsReady", { bubbles: true }));
              });
            });
          }
          var n2 = t2.useNative, i = t2.initializeModules;
          if (t2.isIE, n2) {
            var o = function() {
            };
            t2.watchShadow = o, t2.upgrade = o, t2.upgradeAll = o, t2.upgradeDocumentTree = o, t2.upgradeSubtree = o, t2.takeRecords = o, t2.instanceof = function(t3, e3) {
              return t3 instanceof e3;
            };
          } else
            i();
          var r = t2.upgradeDocumentTree, s = t2.upgradeDocument;
          if (window.wrap || (window.ShadowDOMPolyfill ? (window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded, window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded) : window.wrap = window.unwrap = function(t3) {
            return t3;
          }), window.HTMLImports && (window.HTMLImports.__importsParsingHook = function(t3) {
            t3.import && s(wrap(t3.import));
          }), document.readyState === "complete" || t2.flags.eager)
            e2();
          else if (document.readyState !== "interactive" || window.attachEvent || window.HTMLImports && !window.HTMLImports.ready) {
            var a = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
            window.addEventListener(a, e2);
          } else
            e2();
        }(window.CustomElements));
      }.call(exports), function() {
      }.call(exports), function() {
        var t = this;
        (function() {
          (function() {
            this.Trix = { VERSION: "1.3.1", ZERO_WIDTH_SPACE: "\uFEFF", NON_BREAKING_SPACE: "\xA0", OBJECT_REPLACEMENT_CHARACTER: "\uFFFC", browser: { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: function() {
              var t2, e2, n, i;
              if (typeof InputEvent == "undefined")
                return false;
              for (i = ["data", "getTargetRanges", "inputType"], t2 = 0, e2 = i.length; e2 > t2; t2++)
                if (n = i[t2], !(n in InputEvent.prototype))
                  return false;
              return true;
            }() }, config: {} };
          }).call(this);
        }).call(t);
        var e = t.Trix;
        (function() {
          (function() {
            e.BasicObject = function() {
              function t2() {
              }
              var e2, n, i;
              return t2.proxyMethod = function(t3) {
                var i2, o, r, s, a;
                return r = n(t3), i2 = r.name, s = r.toMethod, a = r.toProperty, o = r.optional, this.prototype[i2] = function() {
                  var t4, n2;
                  return t4 = s != null ? o ? typeof this[s] == "function" ? this[s]() : void 0 : this[s]() : a != null ? this[a] : void 0, o ? (n2 = t4 != null ? t4[i2] : void 0, n2 != null ? e2.call(n2, t4, arguments) : void 0) : (n2 = t4[i2], e2.call(n2, t4, arguments));
                };
              }, n = function(t3) {
                var e3, n2;
                if (!(n2 = t3.match(i)))
                  throw new Error("can't parse @proxyMethod expression: " + t3);
                return e3 = { name: n2[4] }, n2[2] != null ? e3.toMethod = n2[1] : e3.toProperty = n2[1], n2[3] != null && (e3.optional = true), e3;
              }, e2 = Function.prototype.apply, i = /^(.+?)(\(\))?(\?)?\.(.+?)$/, t2;
            }();
          }).call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Object = function(n2) {
              function i() {
                this.id = ++o;
              }
              var o;
              return t2(i, n2), o = 0, i.fromJSONString = function(t3) {
                return this.fromJSON(JSON.parse(t3));
              }, i.prototype.hasSameConstructorAs = function(t3) {
                return this.constructor === (t3 != null ? t3.constructor : void 0);
              }, i.prototype.isEqualTo = function(t3) {
                return this === t3;
              }, i.prototype.inspect = function() {
                var t3, e2, n3;
                return t3 = function() {
                  var t4, i2, o2;
                  i2 = (t4 = this.contentsForInspection()) != null ? t4 : {}, o2 = [];
                  for (e2 in i2)
                    n3 = i2[e2], o2.push(e2 + "=" + n3);
                  return o2;
                }.call(this), "#<" + this.constructor.name + ":" + this.id + (t3.length ? " " + t3.join(", ") : "") + ">";
              }, i.prototype.contentsForInspection = function() {
              }, i.prototype.toJSONString = function() {
                return JSON.stringify(this);
              }, i.prototype.toUTF16String = function() {
                return e.UTF16String.box(this);
              }, i.prototype.getCacheKey = function() {
                return this.id.toString();
              }, i;
            }(e.BasicObject);
          }.call(this), function() {
            e.extend = function(t2) {
              var e2, n;
              for (e2 in t2)
                n = t2[e2], this[e2] = n;
              return this;
            };
          }.call(this), function() {
            e.extend({ defer: function(t2) {
              return setTimeout(t2, 1);
            } });
          }.call(this), function() {
            var t2, n;
            e.extend({ normalizeSpaces: function(t3) {
              return t3.replace(RegExp("" + e.ZERO_WIDTH_SPACE, "g"), "").replace(RegExp("" + e.NON_BREAKING_SPACE, "g"), " ");
            }, normalizeNewlines: function(t3) {
              return t3.replace(/\r\n/g, "\n");
            }, breakableWhitespacePattern: RegExp("[^\\S" + e.NON_BREAKING_SPACE + "]"), squishBreakableWhitespace: function(t3) {
              return t3.replace(RegExp("" + e.breakableWhitespacePattern.source, "g"), " ").replace(/\ {2,}/g, " ");
            }, summarizeStringChange: function(t3, i) {
              var o, r, s, a;
              return t3 = e.UTF16String.box(t3), i = e.UTF16String.box(i), i.length < t3.length ? (r = n(t3, i), a = r[0], o = r[1]) : (s = n(i, t3), o = s[0], a = s[1]), { added: o, removed: a };
            } }), n = function(n2, i) {
              var o, r, s, a, u;
              return n2.isEqualTo(i) ? ["", ""] : (r = t2(n2, i), a = r.utf16String.length, s = a ? (u = r.offset, r, o = n2.codepoints.slice(0, u).concat(n2.codepoints.slice(u + a)), t2(i, e.UTF16String.fromCodepoints(o))) : t2(i, n2), [r.utf16String.toString(), s.utf16String.toString()]);
            }, t2 = function(t3, e2) {
              var n2, i, o;
              for (n2 = 0, i = t3.length, o = e2.length; i > n2 && t3.charAt(n2).isEqualTo(e2.charAt(n2)); )
                n2++;
              for (; i > n2 + 1 && t3.charAt(i - 1).isEqualTo(e2.charAt(o - 1)); )
                i--, o--;
              return { utf16String: t3.slice(n2, i), offset: n2 };
            };
          }.call(this), function() {
            e.extend({ copyObject: function(t2) {
              var e2, n, i;
              t2 == null && (t2 = {}), n = {};
              for (e2 in t2)
                i = t2[e2], n[e2] = i;
              return n;
            }, objectsAreEqual: function(t2, e2) {
              var n, i;
              if (t2 == null && (t2 = {}), e2 == null && (e2 = {}), Object.keys(t2).length !== Object.keys(e2).length)
                return false;
              for (n in t2)
                if (i = t2[n], i !== e2[n])
                  return false;
              return true;
            } });
          }.call(this), function() {
            var t2 = [].slice;
            e.extend({ arraysAreEqual: function(t3, e2) {
              var n, i, o, r;
              if (t3 == null && (t3 = []), e2 == null && (e2 = []), t3.length !== e2.length)
                return false;
              for (i = n = 0, o = t3.length; o > n; i = ++n)
                if (r = t3[i], r !== e2[i])
                  return false;
              return true;
            }, arrayStartsWith: function(t3, n) {
              return t3 == null && (t3 = []), n == null && (n = []), e.arraysAreEqual(t3.slice(0, n.length), n);
            }, spliceArray: function() {
              var e2, n, i;
              return n = arguments[0], e2 = 2 <= arguments.length ? t2.call(arguments, 1) : [], i = n.slice(0), i.splice.apply(i, e2), i;
            }, summarizeArrayChange: function(t3, e2) {
              var n, i, o, r, s, a, u, c, l, h, p;
              for (t3 == null && (t3 = []), e2 == null && (e2 = []), n = [], h = [], o = /* @__PURE__ */ new Set(), r = 0, u = t3.length; u > r; r++)
                p = t3[r], o.add(p);
              for (i = /* @__PURE__ */ new Set(), s = 0, c = e2.length; c > s; s++)
                p = e2[s], i.add(p), o.has(p) || n.push(p);
              for (a = 0, l = t3.length; l > a; a++)
                p = t3[a], i.has(p) || h.push(p);
              return { added: n, removed: h };
            } });
          }.call(this), function() {
            var t2, n, i, o;
            t2 = null, n = null, o = null, i = null, e.extend({ getAllAttributeNames: function() {
              return t2 != null ? t2 : t2 = e.getTextAttributeNames().concat(e.getBlockAttributeNames());
            }, getBlockConfig: function(t3) {
              return e.config.blockAttributes[t3];
            }, getBlockAttributeNames: function() {
              return n != null ? n : n = Object.keys(e.config.blockAttributes);
            }, getTextConfig: function(t3) {
              return e.config.textAttributes[t3];
            }, getTextAttributeNames: function() {
              return o != null ? o : o = Object.keys(e.config.textAttributes);
            }, getListAttributeNames: function() {
              var t3, n2;
              return i != null ? i : i = function() {
                var i2, o2;
                i2 = e.config.blockAttributes, o2 = [];
                for (t3 in i2)
                  n2 = i2[t3].listAttribute, n2 != null && o2.push(n2);
                return o2;
              }();
            } });
          }.call(this), function() {
            var t2, n, i, o, r, s = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = document.documentElement, n = (i = (o = (r = t2.matchesSelector) != null ? r : t2.webkitMatchesSelector) != null ? o : t2.msMatchesSelector) != null ? i : t2.mozMatchesSelector, e.extend({ handleEvent: function(n2, i2) {
              var o2, r2, s2, a, u, c, l, h, p, d, f, g;
              return h = i2 != null ? i2 : {}, c = h.onElement, u = h.matchingSelector, g = h.withCallback, a = h.inPhase, l = h.preventDefault, d = h.times, r2 = c != null ? c : t2, p = u, o2 = g, f = a === "capturing", s2 = function(t3) {
                var n3;
                return d != null && --d === 0 && s2.destroy(), n3 = e.findClosestElementFromNode(t3.target, { matchingSelector: p }), n3 != null && (g != null && g.call(n3, t3, n3), l) ? t3.preventDefault() : void 0;
              }, s2.destroy = function() {
                return r2.removeEventListener(n2, s2, f);
              }, r2.addEventListener(n2, s2, f), s2;
            }, handleEventOnce: function(t3, n2) {
              return n2 == null && (n2 = {}), n2.times = 1, e.handleEvent(t3, n2);
            }, triggerEvent: function(n2, i2) {
              var o2, r2, s2, a, u, c, l;
              return l = i2 != null ? i2 : {}, c = l.onElement, r2 = l.bubbles, s2 = l.cancelable, o2 = l.attributes, a = c != null ? c : t2, r2 = r2 !== false, s2 = s2 !== false, u = document.createEvent("Events"), u.initEvent(n2, r2, s2), o2 != null && e.extend.call(u, o2), a.dispatchEvent(u);
            }, elementMatchesSelector: function(t3, e2) {
              return (t3 != null ? t3.nodeType : void 0) === 1 ? n.call(t3, e2) : void 0;
            }, findClosestElementFromNode: function(t3, n2) {
              var i2, o2, r2;
              for (o2 = n2 != null ? n2 : {}, i2 = o2.matchingSelector, r2 = o2.untilNode; t3 != null && t3.nodeType !== Node.ELEMENT_NODE; )
                t3 = t3.parentNode;
              if (t3 != null) {
                if (i2 == null)
                  return t3;
                if (t3.closest && r2 == null)
                  return t3.closest(i2);
                for (; t3 && t3 !== r2; ) {
                  if (e.elementMatchesSelector(t3, i2))
                    return t3;
                  t3 = t3.parentNode;
                }
              }
            }, findInnerElement: function(t3) {
              for (; t3 != null ? t3.firstElementChild : void 0; )
                t3 = t3.firstElementChild;
              return t3;
            }, innerElementIsActive: function(t3) {
              return document.activeElement !== t3 && e.elementContainsNode(t3, document.activeElement);
            }, elementContainsNode: function(t3, e2) {
              if (t3 && e2)
                for (; e2; ) {
                  if (e2 === t3)
                    return true;
                  e2 = e2.parentNode;
                }
            }, findNodeFromContainerAndOffset: function(t3, e2) {
              var n2;
              if (t3)
                return t3.nodeType === Node.TEXT_NODE ? t3 : e2 === 0 ? (n2 = t3.firstChild) != null ? n2 : t3 : t3.childNodes.item(e2 - 1);
            }, findElementFromContainerAndOffset: function(t3, n2) {
              var i2;
              return i2 = e.findNodeFromContainerAndOffset(t3, n2), e.findClosestElementFromNode(i2);
            }, findChildIndexOfNode: function(t3) {
              var e2;
              if (t3 != null ? t3.parentNode : void 0) {
                for (e2 = 0; t3 = t3.previousSibling; )
                  e2++;
                return e2;
              }
            }, removeNode: function(t3) {
              var e2;
              return t3 != null && (e2 = t3.parentNode) != null ? e2.removeChild(t3) : void 0;
            }, walkTree: function(t3, e2) {
              var n2, i2, o2, r2, s2;
              return o2 = e2 != null ? e2 : {}, i2 = o2.onlyNodesOfType, r2 = o2.usingFilter, n2 = o2.expandEntityReferences, s2 = function() {
                switch (i2) {
                  case "element":
                    return NodeFilter.SHOW_ELEMENT;
                  case "text":
                    return NodeFilter.SHOW_TEXT;
                  case "comment":
                    return NodeFilter.SHOW_COMMENT;
                  default:
                    return NodeFilter.SHOW_ALL;
                }
              }(), document.createTreeWalker(t3, s2, r2 != null ? r2 : null, n2 === true);
            }, tagName: function(t3) {
              var e2;
              return t3 != null && (e2 = t3.tagName) != null ? e2.toLowerCase() : void 0;
            }, makeElement: function(t3, e2) {
              var n2, i2, o2, r2, s2, a, u, c, l, h, p, d, f, g;
              if (e2 == null && (e2 = {}), typeof t3 == "object" ? (e2 = t3, t3 = e2.tagName) : e2 = { attributes: e2 }, o2 = document.createElement(t3), e2.editable != null && (e2.attributes == null && (e2.attributes = {}), e2.attributes.contenteditable = e2.editable), e2.attributes) {
                l = e2.attributes;
                for (a in l)
                  g = l[a], o2.setAttribute(a, g);
              }
              if (e2.style) {
                h = e2.style;
                for (a in h)
                  g = h[a], o2.style[a] = g;
              }
              if (e2.data) {
                p = e2.data;
                for (a in p)
                  g = p[a], o2.dataset[a] = g;
              }
              if (e2.className)
                for (d = e2.className.split(" "), r2 = 0, u = d.length; u > r2; r2++)
                  i2 = d[r2], o2.classList.add(i2);
              if (e2.textContent && (o2.textContent = e2.textContent), e2.childNodes)
                for (f = [].concat(e2.childNodes), s2 = 0, c = f.length; c > s2; s2++)
                  n2 = f[s2], o2.appendChild(n2);
              return o2;
            }, getBlockTagNames: function() {
              var t3, n2;
              return e.blockTagNames != null ? e.blockTagNames : e.blockTagNames = function() {
                var i2, o2;
                i2 = e.config.blockAttributes, o2 = [];
                for (t3 in i2)
                  n2 = i2[t3].tagName, n2 && o2.push(n2);
                return o2;
              }();
            }, nodeIsBlockContainer: function(t3) {
              return e.nodeIsBlockStartComment(t3 != null ? t3.firstChild : void 0);
            }, nodeProbablyIsBlockContainer: function(t3) {
              var n2, i2;
              return n2 = e.tagName(t3), s.call(e.getBlockTagNames(), n2) >= 0 && (i2 = e.tagName(t3.firstChild), s.call(e.getBlockTagNames(), i2) < 0);
            }, nodeIsBlockStart: function(t3, n2) {
              var i2;
              return i2 = (n2 != null ? n2 : { strict: true }).strict, i2 ? e.nodeIsBlockStartComment(t3) : e.nodeIsBlockStartComment(t3) || !e.nodeIsBlockStartComment(t3.firstChild) && e.nodeProbablyIsBlockContainer(t3);
            }, nodeIsBlockStartComment: function(t3) {
              return e.nodeIsCommentNode(t3) && (t3 != null ? t3.data : void 0) === "block";
            }, nodeIsCommentNode: function(t3) {
              return (t3 != null ? t3.nodeType : void 0) === Node.COMMENT_NODE;
            }, nodeIsCursorTarget: function(t3, n2) {
              var i2;
              return i2 = (n2 != null ? n2 : {}).name, t3 ? e.nodeIsTextNode(t3) ? t3.data === e.ZERO_WIDTH_SPACE ? i2 ? t3.parentNode.dataset.trixCursorTarget === i2 : true : void 0 : e.nodeIsCursorTarget(t3.firstChild) : void 0;
            }, nodeIsAttachmentElement: function(t3) {
              return e.elementMatchesSelector(t3, e.AttachmentView.attachmentSelector);
            }, nodeIsEmptyTextNode: function(t3) {
              return e.nodeIsTextNode(t3) && (t3 != null ? t3.data : void 0) === "";
            }, nodeIsTextNode: function(t3) {
              return (t3 != null ? t3.nodeType : void 0) === Node.TEXT_NODE;
            } });
          }.call(this), function() {
            var t2, n, i, o, r;
            t2 = e.copyObject, o = e.objectsAreEqual, e.extend({ normalizeRange: i = function(t3) {
              var e2;
              if (t3 != null)
                return Array.isArray(t3) || (t3 = [t3, t3]), [n(t3[0]), n((e2 = t3[1]) != null ? e2 : t3[0])];
            }, rangeIsCollapsed: function(t3) {
              var e2, n2, o2;
              if (t3 != null)
                return n2 = i(t3), o2 = n2[0], e2 = n2[1], r(o2, e2);
            }, rangesAreEqual: function(t3, e2) {
              var n2, o2, s, a, u, c;
              if (t3 != null && e2 != null)
                return s = i(t3), o2 = s[0], n2 = s[1], a = i(e2), c = a[0], u = a[1], r(o2, c) && r(n2, u);
            } }), n = function(e2) {
              return typeof e2 == "number" ? e2 : t2(e2);
            }, r = function(t3, e2) {
              return typeof t3 == "number" ? t3 === e2 : o(t3, e2);
            };
          }.call(this), function() {
            var t2, n, i, o, r, s, a;
            e.registerElement = function(t3, e2) {
              var n2, i2;
              return e2 == null && (e2 = {}), t3 = t3.toLowerCase(), e2 = a(e2), i2 = s(e2), (n2 = i2.defaultCSS) && (delete i2.defaultCSS, o(n2, t3)), r(t3, i2);
            }, o = function(t3, e2) {
              var n2;
              return n2 = i(e2), n2.textContent = t3.replace(/%t/g, e2);
            }, i = function(e2) {
              var n2, i2;
              return n2 = document.createElement("style"), n2.setAttribute("type", "text/css"), n2.setAttribute("data-tag-name", e2.toLowerCase()), (i2 = t2()) && n2.setAttribute("nonce", i2), document.head.insertBefore(n2, document.head.firstChild), n2;
            }, t2 = function() {
              var t3;
              return (t3 = n("trix-csp-nonce") || n("csp-nonce")) ? t3.getAttribute("content") : void 0;
            }, n = function(t3) {
              return document.head.querySelector("meta[name=" + t3 + "]");
            }, s = function(t3) {
              var e2, n2, i2;
              n2 = {};
              for (e2 in t3)
                i2 = t3[e2], n2[e2] = typeof i2 == "function" ? { value: i2 } : i2;
              return n2;
            }, a = function() {
              var t3;
              return t3 = function(t4) {
                var e2, n2, i2, o2, r2;
                for (e2 = {}, r2 = ["initialize", "connect", "disconnect"], n2 = 0, o2 = r2.length; o2 > n2; n2++)
                  i2 = r2[n2], e2[i2] = t4[i2], delete t4[i2];
                return e2;
              }, window.customElements ? function(e2) {
                var n2, i2, o2, r2, s2;
                return s2 = t3(e2), o2 = s2.initialize, n2 = s2.connect, i2 = s2.disconnect, o2 && (r2 = n2, n2 = function() {
                  return this.initialized || (this.initialized = true, o2.call(this)), r2 != null ? r2.call(this) : void 0;
                }), n2 && (e2.connectedCallback = n2), i2 && (e2.disconnectedCallback = i2), e2;
              } : function(e2) {
                var n2, i2, o2, r2;
                return r2 = t3(e2), o2 = r2.initialize, n2 = r2.connect, i2 = r2.disconnect, o2 && (e2.createdCallback = o2), n2 && (e2.attachedCallback = n2), i2 && (e2.detachedCallback = i2), e2;
              };
            }(), r = function() {
              return window.customElements ? function(t3, e2) {
                var n2;
                return n2 = function() {
                  return typeof Reflect == "object" ? Reflect.construct(HTMLElement, [], n2) : HTMLElement.apply(this);
                }, Object.setPrototypeOf(n2.prototype, HTMLElement.prototype), Object.setPrototypeOf(n2, HTMLElement), Object.defineProperties(n2.prototype, e2), window.customElements.define(t3, n2), n2;
              } : function(t3, e2) {
                var n2, i2;
                return i2 = Object.create(HTMLElement.prototype, e2), n2 = document.registerElement(t3, { prototype: i2 }), Object.defineProperty(i2, "constructor", { value: n2 }), n2;
              };
            }();
          }.call(this), function() {
            var t2, n;
            e.extend({ getDOMSelection: function() {
              var t3;
              return t3 = window.getSelection(), t3.rangeCount > 0 ? t3 : void 0;
            }, getDOMRange: function() {
              var n2, i;
              return (n2 = (i = e.getDOMSelection()) != null ? i.getRangeAt(0) : void 0) && !t2(n2) ? n2 : void 0;
            }, setDOMRange: function(t3) {
              var n2;
              return n2 = window.getSelection(), n2.removeAllRanges(), n2.addRange(t3), e.selectionChangeObserver.update();
            } }), t2 = function(t3) {
              return n(t3.startContainer) || n(t3.endContainer);
            }, n = function(t3) {
              return !Object.getPrototypeOf(t3);
            };
          }.call(this), function() {
            var t2;
            t2 = { "application/x-trix-feature-detection": "test" }, e.extend({ dataTransferIsPlainText: function(t3) {
              var e2, n, i;
              return i = t3.getData("text/plain"), n = t3.getData("text/html"), i && n ? (e2 = new DOMParser().parseFromString(n, "text/html").body, e2.textContent === i ? !e2.querySelector("*") : void 0) : i != null ? i.length : void 0;
            }, dataTransferIsWritable: function(e2) {
              var n, i;
              if ((e2 != null ? e2.setData : void 0) != null) {
                for (n in t2)
                  if (i = t2[n], !function() {
                    try {
                      return e2.setData(n, i), e2.getData(n) === i;
                    } catch (t3) {
                    }
                  }())
                    return;
                return true;
              }
            }, keyEventIsKeyboardCommand: function() {
              return /Mac|^iP/.test(navigator.platform) ? function(t3) {
                return t3.metaKey;
              } : function(t3) {
                return t3.ctrlKey;
              };
            }() });
          }.call(this), function() {
            e.extend({ RTL_PATTERN: /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, getDirection: function() {
              var t2, n, i, o;
              return n = e.makeElement("input", { dir: "auto", name: "x", dirName: "x.dir" }), t2 = e.makeElement("form"), t2.appendChild(n), i = function() {
                try {
                  return new FormData(t2).has(n.dirName);
                } catch (e2) {
                }
              }(), o = function() {
                try {
                  return n.matches(":dir(ltr),:dir(rtl)");
                } catch (t3) {
                }
              }(), i ? function(e2) {
                return n.value = e2, new FormData(t2).get(n.dirName);
              } : o ? function(t3) {
                return n.value = t3, n.matches(":dir(rtl)") ? "rtl" : "ltr";
              } : function(t3) {
                var n2;
                return n2 = t3.trim().charAt(0), e.RTL_PATTERN.test(n2) ? "rtl" : "ltr";
              };
            }() });
          }.call(this), function() {
          }.call(this), function() {
            var t2, n = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var o in e2)
                i.call(e2, o) && (t3[o] = e2[o]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, i = {}.hasOwnProperty;
            t2 = e.arraysAreEqual, e.Hash = function(i2) {
              function o(t3) {
                t3 == null && (t3 = {}), this.values = s(t3), o.__super__.constructor.apply(this, arguments);
              }
              var r, s, a, u, c;
              return n(o, i2), o.fromCommonAttributesOfObjects = function(t3) {
                var e2, n2, i3, o2, s2, a2;
                if (t3 == null && (t3 = []), !t3.length)
                  return new this();
                for (e2 = r(t3[0]), i3 = e2.getKeys(), a2 = t3.slice(1), n2 = 0, o2 = a2.length; o2 > n2; n2++)
                  s2 = a2[n2], i3 = e2.getKeysCommonToHash(r(s2)), e2 = e2.slice(i3);
                return e2;
              }, o.box = function(t3) {
                return r(t3);
              }, o.prototype.add = function(t3, e2) {
                return this.merge(u(t3, e2));
              }, o.prototype.remove = function(t3) {
                return new e.Hash(s(this.values, t3));
              }, o.prototype.get = function(t3) {
                return this.values[t3];
              }, o.prototype.has = function(t3) {
                return t3 in this.values;
              }, o.prototype.merge = function(t3) {
                return new e.Hash(a(this.values, c(t3)));
              }, o.prototype.slice = function(t3) {
                var n2, i3, o2, r2;
                for (r2 = {}, n2 = 0, o2 = t3.length; o2 > n2; n2++)
                  i3 = t3[n2], this.has(i3) && (r2[i3] = this.values[i3]);
                return new e.Hash(r2);
              }, o.prototype.getKeys = function() {
                return Object.keys(this.values);
              }, o.prototype.getKeysCommonToHash = function(t3) {
                var e2, n2, i3, o2, s2;
                for (t3 = r(t3), o2 = this.getKeys(), s2 = [], e2 = 0, i3 = o2.length; i3 > e2; e2++)
                  n2 = o2[e2], this.values[n2] === t3.values[n2] && s2.push(n2);
                return s2;
              }, o.prototype.isEqualTo = function(e2) {
                return t2(this.toArray(), r(e2).toArray());
              }, o.prototype.isEmpty = function() {
                return this.getKeys().length === 0;
              }, o.prototype.toArray = function() {
                var t3, e2, n2;
                return (this.array != null ? this.array : this.array = function() {
                  var i3;
                  e2 = [], i3 = this.values;
                  for (t3 in i3)
                    n2 = i3[t3], e2.push(t3, n2);
                  return e2;
                }.call(this)).slice(0);
              }, o.prototype.toObject = function() {
                return s(this.values);
              }, o.prototype.toJSON = function() {
                return this.toObject();
              }, o.prototype.contentsForInspection = function() {
                return { values: JSON.stringify(this.values) };
              }, u = function(t3, e2) {
                var n2;
                return n2 = {}, n2[t3] = e2, n2;
              }, a = function(t3, e2) {
                var n2, i3, o2;
                i3 = s(t3);
                for (n2 in e2)
                  o2 = e2[n2], i3[n2] = o2;
                return i3;
              }, s = function(t3, e2) {
                var n2, i3, o2, r2, s2;
                for (r2 = {}, s2 = Object.keys(t3).sort(), n2 = 0, o2 = s2.length; o2 > n2; n2++)
                  i3 = s2[n2], i3 !== e2 && (r2[i3] = t3[i3]);
                return r2;
              }, r = function(t3) {
                return t3 instanceof e.Hash ? t3 : new e.Hash(t3);
              }, c = function(t3) {
                return t3 instanceof e.Hash ? t3.values : t3;
              }, o;
            }(e.Object);
          }.call(this), function() {
            e.ObjectGroup = function() {
              function t2(t3, e2) {
                var n, i;
                this.objects = t3 != null ? t3 : [], i = e2.depth, n = e2.asTree, n && (this.depth = i, this.objects = this.constructor.groupObjects(this.objects, { asTree: n, depth: this.depth + 1 }));
              }
              return t2.groupObjects = function(t3, e2) {
                var n, i, o, r, s, a, u, c, l;
                for (t3 == null && (t3 = []), l = e2 != null ? e2 : {}, o = l.depth, n = l.asTree, n && o == null && (o = 0), c = [], s = 0, a = t3.length; a > s; s++) {
                  if (u = t3[s], r) {
                    if ((typeof u.canBeGrouped == "function" ? u.canBeGrouped(o) : void 0) && (typeof (i = r[r.length - 1]).canBeGroupedWith == "function" ? i.canBeGroupedWith(u, o) : void 0)) {
                      r.push(u);
                      continue;
                    }
                    c.push(new this(r, { depth: o, asTree: n })), r = null;
                  }
                  (typeof u.canBeGrouped == "function" ? u.canBeGrouped(o) : void 0) ? r = [u] : c.push(u);
                }
                return r && c.push(new this(r, { depth: o, asTree: n })), c;
              }, t2.prototype.getObjects = function() {
                return this.objects;
              }, t2.prototype.getDepth = function() {
                return this.depth;
              }, t2.prototype.getCacheKey = function() {
                var t3, e2, n, i, o;
                for (e2 = ["objectGroup"], o = this.getObjects(), t3 = 0, n = o.length; n > t3; t3++)
                  i = o[t3], e2.push(i.getCacheKey());
                return e2.join("/");
              }, t2;
            }();
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.ObjectMap = function(e2) {
              function n2(t3) {
                var e3, n3, i, o, r;
                for (t3 == null && (t3 = []), this.objects = {}, i = 0, o = t3.length; o > i; i++)
                  r = t3[i], n3 = JSON.stringify(r), (e3 = this.objects)[n3] == null && (e3[n3] = r);
              }
              return t2(n2, e2), n2.prototype.find = function(t3) {
                var e3;
                return e3 = JSON.stringify(t3), this.objects[e3];
              }, n2;
            }(e.BasicObject);
          }.call(this), function() {
            e.ElementStore = function() {
              function t2(t3) {
                this.reset(t3);
              }
              var e2;
              return t2.prototype.add = function(t3) {
                var n;
                return n = e2(t3), this.elements[n] = t3;
              }, t2.prototype.remove = function(t3) {
                var n, i;
                return n = e2(t3), (i = this.elements[n]) ? (delete this.elements[n], i) : void 0;
              }, t2.prototype.reset = function(t3) {
                var e3, n, i;
                for (t3 == null && (t3 = []), this.elements = {}, n = 0, i = t3.length; i > n; n++)
                  e3 = t3[n], this.add(e3);
                return t3;
              }, e2 = function(t3) {
                return t3.dataset.trixStoreKey;
              }, t2;
            }();
          }.call(this), function() {
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Operation = function(e2) {
              function n2() {
                return n2.__super__.constructor.apply(this, arguments);
              }
              return t2(n2, e2), n2.prototype.isPerforming = function() {
                return this.performing === true;
              }, n2.prototype.hasPerformed = function() {
                return this.performed === true;
              }, n2.prototype.hasSucceeded = function() {
                return this.performed && this.succeeded;
              }, n2.prototype.hasFailed = function() {
                return this.performed && !this.succeeded;
              }, n2.prototype.getPromise = function() {
                return this.promise != null ? this.promise : this.promise = new Promise(function(t3) {
                  return function(e3, n3) {
                    return t3.performing = true, t3.perform(function(i, o) {
                      return t3.succeeded = i, t3.performing = false, t3.performed = true, t3.succeeded ? e3(o) : n3(o);
                    });
                  };
                }(this));
              }, n2.prototype.perform = function(t3) {
                return t3(false);
              }, n2.prototype.release = function() {
                var t3;
                return (t3 = this.promise) != null && typeof t3.cancel == "function" && t3.cancel(), this.promise = null, this.performing = null, this.performed = null, this.succeeded = null;
              }, n2.proxyMethod("getPromise().then"), n2.proxyMethod("getPromise().catch"), n2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r, s = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                a.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, a = {}.hasOwnProperty;
            e.UTF16String = function(t3) {
              function e2(t4, e3) {
                this.ucs2String = t4, this.codepoints = e3, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
              }
              return s(e2, t3), e2.box = function(t4) {
                return t4 == null && (t4 = ""), t4 instanceof this ? t4 : this.fromUCS2String(t4 != null ? t4.toString() : void 0);
              }, e2.fromUCS2String = function(t4) {
                return new this(t4, o(t4));
              }, e2.fromCodepoints = function(t4) {
                return new this(r(t4), t4);
              }, e2.prototype.offsetToUCS2Offset = function(t4) {
                return r(this.codepoints.slice(0, Math.max(0, t4))).length;
              }, e2.prototype.offsetFromUCS2Offset = function(t4) {
                return o(this.ucs2String.slice(0, Math.max(0, t4))).length;
              }, e2.prototype.slice = function() {
                var t4;
                return this.constructor.fromCodepoints((t4 = this.codepoints).slice.apply(t4, arguments));
              }, e2.prototype.charAt = function(t4) {
                return this.slice(t4, t4 + 1);
              }, e2.prototype.isEqualTo = function(t4) {
                return this.constructor.box(t4).ucs2String === this.ucs2String;
              }, e2.prototype.toJSON = function() {
                return this.ucs2String;
              }, e2.prototype.getCacheKey = function() {
                return this.ucs2String;
              }, e2.prototype.toString = function() {
                return this.ucs2String;
              }, e2;
            }(e.BasicObject), t2 = (typeof Array.from == "function" ? Array.from("\u{1F47C}").length : void 0) === 1, n = (typeof " ".codePointAt == "function" ? " ".codePointAt(0) : void 0) != null, i = (typeof String.fromCodePoint == "function" ? String.fromCodePoint(32, 128124) : void 0) === " \u{1F47C}", o = t2 && n ? function(t3) {
              return Array.from(t3).map(function(t4) {
                return t4.codePointAt(0);
              });
            } : function(t3) {
              var e2, n2, i2, o2, r2;
              for (o2 = [], e2 = 0, i2 = t3.length; i2 > e2; )
                r2 = t3.charCodeAt(e2++), r2 >= 55296 && 56319 >= r2 && i2 > e2 && (n2 = t3.charCodeAt(e2++), (64512 & n2) === 56320 ? r2 = ((1023 & r2) << 10) + (1023 & n2) + 65536 : e2--), o2.push(r2);
              return o2;
            }, r = i ? function(t3) {
              return String.fromCodePoint.apply(String, t3);
            } : function(t3) {
              var e2, n2, i2;
              return e2 = function() {
                var e3, o2, r2;
                for (r2 = [], e3 = 0, o2 = t3.length; o2 > e3; e3++)
                  i2 = t3[e3], n2 = "", i2 > 65535 && (i2 -= 65536, n2 += String.fromCharCode(i2 >>> 10 & 1023 | 55296), i2 = 56320 | 1023 & i2), r2.push(n2 + String.fromCharCode(i2));
                return r2;
              }(), e2.join("");
            };
          }.call(this), function() {
          }.call(this), function() {
          }.call(this), function() {
            e.config.lang = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", "byte": "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption\u2026", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL\u2026", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
          }.call(this), function() {
            e.config.css = { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" };
          }.call(this), function() {
            var t2;
            e.config.blockAttributes = t2 = { "default": { tagName: "div", parse: false }, quote: { tagName: "blockquote", nestable: true }, heading1: { tagName: "h1", terminal: true, breakOnReturn: true, group: false }, code: { tagName: "pre", terminal: true, text: { plaintext: true } }, bulletList: { tagName: "ul", parse: false }, bullet: { tagName: "li", listAttribute: "bulletList", group: false, nestable: true, test: function(n) {
              return e.tagName(n.parentNode) === t2[this.listAttribute].tagName;
            } }, numberList: { tagName: "ol", parse: false }, number: { tagName: "li", listAttribute: "numberList", group: false, nestable: true, test: function(n) {
              return e.tagName(n.parentNode) === t2[this.listAttribute].tagName;
            } }, attachmentGallery: { tagName: "div", exclusive: true, terminal: true, parse: false, group: false } };
          }.call(this), function() {
            var t2, n;
            t2 = e.config.lang, n = [t2.bytes, t2.KB, t2.MB, t2.GB, t2.TB, t2.PB], e.config.fileSize = { prefix: "IEC", precision: 2, formatter: function(e2) {
              var i, o, r, s, a;
              switch (e2) {
                case 0:
                  return "0 " + t2.bytes;
                case 1:
                  return "1 " + t2.byte;
                default:
                  return i = function() {
                    switch (this.prefix) {
                      case "SI":
                        return 1e3;
                      case "IEC":
                        return 1024;
                    }
                  }.call(this), o = Math.floor(Math.log(e2) / Math.log(i)), r = e2 / Math.pow(i, o), s = r.toFixed(this.precision), a = s.replace(/0*$/, "").replace(/\.$/, ""), a + " " + n[o];
              }
            } };
          }.call(this), function() {
            e.config.textAttributes = { bold: { tagName: "strong", inheritable: true, parser: function(t2) {
              var e2;
              return e2 = window.getComputedStyle(t2), e2.fontWeight === "bold" || e2.fontWeight >= 600;
            } }, italic: { tagName: "em", inheritable: true, parser: function(t2) {
              var e2;
              return e2 = window.getComputedStyle(t2), e2.fontStyle === "italic";
            } }, href: { groupTagName: "a", parser: function(t2) {
              var n, i, o;
              return n = e.AttachmentView.attachmentSelector, o = "a:not(" + n + ")", (i = e.findClosestElementFromNode(t2, { matchingSelector: o })) ? i.getAttribute("href") : void 0;
            } }, strike: { tagName: "del", inheritable: true }, frozen: { style: { backgroundColor: "highlight" } } };
          }.call(this), function() {
            var t2, n, i, o, r;
            r = "[data-trix-serialize=false]", o = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], n = "data-trix-serialized-attributes", i = "[" + n + "]", t2 = new RegExp("<!--block-->", "g"), e.extend({ serializers: { "application/json": function(t3) {
              var n2;
              if (t3 instanceof e.Document)
                n2 = t3;
              else {
                if (!(t3 instanceof HTMLElement))
                  throw new Error("unserializable object");
                n2 = e.Document.fromHTML(t3.innerHTML);
              }
              return n2.toSerializableDocument().toJSONString();
            }, "text/html": function(s) {
              var a, u, c, l, h, p, d, f, g, m, v, y, b, A, C, x, w;
              if (s instanceof e.Document)
                l = e.DocumentView.render(s);
              else {
                if (!(s instanceof HTMLElement))
                  throw new Error("unserializable object");
                l = s.cloneNode(true);
              }
              for (A = l.querySelectorAll(r), h = 0, g = A.length; g > h; h++)
                c = A[h], e.removeNode(c);
              for (p = 0, m = o.length; m > p; p++)
                for (a = o[p], C = l.querySelectorAll("[" + a + "]"), d = 0, v = C.length; v > d; d++)
                  c = C[d], c.removeAttribute(a);
              for (x = l.querySelectorAll(i), f = 0, y = x.length; y > f; f++) {
                c = x[f];
                try {
                  u = JSON.parse(c.getAttribute(n)), c.removeAttribute(n);
                  for (b in u)
                    w = u[b], c.setAttribute(b, w);
                } catch (E) {
                }
              }
              return l.innerHTML.replace(t2, "");
            } }, deserializers: { "application/json": function(t3) {
              return e.Document.fromJSONString(t3);
            }, "text/html": function(t3) {
              return e.Document.fromHTML(t3);
            } }, serializeToContentType: function(t3, n2) {
              var i2;
              if (i2 = e.serializers[n2])
                return i2(t3);
              throw new Error("unknown content type: " + n2);
            }, deserializeFromContentType: function(t3, n2) {
              var i2;
              if (i2 = e.deserializers[n2])
                return i2(t3);
              throw new Error("unknown content type: " + n2);
            } });
          }.call(this), function() {
            var t2;
            t2 = e.config.lang, e.config.toolbar = { getDefaultHTML: function() {
              return '<div class="trix-button-row">\n  <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="' + t2.bold + '" tabindex="-1">' + t2.bold + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="' + t2.italic + '" tabindex="-1">' + t2.italic + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="' + t2.strike + '" tabindex="-1">' + t2.strike + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="' + t2.link + '" tabindex="-1">' + t2.link + '</button>\n  </span>\n\n  <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="' + t2.heading1 + '" tabindex="-1">' + t2.heading1 + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="' + t2.quote + '" tabindex="-1">' + t2.quote + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="' + t2.code + '" tabindex="-1">' + t2.code + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="' + t2.bullets + '" tabindex="-1">' + t2.bullets + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="' + t2.numbers + '" tabindex="-1">' + t2.numbers + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="' + t2.outdent + '" tabindex="-1">' + t2.outdent + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="' + t2.indent + '" tabindex="-1">' + t2.indent + '</button>\n  </span>\n\n  <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="' + t2.attachFiles + '" tabindex="-1">' + t2.attachFiles + '</button>\n  </span>\n\n  <span class="trix-button-group-spacer"></span>\n\n  <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="' + t2.undo + '" tabindex="-1">' + t2.undo + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="' + t2.redo + '" tabindex="-1">' + t2.redo + '</button>\n  </span>\n</div>\n\n<div class="trix-dialogs" data-trix-dialogs>\n  <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">\n    <div class="trix-dialog__link-fields">\n      <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="' + t2.urlPlaceholder + '" aria-label="' + t2.url + '" required data-trix-input>\n      <div class="trix-button-group">\n        <input type="button" class="trix-button trix-button--dialog" value="' + t2.link + '" data-trix-method="setAttribute">\n        <input type="button" class="trix-button trix-button--dialog" value="' + t2.unlink + '" data-trix-method="removeAttribute">\n      </div>\n    </div>\n  </div>\n</div>';
            } };
          }.call(this), function() {
            e.config.undoInterval = 5e3;
          }.call(this), function() {
            e.config.attachments = { preview: { presentation: "gallery", caption: { name: true, size: true } }, file: { caption: { size: true } } };
          }.call(this), function() {
            e.config.keyNames = { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" };
          }.call(this), function() {
            e.config.input = { level2Enabled: true, getLevel: function() {
              return this.level2Enabled && e.browser.supportsInputEvents ? 2 : 0;
            }, pickFiles: function(t2) {
              var n;
              return n = e.makeElement("input", { type: "file", multiple: true, hidden: true, id: this.fileInputId }), n.addEventListener("change", function() {
                return t2(n.files), e.removeNode(n);
              }), e.removeNode(document.getElementById(this.fileInputId)), document.body.appendChild(n), n.click();
            }, fileInputId: "trix-file-input-" + Date.now().toString(16) };
          }.call(this), function() {
          }.call(this), function() {
            e.registerElement("trix-toolbar", { defaultCSS: "%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}", initialize: function() {
              return this.innerHTML === "" ? this.innerHTML = e.config.toolbar.getDefaultHTML() : void 0;
            } });
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i2() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i2.prototype = e2.prototype, t3.prototype = new i2(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty, i = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            e.ObjectView = function(n2) {
              function o(t3, e2) {
                this.object = t3, this.options = e2 != null ? e2 : {}, this.childViews = [], this.rootView = this;
              }
              return t2(o, n2), o.prototype.getNodes = function() {
                var t3, e2, n3, i2, o2;
                for (this.nodes == null && (this.nodes = this.createNodes()), i2 = this.nodes, o2 = [], t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  n3 = i2[t3], o2.push(n3.cloneNode(true));
                return o2;
              }, o.prototype.invalidate = function() {
                var t3;
                return this.nodes = null, this.childViews = [], (t3 = this.parentView) != null ? t3.invalidate() : void 0;
              }, o.prototype.invalidateViewForObject = function(t3) {
                var e2;
                return (e2 = this.findViewForObject(t3)) != null ? e2.invalidate() : void 0;
              }, o.prototype.findOrCreateCachedChildView = function(t3, e2) {
                var n3;
                return (n3 = this.getCachedViewForObject(e2)) ? this.recordChildView(n3) : (n3 = this.createChildView.apply(this, arguments), this.cacheViewForObject(n3, e2)), n3;
              }, o.prototype.createChildView = function(t3, n3, i2) {
                var o2;
                return i2 == null && (i2 = {}), n3 instanceof e.ObjectGroup && (i2.viewClass = t3, t3 = e.ObjectGroupView), o2 = new t3(n3, i2), this.recordChildView(o2);
              }, o.prototype.recordChildView = function(t3) {
                return t3.parentView = this, t3.rootView = this.rootView, this.childViews.push(t3), t3;
              }, o.prototype.getAllChildViews = function() {
                var t3, e2, n3, i2, o2;
                for (o2 = [], i2 = this.childViews, e2 = 0, n3 = i2.length; n3 > e2; e2++)
                  t3 = i2[e2], o2.push(t3), o2 = o2.concat(t3.getAllChildViews());
                return o2;
              }, o.prototype.findElement = function() {
                return this.findElementForObject(this.object);
              }, o.prototype.findElementForObject = function(t3) {
                var e2;
                return (e2 = t3 != null ? t3.id : void 0) ? this.rootView.element.querySelector("[data-trix-id='" + e2 + "']") : void 0;
              }, o.prototype.findViewForObject = function(t3) {
                var e2, n3, i2, o2;
                for (i2 = this.getAllChildViews(), e2 = 0, n3 = i2.length; n3 > e2; e2++)
                  if (o2 = i2[e2], o2.object === t3)
                    return o2;
              }, o.prototype.getViewCache = function() {
                return this.rootView !== this ? this.rootView.getViewCache() : this.isViewCachingEnabled() ? this.viewCache != null ? this.viewCache : this.viewCache = {} : void 0;
              }, o.prototype.isViewCachingEnabled = function() {
                return this.shouldCacheViews !== false;
              }, o.prototype.enableViewCaching = function() {
                return this.shouldCacheViews = true;
              }, o.prototype.disableViewCaching = function() {
                return this.shouldCacheViews = false;
              }, o.prototype.getCachedViewForObject = function(t3) {
                var e2;
                return (e2 = this.getViewCache()) != null ? e2[t3.getCacheKey()] : void 0;
              }, o.prototype.cacheViewForObject = function(t3, e2) {
                var n3;
                return (n3 = this.getViewCache()) != null ? n3[e2.getCacheKey()] = t3 : void 0;
              }, o.prototype.garbageCollectCachedViews = function() {
                var t3, e2, n3, o2, r, s;
                if (t3 = this.getViewCache()) {
                  s = this.getAllChildViews().concat(this), n3 = function() {
                    var t4, e3, n4;
                    for (n4 = [], t4 = 0, e3 = s.length; e3 > t4; t4++)
                      r = s[t4], n4.push(r.object.getCacheKey());
                    return n4;
                  }(), o2 = [];
                  for (e2 in t3)
                    i.call(n3, e2) < 0 && o2.push(delete t3[e2]);
                  return o2;
                }
              }, o;
            }(e.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.ObjectGroupView = function(e2) {
              function n2() {
                n2.__super__.constructor.apply(this, arguments), this.objectGroup = this.object, this.viewClass = this.options.viewClass, delete this.options.viewClass;
              }
              return t2(n2, e2), n2.prototype.getChildViews = function() {
                var t3, e3, n3, i;
                if (!this.childViews.length)
                  for (i = this.objectGroup.getObjects(), t3 = 0, e3 = i.length; e3 > t3; t3++)
                    n3 = i[t3], this.findOrCreateCachedChildView(this.viewClass, n3, this.options);
                return this.childViews;
              }, n2.prototype.createNodes = function() {
                var t3, e3, n3, i, o, r, s, a, u;
                for (t3 = this.createContainerElement(), s = this.getChildViews(), e3 = 0, i = s.length; i > e3; e3++)
                  for (u = s[e3], a = u.getNodes(), n3 = 0, o = a.length; o > n3; n3++)
                    r = a[n3], t3.appendChild(r);
                return [t3];
              }, n2.prototype.createContainerElement = function(t3) {
                return t3 == null && (t3 = this.objectGroup.getDepth()), this.getChildViews()[0].createContainerElement(t3);
              }, n2;
            }(e.ObjectView);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Controller = function(e2) {
              function n2() {
                return n2.__super__.constructor.apply(this, arguments);
              }
              return t2(n2, e2), n2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r, s, a = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, u = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                c.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, c = {}.hasOwnProperty, l = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = e.findClosestElementFromNode, i = e.nodeIsEmptyTextNode, n = e.nodeIsBlockStartComment, o = e.normalizeSpaces, r = e.summarizeStringChange, s = e.tagName, e.MutationObserver = function(e2) {
              function c2(t3) {
                this.element = t3, this.didMutate = a(this.didMutate, this), this.observer = new window.MutationObserver(this.didMutate), this.start();
              }
              var h, p, d, f;
              return u(c2, e2), p = "data-trix-mutable", d = "[" + p + "]", f = { attributes: true, childList: true, characterData: true, characterDataOldValue: true, subtree: true }, c2.prototype.start = function() {
                return this.reset(), this.observer.observe(this.element, f);
              }, c2.prototype.stop = function() {
                return this.observer.disconnect();
              }, c2.prototype.didMutate = function(t3) {
                var e3, n2;
                return (e3 = this.mutations).push.apply(e3, this.findSignificantMutations(t3)), this.mutations.length ? ((n2 = this.delegate) != null && typeof n2.elementDidMutate == "function" && n2.elementDidMutate(this.getMutationSummary()), this.reset()) : void 0;
              }, c2.prototype.reset = function() {
                return this.mutations = [];
              }, c2.prototype.findSignificantMutations = function(t3) {
                var e3, n2, i2, o2;
                for (o2 = [], e3 = 0, n2 = t3.length; n2 > e3; e3++)
                  i2 = t3[e3], this.mutationIsSignificant(i2) && o2.push(i2);
                return o2;
              }, c2.prototype.mutationIsSignificant = function(t3) {
                var e3, n2, i2, o2;
                if (this.nodeIsMutable(t3.target))
                  return false;
                for (o2 = this.nodesModifiedByMutation(t3), e3 = 0, n2 = o2.length; n2 > e3; e3++)
                  if (i2 = o2[e3], this.nodeIsSignificant(i2))
                    return true;
                return false;
              }, c2.prototype.nodeIsSignificant = function(t3) {
                return t3 !== this.element && !this.nodeIsMutable(t3) && !i(t3);
              }, c2.prototype.nodeIsMutable = function(e3) {
                return t2(e3, { matchingSelector: d });
              }, c2.prototype.nodesModifiedByMutation = function(t3) {
                var e3;
                switch (e3 = [], t3.type) {
                  case "attributes":
                    t3.attributeName !== p && e3.push(t3.target);
                    break;
                  case "characterData":
                    e3.push(t3.target.parentNode), e3.push(t3.target);
                    break;
                  case "childList":
                    e3.push.apply(e3, t3.addedNodes), e3.push.apply(e3, t3.removedNodes);
                }
                return e3;
              }, c2.prototype.getMutationSummary = function() {
                return this.getTextMutationSummary();
              }, c2.prototype.getTextMutationSummary = function() {
                var t3, e3, n2, i2, o2, r2, s2, a2, u2, c3, h2;
                for (a2 = this.getTextChangesFromCharacterData(), n2 = a2.additions, o2 = a2.deletions, h2 = this.getTextChangesFromChildList(), u2 = h2.additions, r2 = 0, s2 = u2.length; s2 > r2; r2++)
                  e3 = u2[r2], l.call(n2, e3) < 0 && n2.push(e3);
                return o2.push.apply(o2, h2.deletions), c3 = {}, (t3 = n2.join("")) && (c3.textAdded = t3), (i2 = o2.join("")) && (c3.textDeleted = i2), c3;
              }, c2.prototype.getMutationsByType = function(t3) {
                var e3, n2, i2, o2, r2;
                for (o2 = this.mutations, r2 = [], e3 = 0, n2 = o2.length; n2 > e3; e3++)
                  i2 = o2[e3], i2.type === t3 && r2.push(i2);
                return r2;
              }, c2.prototype.getTextChangesFromChildList = function() {
                var t3, e3, i2, r2, s2, a2, u2, c3, l2, p2, d2;
                for (t3 = [], u2 = [], a2 = this.getMutationsByType("childList"), e3 = 0, r2 = a2.length; r2 > e3; e3++)
                  s2 = a2[e3], t3.push.apply(t3, s2.addedNodes), u2.push.apply(u2, s2.removedNodes);
                return c3 = t3.length === 0 && u2.length === 1 && n(u2[0]), c3 ? (p2 = [], d2 = ["\n"]) : (p2 = h(t3), d2 = h(u2)), { additions: function() {
                  var t4, e4, n2;
                  for (n2 = [], i2 = t4 = 0, e4 = p2.length; e4 > t4; i2 = ++t4)
                    l2 = p2[i2], l2 !== d2[i2] && n2.push(o(l2));
                  return n2;
                }(), deletions: function() {
                  var t4, e4, n2;
                  for (n2 = [], i2 = t4 = 0, e4 = d2.length; e4 > t4; i2 = ++t4)
                    l2 = d2[i2], l2 !== p2[i2] && n2.push(o(l2));
                  return n2;
                }() };
              }, c2.prototype.getTextChangesFromCharacterData = function() {
                var t3, e3, n2, i2, s2, a2, u2, c3;
                return e3 = this.getMutationsByType("characterData"), e3.length && (c3 = e3[0], n2 = e3[e3.length - 1], s2 = o(c3.oldValue), i2 = o(n2.target.data), a2 = r(s2, i2), t3 = a2.added, u2 = a2.removed), { additions: t3 ? [t3] : [], deletions: u2 ? [u2] : [] };
              }, h = function(t3) {
                var e3, n2, i2, o2;
                for (t3 == null && (t3 = []), o2 = [], e3 = 0, n2 = t3.length; n2 > e3; e3++)
                  switch (i2 = t3[e3], i2.nodeType) {
                    case Node.TEXT_NODE:
                      o2.push(i2.data);
                      break;
                    case Node.ELEMENT_NODE:
                      s(i2) === "br" ? o2.push("\n") : o2.push.apply(o2, h(i2.childNodes));
                  }
                return o2;
              }, c2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.FileVerificationOperation = function(e2) {
              function n2(t3) {
                this.file = t3;
              }
              return t2(n2, e2), n2.prototype.perform = function(t3) {
                var e3;
                return e3 = new FileReader(), e3.onerror = function() {
                  return t3(false);
                }, e3.onload = function(n3) {
                  return function() {
                    e3.onerror = null;
                    try {
                      e3.abort();
                    } catch (i) {
                    }
                    return t3(true, n3.file);
                  };
                }(this), e3.readAsArrayBuffer(this.file);
              }, n2;
            }(e.Operation);
          }.call(this), function() {
            var t2, n, i = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                o.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, o = {}.hasOwnProperty;
            t2 = e.handleEvent, n = e.innerElementIsActive, e.InputController = function(o2) {
              function r(n2) {
                var i2;
                this.element = n2, this.mutationObserver = new e.MutationObserver(this.element), this.mutationObserver.delegate = this;
                for (i2 in this.events)
                  t2(i2, { onElement: this.element, withCallback: this.handlerFor(i2) });
              }
              return i(r, o2), r.prototype.events = {}, r.prototype.elementDidMutate = function() {
              }, r.prototype.editorWillSyncDocumentView = function() {
                return this.mutationObserver.stop();
              }, r.prototype.editorDidSyncDocumentView = function() {
                return this.mutationObserver.start();
              }, r.prototype.requestRender = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidRequestRender == "function" ? t3.inputControllerDidRequestRender() : void 0;
              }, r.prototype.requestReparse = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidRequestReparse == "function" && t3.inputControllerDidRequestReparse(), this.requestRender();
              }, r.prototype.attachFiles = function(t3) {
                var n2, i2;
                return i2 = function() {
                  var i3, o3, r2;
                  for (r2 = [], i3 = 0, o3 = t3.length; o3 > i3; i3++)
                    n2 = t3[i3], r2.push(new e.FileVerificationOperation(n2));
                  return r2;
                }(), Promise.all(i2).then(function(t4) {
                  return function(e2) {
                    return t4.handleInput(function() {
                      var t5, n3;
                      return (t5 = this.delegate) != null && t5.inputControllerWillAttachFiles(), (n3 = this.responder) != null && n3.insertFiles(e2), this.requestRender();
                    });
                  };
                }(this));
              }, r.prototype.handlerFor = function(t3) {
                return function(e2) {
                  return function(i2) {
                    return i2.defaultPrevented ? void 0 : e2.handleInput(function() {
                      return n(this.element) ? void 0 : (this.eventName = t3, this.events[t3].call(this, i2));
                    });
                  };
                }(this);
              }, r.prototype.handleInput = function(t3) {
                var e2, n2;
                try {
                  return (e2 = this.delegate) != null && e2.inputControllerWillHandleInput(), t3.call(this);
                } finally {
                  (n2 = this.delegate) != null && n2.inputControllerDidHandleInput();
                }
              }, r.prototype.createLinkHTML = function(t3, e2) {
                var n2;
                return n2 = document.createElement("a"), n2.href = t3, n2.textContent = e2 != null ? e2 : t3, n2.outerHTML;
              }, r;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c, l, h, p, d, f = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                g.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, g = {}.hasOwnProperty, m = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            c = e.makeElement, l = e.objectsAreEqual, d = e.tagName, n = e.browser, a = e.keyEventIsKeyboardCommand, o = e.dataTransferIsWritable, i = e.dataTransferIsPlainText, u = e.config.keyNames, e.Level0InputController = function(n2) {
              function s2() {
                s2.__super__.constructor.apply(this, arguments), this.resetInputSummary();
              }
              var d2;
              return f(s2, n2), d2 = 0, s2.prototype.setInputSummary = function(t3) {
                var e2, n3;
                t3 == null && (t3 = {}), this.inputSummary.eventName = this.eventName;
                for (e2 in t3)
                  n3 = t3[e2], this.inputSummary[e2] = n3;
                return this.inputSummary;
              }, s2.prototype.resetInputSummary = function() {
                return this.inputSummary = {};
              }, s2.prototype.reset = function() {
                return this.resetInputSummary(), e.selectionChangeObserver.reset();
              }, s2.prototype.elementDidMutate = function(t3) {
                var e2;
                return this.isComposing() ? (e2 = this.delegate) != null && typeof e2.inputControllerDidAllowUnhandledInput == "function" ? e2.inputControllerDidAllowUnhandledInput() : void 0 : this.handleInput(function() {
                  return this.mutationIsSignificant(t3) && (this.mutationIsExpected(t3) ? this.requestRender() : this.requestReparse()), this.reset();
                });
              }, s2.prototype.mutationIsExpected = function(t3) {
                var e2, n3, i2, o2, r2, s3, a2, u2, c2, l2;
                return a2 = t3.textAdded, u2 = t3.textDeleted, this.inputSummary.preferDocument ? true : (e2 = a2 != null ? a2 === this.inputSummary.textAdded : !this.inputSummary.textAdded, n3 = u2 != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, c2 = (a2 === "\n" || a2 === " \n") && !e2, l2 = u2 === "\n" && !n3, s3 = c2 && !l2 || l2 && !c2, s3 && (o2 = this.getSelectedRange()) && (i2 = c2 ? a2.replace(/\n$/, "").length || -1 : (a2 != null ? a2.length : void 0) || 1, (r2 = this.responder) != null ? r2.positionIsBlockBreak(o2[1] + i2) : void 0) ? true : e2 && n3);
              }, s2.prototype.mutationIsSignificant = function(t3) {
                var e2, n3, i2;
                return i2 = Object.keys(t3).length > 0, e2 = ((n3 = this.compositionInput) != null ? n3.getEndData() : void 0) === "", i2 || !e2;
              }, s2.prototype.events = { keydown: function(t3) {
                var n3, i2, o2, r2, s3, c2, l2, h2, p2;
                if (this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = true, r2 = u[t3.keyCode]) {
                  for (i2 = this.keys, h2 = ["ctrl", "alt", "shift", "meta"], o2 = 0, c2 = h2.length; c2 > o2; o2++)
                    l2 = h2[o2], t3[l2 + "Key"] && (l2 === "ctrl" && (l2 = "control"), i2 = i2 != null ? i2[l2] : void 0);
                  (i2 != null ? i2[r2] : void 0) != null && (this.setInputSummary({ keyName: r2 }), e.selectionChangeObserver.reset(), i2[r2].call(this, t3));
                }
                return a(t3) && (n3 = String.fromCharCode(t3.keyCode).toLowerCase()) && (s3 = function() {
                  var e2, n4, i3, o3;
                  for (i3 = ["alt", "shift"], o3 = [], e2 = 0, n4 = i3.length; n4 > e2; e2++)
                    l2 = i3[e2], t3[l2 + "Key"] && o3.push(l2);
                  return o3;
                }(), s3.push(n3), (p2 = this.delegate) != null ? p2.inputControllerDidReceiveKeyboardCommand(s3) : void 0) ? t3.preventDefault() : void 0;
              }, keypress: function(t3) {
                var e2, n3, i2;
                if (this.inputSummary.eventName == null && !t3.metaKey && (!t3.ctrlKey || t3.altKey))
                  return (i2 = p(t3)) ? ((e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), (n3 = this.responder) != null && n3.insertString(i2), this.setInputSummary({ textAdded: i2, didDelete: this.selectionIsExpanded() })) : void 0;
              }, textInput: function(t3) {
                var e2, n3, i2, o2;
                return e2 = t3.data, o2 = this.inputSummary.textAdded, o2 && o2 !== e2 && o2.toUpperCase() === e2 ? (n3 = this.getSelectedRange(), this.setSelectedRange([n3[0], n3[1] + o2.length]), (i2 = this.responder) != null && i2.insertString(e2), this.setInputSummary({ textAdded: e2 }), this.setSelectedRange(n3)) : void 0;
              }, dragenter: function(t3) {
                return t3.preventDefault();
              }, dragstart: function(t3) {
                var e2, n3;
                return n3 = t3.target, this.serializeSelectionToDataTransfer(t3.dataTransfer), this.draggedRange = this.getSelectedRange(), (e2 = this.delegate) != null && typeof e2.inputControllerDidStartDrag == "function" ? e2.inputControllerDidStartDrag() : void 0;
              }, dragover: function(t3) {
                var e2, n3;
                return !this.draggedRange && !this.canAcceptDataTransfer(t3.dataTransfer) || (t3.preventDefault(), e2 = { x: t3.clientX, y: t3.clientY }, l(e2, this.draggingPoint)) ? void 0 : (this.draggingPoint = e2, (n3 = this.delegate) != null && typeof n3.inputControllerDidReceiveDragOverPoint == "function" ? n3.inputControllerDidReceiveDragOverPoint(this.draggingPoint) : void 0);
              }, dragend: function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidCancelDrag == "function" && t3.inputControllerDidCancelDrag(), this.draggedRange = null, this.draggingPoint = null;
              }, drop: function(t3) {
                var n3, i2, o2, r2, s3, a2, u2, c2, l2;
                return t3.preventDefault(), o2 = (s3 = t3.dataTransfer) != null ? s3.files : void 0, r2 = { x: t3.clientX, y: t3.clientY }, (a2 = this.responder) != null && a2.setLocationRangeFromPointRange(r2), (o2 != null ? o2.length : void 0) ? this.attachFiles(o2) : this.draggedRange ? ((u2 = this.delegate) != null && u2.inputControllerWillMoveText(), (c2 = this.responder) != null && c2.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender()) : (i2 = t3.dataTransfer.getData("application/x-trix-document")) && (n3 = e.Document.fromJSONString(i2), (l2 = this.responder) != null && l2.insertDocument(n3), this.requestRender()), this.draggedRange = null, this.draggingPoint = null;
              }, cut: function(t3) {
                var e2, n3;
                return ((e2 = this.responder) != null ? e2.selectionIsExpanded() : void 0) && (this.serializeSelectionToDataTransfer(t3.clipboardData) && t3.preventDefault(), (n3 = this.delegate) != null && n3.inputControllerWillCutText(), this.deleteInDirection("backward"), t3.defaultPrevented) ? this.requestRender() : void 0;
              }, copy: function(t3) {
                var e2;
                return ((e2 = this.responder) != null ? e2.selectionIsExpanded() : void 0) && this.serializeSelectionToDataTransfer(t3.clipboardData) ? t3.preventDefault() : void 0;
              }, paste: function(t3) {
                var n3, o2, s3, a2, u2, c2, l2, p2, f2, g2, v, y, b, A, C, x, w, E, S, R, k, D, L;
                return n3 = (p2 = t3.clipboardData) != null ? p2 : t3.testClipboardData, l2 = { clipboard: n3 }, n3 == null || h(t3) ? void this.getPastedHTMLUsingHiddenElement(function(t4) {
                  return function(e2) {
                    var n4, i2, o3;
                    return l2.type = "text/html", l2.html = e2, (n4 = t4.delegate) != null && n4.inputControllerWillPaste(l2), (i2 = t4.responder) != null && i2.insertHTML(l2.html), t4.requestRender(), (o3 = t4.delegate) != null ? o3.inputControllerDidPaste(l2) : void 0;
                  };
                }(this)) : ((a2 = n3.getData("URL")) ? (l2.type = "text/html", L = (c2 = n3.getData("public.url-name")) ? e.squishBreakableWhitespace(c2).trim() : a2, l2.html = this.createLinkHTML(a2, L), (f2 = this.delegate) != null && f2.inputControllerWillPaste(l2), this.setInputSummary({ textAdded: L, didDelete: this.selectionIsExpanded() }), (C = this.responder) != null && C.insertHTML(l2.html), this.requestRender(), (x = this.delegate) != null && x.inputControllerDidPaste(l2)) : i(n3) ? (l2.type = "text/plain", l2.string = n3.getData("text/plain"), (w = this.delegate) != null && w.inputControllerWillPaste(l2), this.setInputSummary({ textAdded: l2.string, didDelete: this.selectionIsExpanded() }), (E = this.responder) != null && E.insertString(l2.string), this.requestRender(), (S = this.delegate) != null && S.inputControllerDidPaste(l2)) : (u2 = n3.getData("text/html")) ? (l2.type = "text/html", l2.html = u2, (R = this.delegate) != null && R.inputControllerWillPaste(l2), (k = this.responder) != null && k.insertHTML(l2.html), this.requestRender(), (D = this.delegate) != null && D.inputControllerDidPaste(l2)) : m.call(n3.types, "Files") >= 0 && (s3 = (g2 = n3.items) != null && (v = g2[0]) != null && typeof v.getAsFile == "function" ? v.getAsFile() : void 0) && (!s3.name && (o2 = r(s3)) && (s3.name = "pasted-file-" + ++d2 + "." + o2), l2.type = "File", l2.file = s3, (y = this.delegate) != null && y.inputControllerWillAttachFiles(), (b = this.responder) != null && b.insertFile(l2.file), this.requestRender(), (A = this.delegate) != null && A.inputControllerDidPaste(l2)), t3.preventDefault());
              }, compositionstart: function(t3) {
                return this.getCompositionInput().start(t3.data);
              }, compositionupdate: function(t3) {
                return this.getCompositionInput().update(t3.data);
              }, compositionend: function(t3) {
                return this.getCompositionInput().end(t3.data);
              }, beforeinput: function() {
                return this.inputSummary.didInput = true;
              }, input: function(t3) {
                return this.inputSummary.didInput = true, t3.stopPropagation();
              } }, s2.prototype.keys = { backspace: function(t3) {
                var e2;
                return (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
              }, "delete": function(t3) {
                var e2;
                return (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
              }, "return": function() {
                var t3, e2;
                return this.setInputSummary({ preferDocument: true }), (t3 = this.delegate) != null && t3.inputControllerWillPerformTyping(), (e2 = this.responder) != null ? e2.insertLineBreak() : void 0;
              }, tab: function(t3) {
                var e2, n3;
                return ((e2 = this.responder) != null ? e2.canIncreaseNestingLevel() : void 0) ? ((n3 = this.responder) != null && n3.increaseNestingLevel(), this.requestRender(), t3.preventDefault()) : void 0;
              }, left: function(t3) {
                var e2;
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), (e2 = this.responder) != null ? e2.moveCursorInDirection("backward") : void 0) : void 0;
              }, right: function(t3) {
                var e2;
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), (e2 = this.responder) != null ? e2.moveCursorInDirection("forward") : void 0) : void 0;
              }, control: { d: function(t3) {
                var e2;
                return (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
              }, h: function(t3) {
                var e2;
                return (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
              }, o: function(t3) {
                var e2, n3;
                return t3.preventDefault(), (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), (n3 = this.responder) != null && n3.insertString("\n", { updatePosition: false }), this.requestRender();
              } }, shift: { "return": function(t3) {
                var e2, n3;
                return (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), (n3 = this.responder) != null && n3.insertString("\n"), this.requestRender(), t3.preventDefault();
              }, tab: function(t3) {
                var e2, n3;
                return ((e2 = this.responder) != null ? e2.canDecreaseNestingLevel() : void 0) ? ((n3 = this.responder) != null && n3.decreaseNestingLevel(), this.requestRender(), t3.preventDefault()) : void 0;
              }, left: function(t3) {
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), this.expandSelectionInDirection("backward")) : void 0;
              }, right: function(t3) {
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), this.expandSelectionInDirection("forward")) : void 0;
              } }, alt: { backspace: function() {
                var t3;
                return this.setInputSummary({ preferDocument: false }), (t3 = this.delegate) != null ? t3.inputControllerWillPerformTyping() : void 0;
              } }, meta: { backspace: function() {
                var t3;
                return this.setInputSummary({ preferDocument: false }), (t3 = this.delegate) != null ? t3.inputControllerWillPerformTyping() : void 0;
              } } }, s2.prototype.getCompositionInput = function() {
                return this.isComposing() ? this.compositionInput : this.compositionInput = new t2(this);
              }, s2.prototype.isComposing = function() {
                return this.compositionInput != null && !this.compositionInput.isEnded();
              }, s2.prototype.deleteInDirection = function(t3, e2) {
                var n3;
                return ((n3 = this.responder) != null ? n3.deleteInDirection(t3) : void 0) !== false ? this.setInputSummary({ didDelete: true }) : e2 ? (e2.preventDefault(), this.requestRender()) : void 0;
              }, s2.prototype.serializeSelectionToDataTransfer = function(t3) {
                var n3, i2;
                if (o(t3))
                  return n3 = (i2 = this.responder) != null ? i2.getSelectedDocument().toSerializableDocument() : void 0, t3.setData("application/x-trix-document", JSON.stringify(n3)), t3.setData("text/html", e.DocumentView.render(n3).innerHTML), t3.setData("text/plain", n3.toString().replace(/\n$/, "")), true;
              }, s2.prototype.canAcceptDataTransfer = function(t3) {
                var e2, n3, i2, o2, r2, s3;
                for (s3 = {}, o2 = (i2 = t3 != null ? t3.types : void 0) != null ? i2 : [], e2 = 0, n3 = o2.length; n3 > e2; e2++)
                  r2 = o2[e2], s3[r2] = true;
                return s3.Files || s3["application/x-trix-document"] || s3["text/html"] || s3["text/plain"];
              }, s2.prototype.getPastedHTMLUsingHiddenElement = function(t3) {
                var n3, i2, o2;
                return i2 = this.getSelectedRange(), o2 = { position: "absolute", left: window.pageXOffset + "px", top: window.pageYOffset + "px", opacity: 0 }, n3 = c({ style: o2, tagName: "div", editable: true }), document.body.appendChild(n3), n3.focus(), requestAnimationFrame(function(o3) {
                  return function() {
                    var r2;
                    return r2 = n3.innerHTML, e.removeNode(n3), o3.setSelectedRange(i2), t3(r2);
                  };
                }(this));
              }, s2.proxyMethod("responder?.getSelectedRange"), s2.proxyMethod("responder?.setSelectedRange"), s2.proxyMethod("responder?.expandSelectionInDirection"), s2.proxyMethod("responder?.selectionIsInCursorTarget"), s2.proxyMethod("responder?.selectionIsExpanded"), s2;
            }(e.InputController), r = function(t3) {
              var e2, n2;
              return (e2 = t3.type) != null && (n2 = e2.match(/\/(\w+)$/)) != null ? n2[1] : void 0;
            }, s = (typeof " ".codePointAt == "function" ? " ".codePointAt(0) : void 0) != null, p = function(t3) {
              var n2;
              return t3.key && s && t3.key.codePointAt(0) === t3.keyCode ? t3.key : (t3.which === null ? n2 = t3.keyCode : t3.which !== 0 && t3.charCode !== 0 && (n2 = t3.charCode), n2 != null && u[n2] !== "escape" ? e.UTF16String.fromCodepoints([n2]).toString() : void 0);
            }, h = function(t3) {
              var e2, n2, i2, o2, r2, s2, a2, u2, c2, l2;
              if (u2 = t3.clipboardData) {
                if (m.call(u2.types, "text/html") >= 0) {
                  for (c2 = u2.types, i2 = 0, s2 = c2.length; s2 > i2; i2++)
                    if (l2 = c2[i2], e2 = /^CorePasteboardFlavorType/.test(l2), n2 = /^dyn\./.test(l2) && u2.getData(l2), a2 = e2 || n2)
                      return true;
                  return false;
                }
                return o2 = m.call(u2.types, "com.apple.webarchive") >= 0, r2 = m.call(u2.types, "com.apple.flat-rtfd") >= 0, o2 || r2;
              }
            }, t2 = function(t3) {
              function e2(t4) {
                var e3;
                this.inputController = t4, e3 = this.inputController, this.responder = e3.responder, this.delegate = e3.delegate, this.inputSummary = e3.inputSummary, this.data = {};
              }
              return f(e2, t3), e2.prototype.start = function(t4) {
                var e3, n2;
                return this.data.start = t4, this.isSignificant() ? (this.inputSummary.eventName === "keypress" && this.inputSummary.textAdded && (e3 = this.responder) != null && e3.deleteInDirection("left"), this.selectionIsExpanded() || (this.insertPlaceholder(), this.requestRender()), this.range = (n2 = this.responder) != null ? n2.getSelectedRange() : void 0) : void 0;
              }, e2.prototype.update = function(t4) {
                var e3;
                return this.data.update = t4, this.isSignificant() && (e3 = this.selectPlaceholder()) ? (this.forgetPlaceholder(), this.range = e3) : void 0;
              }, e2.prototype.end = function(t4) {
                var e3, n2, i2, o2;
                return this.data.end = t4, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: true, didInput: false }), (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), (n2 = this.responder) != null && n2.setSelectedRange(this.range), (i2 = this.responder) != null && i2.insertString(this.data.end), (o2 = this.responder) != null ? o2.setSelectedRange(this.range[0] + this.data.end.length) : void 0) : this.data.start != null || this.data.update != null ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
              }, e2.prototype.getEndData = function() {
                return this.data.end;
              }, e2.prototype.isEnded = function() {
                return this.getEndData() != null;
              }, e2.prototype.isSignificant = function() {
                return n.composesExistingText ? this.inputSummary.didInput : true;
              }, e2.prototype.canApplyToDocument = function() {
                var t4, e3;
                return ((t4 = this.data.start) != null ? t4.length : void 0) === 0 && ((e3 = this.data.end) != null ? e3.length : void 0) > 0 && this.range != null;
              }, e2.proxyMethod("inputController.setInputSummary"), e2.proxyMethod("inputController.requestRender"), e2.proxyMethod("inputController.requestReparse"), e2.proxyMethod("responder?.selectionIsExpanded"), e2.proxyMethod("responder?.insertPlaceholder"), e2.proxyMethod("responder?.selectPlaceholder"), e2.proxyMethod("responder?.forgetPlaceholder"), e2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, r = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                s.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, s = {}.hasOwnProperty, a = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = e.dataTransferIsPlainText, n = e.keyEventIsKeyboardCommand, i = e.objectsAreEqual, e.Level2InputController = function(s2) {
              function u() {
                return this.render = o(this.render, this), u.__super__.constructor.apply(this, arguments);
              }
              var c, l, h, p, d, f;
              return r(u, s2), u.prototype.elementDidMutate = function() {
                var t3;
                return this.scheduledRender ? this.composing && (t3 = this.delegate) != null && typeof t3.inputControllerDidAllowUnhandledInput == "function" ? t3.inputControllerDidAllowUnhandledInput() : void 0 : this.reparse();
              }, u.prototype.scheduleRender = function() {
                return this.scheduledRender != null ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
              }, u.prototype.render = function() {
                var t3;
                return cancelAnimationFrame(this.scheduledRender), this.scheduledRender = null, this.composing || (t3 = this.delegate) != null && t3.render(), typeof this.afterRender == "function" && this.afterRender(), this.afterRender = null;
              }, u.prototype.reparse = function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.reparse() : void 0;
              }, u.prototype.events = { keydown: function(t3) {
                var e2, i2, o2, r2;
                if (n(t3)) {
                  if (e2 = l(t3), (r2 = this.delegate) != null ? r2.inputControllerDidReceiveKeyboardCommand(e2) : void 0)
                    return t3.preventDefault();
                } else if (o2 = t3.key, t3.altKey && (o2 += "+Alt"), t3.shiftKey && (o2 += "+Shift"), i2 = this.keys[o2])
                  return this.withEvent(t3, i2);
              }, paste: function(t3) {
                var e2, n2, i2, o2, r2, s3, a2, u2, c2;
                return h(t3) ? (t3.preventDefault(), this.attachFiles(t3.clipboardData.files)) : p(t3) ? (t3.preventDefault(), n2 = { type: "text/plain", string: t3.clipboardData.getData("text/plain") }, (i2 = this.delegate) != null && i2.inputControllerWillPaste(n2), (o2 = this.responder) != null && o2.insertString(n2.string), this.render(), (r2 = this.delegate) != null ? r2.inputControllerDidPaste(n2) : void 0) : (e2 = (s3 = t3.clipboardData) != null ? s3.getData("URL") : void 0) ? (t3.preventDefault(), n2 = { type: "text/html", html: this.createLinkHTML(e2) }, (a2 = this.delegate) != null && a2.inputControllerWillPaste(n2), (u2 = this.responder) != null && u2.insertHTML(n2.html), this.render(), (c2 = this.delegate) != null ? c2.inputControllerDidPaste(n2) : void 0) : void 0;
              }, beforeinput: function(t3) {
                var e2;
                return (e2 = this.inputTypes[t3.inputType]) ? (this.withEvent(t3, e2), this.scheduleRender()) : void 0;
              }, input: function() {
                return e.selectionChangeObserver.reset();
              }, dragstart: function(t3) {
                var e2, n2;
                return ((e2 = this.responder) != null ? e2.selectionContainsAttachments() : void 0) ? (t3.dataTransfer.setData("application/x-trix-dragging", true), this.dragging = { range: (n2 = this.responder) != null ? n2.getSelectedRange() : void 0, point: d(t3) }) : void 0;
              }, dragenter: function(t3) {
                return c(t3) ? t3.preventDefault() : void 0;
              }, dragover: function(t3) {
                var e2, n2;
                if (this.dragging) {
                  if (t3.preventDefault(), e2 = d(t3), !i(e2, this.dragging.point))
                    return this.dragging.point = e2, (n2 = this.responder) != null ? n2.setLocationRangeFromPointRange(e2) : void 0;
                } else if (c(t3))
                  return t3.preventDefault();
              }, drop: function(t3) {
                var e2, n2, i2, o2;
                return this.dragging ? (t3.preventDefault(), (n2 = this.delegate) != null && n2.inputControllerWillMoveText(), (i2 = this.responder) != null && i2.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender()) : c(t3) ? (t3.preventDefault(), e2 = d(t3), (o2 = this.responder) != null && o2.setLocationRangeFromPointRange(e2), this.attachFiles(t3.dataTransfer.files)) : void 0;
              }, dragend: function() {
                var t3;
                return this.dragging ? ((t3 = this.responder) != null && t3.setSelectedRange(this.dragging.range), this.dragging = null) : void 0;
              }, compositionend: function() {
                return this.composing ? (this.composing = false, this.scheduleRender()) : void 0;
              } }, u.prototype.keys = { ArrowLeft: function() {
                var t3, e2;
                return ((t3 = this.responder) != null ? t3.shouldManageMovingCursorInDirection("backward") : void 0) ? (this.event.preventDefault(), (e2 = this.responder) != null ? e2.moveCursorInDirection("backward") : void 0) : void 0;
              }, ArrowRight: function() {
                var t3, e2;
                return ((t3 = this.responder) != null ? t3.shouldManageMovingCursorInDirection("forward") : void 0) ? (this.event.preventDefault(), (e2 = this.responder) != null ? e2.moveCursorInDirection("forward") : void 0) : void 0;
              }, Backspace: function() {
                var t3, e2, n2;
                return ((t3 = this.responder) != null ? t3.shouldManageDeletingInDirection("backward") : void 0) ? (this.event.preventDefault(), (e2 = this.delegate) != null && e2.inputControllerWillPerformTyping(), (n2 = this.responder) != null && n2.deleteInDirection("backward"), this.render()) : void 0;
              }, Tab: function() {
                var t3, e2;
                return ((t3 = this.responder) != null ? t3.canIncreaseNestingLevel() : void 0) ? (this.event.preventDefault(), (e2 = this.responder) != null && e2.increaseNestingLevel(), this.render()) : void 0;
              }, "Tab+Shift": function() {
                var t3, e2;
                return ((t3 = this.responder) != null ? t3.canDecreaseNestingLevel() : void 0) ? (this.event.preventDefault(), (e2 = this.responder) != null && e2.decreaseNestingLevel(), this.render()) : void 0;
              } }, u.prototype.inputTypes = { deleteByComposition: function() {
                return this.deleteInDirection("backward", { recordUndoEntry: false });
              }, deleteByCut: function() {
                return this.deleteInDirection("backward");
              }, deleteByDrag: function() {
                return this.event.preventDefault(), this.withTargetDOMRange(function() {
                  var t3;
                  return this.deleteByDragRange = (t3 = this.responder) != null ? t3.getSelectedRange() : void 0;
                });
              }, deleteCompositionText: function() {
                return this.deleteInDirection("backward", { recordUndoEntry: false });
              }, deleteContent: function() {
                return this.deleteInDirection("backward");
              }, deleteContentBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteContentForward: function() {
                return this.deleteInDirection("forward");
              }, deleteEntireSoftLine: function() {
                return this.deleteInDirection("forward");
              }, deleteHardLineBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteHardLineForward: function() {
                return this.deleteInDirection("forward");
              }, deleteSoftLineBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteSoftLineForward: function() {
                return this.deleteInDirection("forward");
              }, deleteWordBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteWordForward: function() {
                return this.deleteInDirection("forward");
              }, formatBackColor: function() {
                return this.activateAttributeIfSupported("backgroundColor", this.event.data);
              }, formatBold: function() {
                return this.toggleAttributeIfSupported("bold");
              }, formatFontColor: function() {
                return this.activateAttributeIfSupported("color", this.event.data);
              }, formatFontName: function() {
                return this.activateAttributeIfSupported("font", this.event.data);
              }, formatIndent: function() {
                var t3;
                return ((t3 = this.responder) != null ? t3.canIncreaseNestingLevel() : void 0) ? this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.increaseNestingLevel() : void 0;
                }) : void 0;
              }, formatItalic: function() {
                return this.toggleAttributeIfSupported("italic");
              }, formatJustifyCenter: function() {
                return this.toggleAttributeIfSupported("justifyCenter");
              }, formatJustifyFull: function() {
                return this.toggleAttributeIfSupported("justifyFull");
              }, formatJustifyLeft: function() {
                return this.toggleAttributeIfSupported("justifyLeft");
              }, formatJustifyRight: function() {
                return this.toggleAttributeIfSupported("justifyRight");
              }, formatOutdent: function() {
                var t3;
                return ((t3 = this.responder) != null ? t3.canDecreaseNestingLevel() : void 0) ? this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.decreaseNestingLevel() : void 0;
                }) : void 0;
              }, formatRemove: function() {
                return this.withTargetDOMRange(function() {
                  var t3, e2, n2, i2;
                  i2 = [];
                  for (t3 in (e2 = this.responder) != null ? e2.getCurrentAttributes() : void 0)
                    i2.push((n2 = this.responder) != null ? n2.removeCurrentAttribute(t3) : void 0);
                  return i2;
                });
              }, formatSetBlockTextDirection: function() {
                return this.activateAttributeIfSupported("blockDir", this.event.data);
              }, formatSetInlineTextDirection: function() {
                return this.activateAttributeIfSupported("textDir", this.event.data);
              }, formatStrikeThrough: function() {
                return this.toggleAttributeIfSupported("strike");
              }, formatSubscript: function() {
                return this.toggleAttributeIfSupported("sub");
              }, formatSuperscript: function() {
                return this.toggleAttributeIfSupported("sup");
              }, formatUnderline: function() {
                return this.toggleAttributeIfSupported("underline");
              }, historyRedo: function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.inputControllerWillPerformRedo() : void 0;
              }, historyUndo: function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.inputControllerWillPerformUndo() : void 0;
              }, insertCompositionText: function() {
                return this.composing = true, this.insertString(this.event.data);
              }, insertFromComposition: function() {
                return this.composing = false, this.insertString(this.event.data);
              }, insertFromDrop: function() {
                var t3, e2;
                return (t3 = this.deleteByDragRange) ? (this.deleteByDragRange = null, (e2 = this.delegate) != null && e2.inputControllerWillMoveText(), this.withTargetDOMRange(function() {
                  var e3;
                  return (e3 = this.responder) != null ? e3.moveTextFromRange(t3) : void 0;
                })) : void 0;
              }, insertFromPaste: function() {
                var n2, i2, o2, r2, s3, a2, u2, c2, l2, h2, p2;
                return n2 = this.event.dataTransfer, s3 = { dataTransfer: n2 }, (i2 = n2.getData("URL")) ? (this.event.preventDefault(), s3.type = "text/html", p2 = (r2 = n2.getData("public.url-name")) ? e.squishBreakableWhitespace(r2).trim() : i2, s3.html = this.createLinkHTML(i2, p2), (a2 = this.delegate) != null && a2.inputControllerWillPaste(s3), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertHTML(s3.html) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e2;
                    return (e2 = t3.delegate) != null ? e2.inputControllerDidPaste(s3) : void 0;
                  };
                }(this)) : t2(n2) ? (s3.type = "text/plain", s3.string = n2.getData("text/plain"), (u2 = this.delegate) != null && u2.inputControllerWillPaste(s3), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertString(s3.string) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e2;
                    return (e2 = t3.delegate) != null ? e2.inputControllerDidPaste(s3) : void 0;
                  };
                }(this)) : (o2 = n2.getData("text/html")) ? (this.event.preventDefault(), s3.type = "text/html", s3.html = o2, (c2 = this.delegate) != null && c2.inputControllerWillPaste(s3), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertHTML(s3.html) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e2;
                    return (e2 = t3.delegate) != null ? e2.inputControllerDidPaste(s3) : void 0;
                  };
                }(this)) : ((l2 = n2.files) != null ? l2.length : void 0) ? (s3.type = "File", s3.file = n2.files[0], (h2 = this.delegate) != null && h2.inputControllerWillPaste(s3), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertFile(s3.file) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e2;
                    return (e2 = t3.delegate) != null ? e2.inputControllerDidPaste(s3) : void 0;
                  };
                }(this)) : void 0;
              }, insertFromYank: function() {
                return this.insertString(this.event.data);
              }, insertLineBreak: function() {
                return this.insertString("\n");
              }, insertLink: function() {
                return this.activateAttributeIfSupported("href", this.event.data);
              }, insertOrderedList: function() {
                return this.toggleAttributeIfSupported("number");
              }, insertParagraph: function() {
                var t3;
                return (t3 = this.delegate) != null && t3.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.insertLineBreak() : void 0;
                });
              }, insertReplacementText: function() {
                return this.insertString(this.event.dataTransfer.getData("text/plain"), { updatePosition: false });
              }, insertText: function() {
                var t3, e2;
                return this.insertString((t3 = this.event.data) != null ? t3 : (e2 = this.event.dataTransfer) != null ? e2.getData("text/plain") : void 0);
              }, insertTranspose: function() {
                return this.insertString(this.event.data);
              }, insertUnorderedList: function() {
                return this.toggleAttributeIfSupported("bullet");
              } }, u.prototype.insertString = function(t3, e2) {
                var n2;
                return t3 == null && (t3 = ""), (n2 = this.delegate) != null && n2.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
                  var n3;
                  return (n3 = this.responder) != null ? n3.insertString(t3, e2) : void 0;
                });
              }, u.prototype.toggleAttributeIfSupported = function(t3) {
                var n2;
                return a.call(e.getAllAttributeNames(), t3) >= 0 ? ((n2 = this.delegate) != null && n2.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange(function() {
                  var e2;
                  return (e2 = this.responder) != null ? e2.toggleCurrentAttribute(t3) : void 0;
                })) : void 0;
              }, u.prototype.activateAttributeIfSupported = function(t3, n2) {
                var i2;
                return a.call(e.getAllAttributeNames(), t3) >= 0 ? ((i2 = this.delegate) != null && i2.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange(function() {
                  var e2;
                  return (e2 = this.responder) != null ? e2.setCurrentAttribute(t3, n2) : void 0;
                })) : void 0;
              }, u.prototype.deleteInDirection = function(t3, e2) {
                var n2, i2, o2, r2;
                return o2 = (e2 != null ? e2 : { recordUndoEntry: true }).recordUndoEntry, o2 && (r2 = this.delegate) != null && r2.inputControllerWillPerformTyping(), i2 = function(e3) {
                  return function() {
                    var n3;
                    return (n3 = e3.responder) != null ? n3.deleteInDirection(t3) : void 0;
                  };
                }(this), (n2 = this.getTargetDOMRange({ minLength: 2 })) ? this.withTargetDOMRange(n2, i2) : i2();
              }, u.prototype.withTargetDOMRange = function(t3, n2) {
                var i2;
                return typeof t3 == "function" && (n2 = t3, t3 = this.getTargetDOMRange()), t3 ? (i2 = this.responder) != null ? i2.withTargetDOMRange(t3, n2.bind(this)) : void 0 : (e.selectionChangeObserver.reset(), n2.call(this));
              }, u.prototype.getTargetDOMRange = function(t3) {
                var e2, n2, i2, o2;
                return i2 = (t3 != null ? t3 : { minLength: 0 }).minLength, (o2 = typeof (e2 = this.event).getTargetRanges == "function" ? e2.getTargetRanges() : void 0) && o2.length && (n2 = f(o2[0]), i2 === 0 || n2.toString().length >= i2) ? n2 : void 0;
              }, f = function(t3) {
                var e2;
                return e2 = document.createRange(), e2.setStart(t3.startContainer, t3.startOffset), e2.setEnd(t3.endContainer, t3.endOffset), e2;
              }, u.prototype.withEvent = function(t3, e2) {
                var n2;
                this.event = t3;
                try {
                  n2 = e2.call(this);
                } finally {
                  this.event = null;
                }
                return n2;
              }, c = function(t3) {
                var e2, n2;
                return a.call((e2 = (n2 = t3.dataTransfer) != null ? n2.types : void 0) != null ? e2 : [], "Files") >= 0;
              }, h = function(t3) {
                var e2;
                return (e2 = t3.clipboardData) ? a.call(e2.types, "Files") >= 0 && e2.types.length === 1 && e2.files.length >= 1 : void 0;
              }, p = function(t3) {
                var e2;
                return (e2 = t3.clipboardData) ? a.call(e2.types, "text/plain") >= 0 && e2.types.length === 1 : void 0;
              }, l = function(t3) {
                var e2;
                return e2 = [], t3.altKey && e2.push("alt"), t3.shiftKey && e2.push("shift"), e2.push(t3.key), e2;
              }, d = function(t3) {
                return { x: t3.clientX, y: t3.clientY };
              }, u;
            }(e.InputController);
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, l = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                h.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, h = {}.hasOwnProperty;
            n = e.defer, i = e.handleEvent, s = e.makeElement, u = e.tagName, a = e.config, r = a.lang, t2 = a.css, o = a.keyNames, e.AttachmentEditorController = function(a2) {
              function h2(t3, e2, n2, i2) {
                this.attachmentPiece = t3, this.element = e2, this.container = n2, this.options = i2 != null ? i2 : {}, this.didBlurCaption = c(this.didBlurCaption, this), this.didChangeCaption = c(this.didChangeCaption, this), this.didInputCaption = c(this.didInputCaption, this), this.didKeyDownCaption = c(this.didKeyDownCaption, this), this.didClickActionButton = c(this.didClickActionButton, this), this.didClickToolbar = c(this.didClickToolbar, this), this.attachment = this.attachmentPiece.attachment, u(this.element) === "a" && (this.element = this.element.firstChild), this.install();
              }
              var p;
              return l(h2, a2), p = function(t3) {
                return function() {
                  var e2;
                  return e2 = t3.apply(this, arguments), e2["do"](), this.undos == null && (this.undos = []), this.undos.push(e2.undo);
                };
              }, h2.prototype.install = function() {
                return this.makeElementMutable(), this.addToolbar(), this.attachment.isPreviewable() ? this.installCaptionEditor() : void 0;
              }, h2.prototype.uninstall = function() {
                var t3, e2;
                for (this.savePendingCaption(); e2 = this.undos.pop(); )
                  e2();
                return (t3 = this.delegate) != null ? t3.didUninstallAttachmentEditor(this) : void 0;
              }, h2.prototype.savePendingCaption = function() {
                var t3, e2, n2;
                return this.pendingCaption != null ? (t3 = this.pendingCaption, this.pendingCaption = null, t3 ? (e2 = this.delegate) != null && typeof e2.attachmentEditorDidRequestUpdatingAttributesForAttachment == "function" ? e2.attachmentEditorDidRequestUpdatingAttributesForAttachment({ caption: t3 }, this.attachment) : void 0 : (n2 = this.delegate) != null && typeof n2.attachmentEditorDidRequestRemovingAttributeForAttachment == "function" ? n2.attachmentEditorDidRequestRemovingAttributeForAttachment("caption", this.attachment) : void 0) : void 0;
              }, h2.prototype.makeElementMutable = p(function() {
                return { "do": function(t3) {
                  return function() {
                    return t3.element.dataset.trixMutable = true;
                  };
                }(this), undo: function(t3) {
                  return function() {
                    return delete t3.element.dataset.trixMutable;
                  };
                }(this) };
              }), h2.prototype.addToolbar = p(function() {
                var n2;
                return n2 = s({ tagName: "div", className: t2.attachmentToolbar, data: { trixMutable: true }, childNodes: s({ tagName: "div", className: "trix-button-row", childNodes: s({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: s({ tagName: "button", className: "trix-button trix-button--remove", textContent: r.remove, attributes: { title: r.remove }, data: { trixAction: "remove" } }) }) }) }), this.attachment.isPreviewable() && n2.appendChild(s({ tagName: "div", className: t2.attachmentMetadataContainer, childNodes: s({ tagName: "span", className: t2.attachmentMetadata, childNodes: [s({ tagName: "span", className: t2.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), s({ tagName: "span", className: t2.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), i("click", { onElement: n2, withCallback: this.didClickToolbar }), i("click", { onElement: n2, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), { "do": function(t3) {
                  return function() {
                    return t3.element.appendChild(n2);
                  };
                }(this), undo: function() {
                  return function() {
                    return e.removeNode(n2);
                  };
                }(this) };
              }), h2.prototype.installCaptionEditor = p(function() {
                var o2, a3, u2, c2, l2;
                return c2 = s({ tagName: "textarea", className: t2.attachmentCaptionEditor, attributes: { placeholder: r.captionPlaceholder }, data: { trixMutable: true } }), c2.value = this.attachmentPiece.getCaption(), l2 = c2.cloneNode(), l2.classList.add("trix-autoresize-clone"), l2.tabIndex = -1, o2 = function() {
                  return l2.value = c2.value, c2.style.height = l2.scrollHeight + "px";
                }, i("input", { onElement: c2, withCallback: o2 }), i("input", { onElement: c2, withCallback: this.didInputCaption }), i("keydown", { onElement: c2, withCallback: this.didKeyDownCaption }), i("change", { onElement: c2, withCallback: this.didChangeCaption }), i("blur", { onElement: c2, withCallback: this.didBlurCaption }), u2 = this.element.querySelector("figcaption"), a3 = u2.cloneNode(), { "do": function(e2) {
                  return function() {
                    return u2.style.display = "none", a3.appendChild(c2), a3.appendChild(l2), a3.classList.add(t2.attachmentCaption + "--editing"), u2.parentElement.insertBefore(a3, u2), o2(), e2.options.editCaption ? n(function() {
                      return c2.focus();
                    }) : void 0;
                  };
                }(this), undo: function() {
                  return e.removeNode(a3), u2.style.display = null;
                } };
              }), h2.prototype.didClickToolbar = function(t3) {
                return t3.preventDefault(), t3.stopPropagation();
              }, h2.prototype.didClickActionButton = function(t3) {
                var e2, n2;
                switch (e2 = t3.target.getAttribute("data-trix-action")) {
                  case "remove":
                    return (n2 = this.delegate) != null ? n2.attachmentEditorDidRequestRemovalOfAttachment(this.attachment) : void 0;
                }
              }, h2.prototype.didKeyDownCaption = function(t3) {
                var e2;
                return o[t3.keyCode] === "return" ? (t3.preventDefault(), this.savePendingCaption(), (e2 = this.delegate) != null && typeof e2.attachmentEditorDidRequestDeselectingAttachment == "function" ? e2.attachmentEditorDidRequestDeselectingAttachment(this.attachment) : void 0) : void 0;
              }, h2.prototype.didInputCaption = function(t3) {
                return this.pendingCaption = t3.target.value.replace(/\s/g, " ").trim();
              }, h2.prototype.didChangeCaption = function() {
                return this.savePendingCaption();
              }, h2.prototype.didBlurCaption = function() {
                return this.savePendingCaption();
              }, h2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                r.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, r = {}.hasOwnProperty;
            i = e.makeElement, t2 = e.config.css, e.AttachmentView = function(r2) {
              function s() {
                s.__super__.constructor.apply(this, arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
              }
              var a;
              return o(s, r2), s.attachmentSelector = "[data-trix-attachment]", s.prototype.createContentNodes = function() {
                return [];
              }, s.prototype.createNodes = function() {
                var e2, n2, o2, r3, s2, u, c;
                if (e2 = r3 = i({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: false }), (n2 = this.getHref()) && (r3 = i({ tagName: "a", editable: false, attributes: { href: n2, tabindex: -1 } }), e2.appendChild(r3)), this.attachment.hasContent())
                  r3.innerHTML = this.attachment.getContent();
                else
                  for (c = this.createContentNodes(), o2 = 0, s2 = c.length; s2 > o2; o2++)
                    u = c[o2], r3.appendChild(u);
                return r3.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = i({ tagName: "progress", attributes: { "class": t2.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: true, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e2.appendChild(this.progressElement)), [a("left"), e2, a("right")];
              }, s.prototype.createCaptionElement = function() {
                var e2, n2, o2, r3, s2, a2, u;
                return o2 = i({ tagName: "figcaption", className: t2.attachmentCaption }), (e2 = this.attachmentPiece.getCaption()) ? (o2.classList.add(t2.attachmentCaption + "--edited"), o2.textContent = e2) : (n2 = this.getCaptionConfig(), n2.name && (r3 = this.attachment.getFilename()), n2.size && (a2 = this.attachment.getFormattedFilesize()), r3 && (s2 = i({ tagName: "span", className: t2.attachmentName, textContent: r3 }), o2.appendChild(s2)), a2 && (r3 && o2.appendChild(document.createTextNode(" ")), u = i({ tagName: "span", className: t2.attachmentSize, textContent: a2 }), o2.appendChild(u))), o2;
              }, s.prototype.getClassName = function() {
                var e2, n2;
                return n2 = [t2.attachment, t2.attachment + "--" + this.attachment.getType()], (e2 = this.attachment.getExtension()) && n2.push(t2.attachment + "--" + e2), n2.join(" ");
              }, s.prototype.getData = function() {
                var t3, e2;
                return e2 = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, t3 = this.attachmentPiece.attributes, t3.isEmpty() || (e2.trixAttributes = JSON.stringify(t3)), this.attachment.isPending() && (e2.trixSerialize = false), e2;
              }, s.prototype.getHref = function() {
                return n(this.attachment.getContent(), "a") ? void 0 : this.attachment.getHref();
              }, s.prototype.getCaptionConfig = function() {
                var t3, n2, i2;
                return i2 = this.attachment.getType(), t3 = e.copyObject((n2 = e.config.attachments[i2]) != null ? n2.caption : void 0), i2 === "file" && (t3.name = true), t3;
              }, s.prototype.findProgressElement = function() {
                var t3;
                return (t3 = this.findElement()) != null ? t3.querySelector("progress") : void 0;
              }, a = function(t3) {
                return i({ tagName: "span", textContent: e.ZERO_WIDTH_SPACE, data: { trixCursorTarget: t3, trixSerialize: false } });
              }, s.prototype.attachmentDidChangeUploadProgress = function() {
                var t3, e2;
                return e2 = this.attachment.getUploadProgress(), (t3 = this.findProgressElement()) != null ? t3.value = e2 : void 0;
              }, s;
            }(e.ObjectView), n = function(t3, e2) {
              var n2;
              return n2 = i("div"), n2.innerHTML = t3 != null ? t3 : "", n2.querySelector(e2);
            };
          }.call(this), function() {
            var t2, n = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var o in e2)
                i.call(e2, o) && (t3[o] = e2[o]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, i = {}.hasOwnProperty;
            t2 = e.makeElement, e.PreviewableAttachmentView = function(i2) {
              function o() {
                o.__super__.constructor.apply(this, arguments), this.attachment.previewDelegate = this;
              }
              return n(o, i2), o.prototype.createContentNodes = function() {
                return this.image = t2({ tagName: "img", attributes: { src: "" }, data: { trixMutable: true } }), this.refresh(this.image), [this.image];
              }, o.prototype.createCaptionElement = function() {
                var t3;
                return t3 = o.__super__.createCaptionElement.apply(this, arguments), t3.textContent || t3.setAttribute("data-trix-placeholder", e.config.lang.captionPlaceholder), t3;
              }, o.prototype.refresh = function(t3) {
                var e2;
                return t3 == null && (t3 = (e2 = this.findElement()) != null ? e2.querySelector("img") : void 0), t3 ? this.updateAttributesForImage(t3) : void 0;
              }, o.prototype.updateAttributesForImage = function(t3) {
                var e2, n2, i3, o2, r, s;
                return r = this.attachment.getURL(), n2 = this.attachment.getPreviewURL(), t3.src = n2 || r, n2 === r ? t3.removeAttribute("data-trix-serialized-attributes") : (i3 = JSON.stringify({ src: r }), t3.setAttribute("data-trix-serialized-attributes", i3)), s = this.attachment.getWidth(), e2 = this.attachment.getHeight(), s != null && (t3.width = s), e2 != null && (t3.height = e2), o2 = ["imageElement", this.attachment.id, t3.src, t3.width, t3.height].join("/"), t3.dataset.trixStoreKey = o2;
              }, o.prototype.attachmentDidChangeAttributes = function() {
                return this.refresh(this.image), this.refresh();
              }, o;
            }(e.AttachmentView);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                r.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, r = {}.hasOwnProperty;
            i = e.makeElement, t2 = e.findInnerElement, n = e.getTextConfig, e.PieceView = function(r2) {
              function s() {
                var t3;
                s.__super__.constructor.apply(this, arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), t3 = this.options, this.textConfig = t3.textConfig, this.context = t3.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
              }
              var a;
              return o(s, r2), s.prototype.createNodes = function() {
                var e2, n2, i2, o2, r3, s2;
                if (s2 = this.attachment ? this.createAttachmentNodes() : this.createStringNodes(), e2 = this.createElement()) {
                  for (i2 = t2(e2), n2 = 0, o2 = s2.length; o2 > n2; n2++)
                    r3 = s2[n2], i2.appendChild(r3);
                  s2 = [e2];
                }
                return s2;
              }, s.prototype.createAttachmentNodes = function() {
                var t3, n2;
                return t3 = this.attachment.isPreviewable() ? e.PreviewableAttachmentView : e.AttachmentView, n2 = this.createChildView(t3, this.piece.attachment, { piece: this.piece }), n2.getNodes();
              }, s.prototype.createStringNodes = function() {
                var t3, e2, n2, o2, r3, s2, a2, u, c, l;
                if ((u = this.textConfig) != null ? u.plaintext : void 0)
                  return [document.createTextNode(this.string)];
                for (a2 = [], c = this.string.split("\n"), n2 = e2 = 0, o2 = c.length; o2 > e2; n2 = ++e2)
                  l = c[n2], n2 > 0 && (t3 = i("br"), a2.push(t3)), (r3 = l.length) && (s2 = document.createTextNode(this.preserveSpaces(l)), a2.push(s2));
                return a2;
              }, s.prototype.createElement = function() {
                var t3, e2, o2, r3, s2, a2, u, c, l;
                c = {}, a2 = this.attributes;
                for (r3 in a2)
                  if (l = a2[r3], (t3 = n(r3)) && (t3.tagName && (s2 = i(t3.tagName), o2 ? (o2.appendChild(s2), o2 = s2) : e2 = o2 = s2), t3.styleProperty && (c[t3.styleProperty] = l), t3.style)) {
                    u = t3.style;
                    for (r3 in u)
                      l = u[r3], c[r3] = l;
                  }
                if (Object.keys(c).length) {
                  e2 == null && (e2 = i("span"));
                  for (r3 in c)
                    l = c[r3], e2.style[r3] = l;
                }
                return e2;
              }, s.prototype.createContainerElement = function() {
                var t3, e2, o2, r3, s2;
                r3 = this.attributes;
                for (o2 in r3)
                  if (s2 = r3[o2], (e2 = n(o2)) && e2.groupTagName)
                    return t3 = {}, t3[o2] = s2, i(e2.groupTagName, t3);
              }, a = e.NON_BREAKING_SPACE, s.prototype.preserveSpaces = function(t3) {
                return this.context.isLast && (t3 = t3.replace(/\ $/, a)), t3 = t3.replace(/(\S)\ {3}(\S)/g, "$1 " + a + " $2").replace(/\ {2}/g, a + " ").replace(/\ {2}/g, " " + a), (this.context.isFirst || this.context.followsWhitespace) && (t3 = t3.replace(/^\ /, a)), t3;
              }, s;
            }(e.ObjectView);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.TextView = function(n2) {
              function i() {
                i.__super__.constructor.apply(this, arguments), this.text = this.object, this.textConfig = this.options.textConfig;
              }
              var o;
              return t2(i, n2), i.prototype.createNodes = function() {
                var t3, n3, i2, r, s, a, u, c, l, h;
                for (a = [], c = e.ObjectGroup.groupObjects(this.getPieces()), r = c.length - 1, i2 = n3 = 0, s = c.length; s > n3; i2 = ++n3)
                  u = c[i2], t3 = {}, i2 === 0 && (t3.isFirst = true), i2 === r && (t3.isLast = true), o(l) && (t3.followsWhitespace = true), h = this.findOrCreateCachedChildView(e.PieceView, u, { textConfig: this.textConfig, context: t3 }), a.push.apply(a, h.getNodes()), l = u;
                return a;
              }, i.prototype.getPieces = function() {
                var t3, e2, n3, i2, o2;
                for (i2 = this.text.getPieces(), o2 = [], t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  n3 = i2[t3], n3.hasAttribute("blockBreak") || o2.push(n3);
                return o2;
              }, o = function(t3) {
                return /\s$/.test(t3 != null ? t3.toString() : void 0);
              }, i;
            }(e.ObjectView);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                r.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, r = {}.hasOwnProperty;
            i = e.makeElement, n = e.getBlockConfig, t2 = e.config.css, e.BlockView = function(r2) {
              function s() {
                s.__super__.constructor.apply(this, arguments), this.block = this.object, this.attributes = this.block.getAttributes();
              }
              return o(s, r2), s.prototype.createNodes = function() {
                var t3, o2, r3, s2, a, u, c, l, h, p, d;
                if (o2 = document.createComment("block"), c = [o2], this.block.isEmpty() ? c.push(i("br")) : (p = (l = n(this.block.getLastAttribute())) != null ? l.text : void 0, d = this.findOrCreateCachedChildView(e.TextView, this.block.text, { textConfig: p }), c.push.apply(c, d.getNodes()), this.shouldAddExtraNewlineElement() && c.push(i("br"))), this.attributes.length)
                  return c;
                for (h = e.config.blockAttributes["default"].tagName, this.block.isRTL() && (t3 = { dir: "rtl" }), r3 = i({ tagName: h, attributes: t3 }), s2 = 0, a = c.length; a > s2; s2++)
                  u = c[s2], r3.appendChild(u);
                return [r3];
              }, s.prototype.createContainerElement = function(e2) {
                var o2, r3, s2, a, u;
                return o2 = this.attributes[e2], u = n(o2).tagName, e2 === 0 && this.block.isRTL() && (r3 = { dir: "rtl" }), o2 === "attachmentGallery" && (a = this.block.getBlockBreakPosition(), s2 = t2.attachmentGallery + " " + t2.attachmentGallery + "--" + a), i({ tagName: u, className: s2, attributes: r3 });
              }, s.prototype.shouldAddExtraNewlineElement = function() {
                return /\n\n$/.test(this.block.toString());
              }, s;
            }(e.ObjectView);
          }.call(this), function() {
            var t2, n, i = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                o.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, o = {}.hasOwnProperty;
            t2 = e.defer, n = e.makeElement, e.DocumentView = function(o2) {
              function r() {
                r.__super__.constructor.apply(this, arguments), this.element = this.options.element, this.elementStore = new e.ElementStore(), this.setDocument(this.object);
              }
              var s, a, u;
              return i(r, o2), r.render = function(t3) {
                var e2, i2;
                return e2 = n("div"), i2 = new this(t3, { element: e2 }), i2.render(), i2.sync(), e2;
              }, r.prototype.setDocument = function(t3) {
                return t3.isEqualTo(this.document) ? void 0 : this.document = this.object = t3;
              }, r.prototype.render = function() {
                var t3, i2, o3, r2, s2, a2, u2;
                if (this.childViews = [], this.shadowElement = n("div"), !this.document.isEmpty()) {
                  for (s2 = e.ObjectGroup.groupObjects(this.document.getBlocks(), { asTree: true }), a2 = [], t3 = 0, i2 = s2.length; i2 > t3; t3++)
                    r2 = s2[t3], u2 = this.findOrCreateCachedChildView(e.BlockView, r2), a2.push(function() {
                      var t4, e2, n2, i3;
                      for (n2 = u2.getNodes(), i3 = [], t4 = 0, e2 = n2.length; e2 > t4; t4++)
                        o3 = n2[t4], i3.push(this.shadowElement.appendChild(o3));
                      return i3;
                    }.call(this));
                  return a2;
                }
              }, r.prototype.isSynced = function() {
                return s(this.shadowElement, this.element);
              }, r.prototype.sync = function() {
                var t3;
                for (t3 = this.createDocumentFragmentForSync(); this.element.lastChild; )
                  this.element.removeChild(this.element.lastChild);
                return this.element.appendChild(t3), this.didSync();
              }, r.prototype.didSync = function() {
                return this.elementStore.reset(a(this.element)), t2(function(t3) {
                  return function() {
                    return t3.garbageCollectCachedViews();
                  };
                }(this));
              }, r.prototype.createDocumentFragmentForSync = function() {
                var t3, e2, n2, i2, o3, r2, s2, u2, c, l;
                for (e2 = document.createDocumentFragment(), u2 = this.shadowElement.childNodes, n2 = 0, o3 = u2.length; o3 > n2; n2++)
                  s2 = u2[n2], e2.appendChild(s2.cloneNode(true));
                for (c = a(e2), i2 = 0, r2 = c.length; r2 > i2; i2++)
                  t3 = c[i2], (l = this.elementStore.remove(t3)) && t3.parentNode.replaceChild(l, t3);
                return e2;
              }, a = function(t3) {
                return t3.querySelectorAll("[data-trix-store-key]");
              }, s = function(t3, e2) {
                return u(t3.innerHTML) === u(e2.innerHTML);
              }, u = function(t3) {
                return t3.replace(/&nbsp;/g, " ");
              }, r;
            }(e.ObjectView);
          }.call(this), function() {
            var t2, n, i, o, r, s = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, a = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                u.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, u = {}.hasOwnProperty;
            i = e.findClosestElementFromNode, o = e.handleEvent, r = e.innerElementIsActive, n = e.defer, t2 = e.AttachmentView.attachmentSelector, e.CompositionController = function(u2) {
              function c(n2, i2) {
                this.element = n2, this.composition = i2, this.didClickAttachment = s(this.didClickAttachment, this), this.didBlur = s(this.didBlur, this), this.didFocus = s(this.didFocus, this), this.documentView = new e.DocumentView(this.composition.document, { element: this.element }), o("focus", { onElement: this.element, withCallback: this.didFocus }), o("blur", { onElement: this.element, withCallback: this.didBlur }), o("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: true }), o("mousedown", { onElement: this.element, matchingSelector: t2, withCallback: this.didClickAttachment }), o("click", { onElement: this.element, matchingSelector: "a" + t2, preventDefault: true });
              }
              return a(c, u2), c.prototype.didFocus = function() {
                var t3, e2, n2;
                return t3 = function(t4) {
                  return function() {
                    var e3;
                    return t4.focused ? void 0 : (t4.focused = true, (e3 = t4.delegate) != null && typeof e3.compositionControllerDidFocus == "function" ? e3.compositionControllerDidFocus() : void 0);
                  };
                }(this), (e2 = (n2 = this.blurPromise) != null ? n2.then(t3) : void 0) != null ? e2 : t3();
              }, c.prototype.didBlur = function() {
                return this.blurPromise = new Promise(function(t3) {
                  return function(e2) {
                    return n(function() {
                      var n2;
                      return r(t3.element) || (t3.focused = null, (n2 = t3.delegate) != null && typeof n2.compositionControllerDidBlur == "function" && n2.compositionControllerDidBlur()), t3.blurPromise = null, e2();
                    });
                  };
                }(this));
              }, c.prototype.didClickAttachment = function(t3, e2) {
                var n2, o2, r2;
                return n2 = this.findAttachmentForElement(e2), o2 = i(t3.target, { matchingSelector: "figcaption" }) != null, (r2 = this.delegate) != null && typeof r2.compositionControllerDidSelectAttachment == "function" ? r2.compositionControllerDidSelectAttachment(n2, { editCaption: o2 }) : void 0;
              }, c.prototype.getSerializableElement = function() {
                return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
              }, c.prototype.render = function() {
                var t3, e2, n2;
                return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((t3 = this.delegate) != null && typeof t3.compositionControllerWillSyncDocumentView == "function" && t3.compositionControllerWillSyncDocumentView(), this.documentView.sync(), (e2 = this.delegate) != null && typeof e2.compositionControllerDidSyncDocumentView == "function" && e2.compositionControllerDidSyncDocumentView()), (n2 = this.delegate) != null && typeof n2.compositionControllerDidRender == "function" ? n2.compositionControllerDidRender() : void 0;
              }, c.prototype.rerenderViewForObject = function(t3) {
                return this.invalidateViewForObject(t3), this.render();
              }, c.prototype.invalidateViewForObject = function(t3) {
                return this.documentView.invalidateViewForObject(t3);
              }, c.prototype.isViewCachingEnabled = function() {
                return this.documentView.isViewCachingEnabled();
              }, c.prototype.enableViewCaching = function() {
                return this.documentView.enableViewCaching();
              }, c.prototype.disableViewCaching = function() {
                return this.documentView.disableViewCaching();
              }, c.prototype.refreshViewCache = function() {
                return this.documentView.garbageCollectCachedViews();
              }, c.prototype.isEditingAttachment = function() {
                return this.attachmentEditor != null;
              }, c.prototype.installAttachmentEditorForAttachment = function(t3, n2) {
                var i2, o2, r2;
                if (((r2 = this.attachmentEditor) != null ? r2.attachment : void 0) !== t3 && (o2 = this.documentView.findElementForObject(t3)))
                  return this.uninstallAttachmentEditor(), i2 = this.composition.document.getAttachmentPieceForAttachment(t3), this.attachmentEditor = new e.AttachmentEditorController(i2, o2, this.element, n2), this.attachmentEditor.delegate = this;
              }, c.prototype.uninstallAttachmentEditor = function() {
                var t3;
                return (t3 = this.attachmentEditor) != null ? t3.uninstall() : void 0;
              }, c.prototype.didUninstallAttachmentEditor = function() {
                return this.attachmentEditor = null, this.render();
              }, c.prototype.attachmentEditorDidRequestUpdatingAttributesForAttachment = function(t3, e2) {
                var n2;
                return (n2 = this.delegate) != null && typeof n2.compositionControllerWillUpdateAttachment == "function" && n2.compositionControllerWillUpdateAttachment(e2), this.composition.updateAttributesForAttachment(t3, e2);
              }, c.prototype.attachmentEditorDidRequestRemovingAttributeForAttachment = function(t3, e2) {
                var n2;
                return (n2 = this.delegate) != null && typeof n2.compositionControllerWillUpdateAttachment == "function" && n2.compositionControllerWillUpdateAttachment(e2), this.composition.removeAttributeForAttachment(t3, e2);
              }, c.prototype.attachmentEditorDidRequestRemovalOfAttachment = function(t3) {
                var e2;
                return (e2 = this.delegate) != null && typeof e2.compositionControllerDidRequestRemovalOfAttachment == "function" ? e2.compositionControllerDidRequestRemovalOfAttachment(t3) : void 0;
              }, c.prototype.attachmentEditorDidRequestDeselectingAttachment = function(t3) {
                var e2;
                return (e2 = this.delegate) != null && typeof e2.compositionControllerDidRequestDeselectingAttachment == "function" ? e2.compositionControllerDidRequestDeselectingAttachment(t3) : void 0;
              }, c.prototype.canSyncDocumentView = function() {
                return !this.isEditingAttachment();
              }, c.prototype.findAttachmentForElement = function(t3) {
                return this.composition.document.getAttachmentById(parseInt(t3.dataset.trixId, 10));
              }, c;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, r = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                s.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, s = {}.hasOwnProperty;
            n = e.handleEvent, i = e.triggerEvent, t2 = e.findClosestElementFromNode, e.ToolbarController = function(e2) {
              function s2(t3) {
                this.element = t3, this.didKeyDownDialogInput = o(this.didKeyDownDialogInput, this), this.didClickDialogButton = o(this.didClickDialogButton, this), this.didClickAttributeButton = o(this.didClickAttributeButton, this), this.didClickActionButton = o(this.didClickActionButton, this), this.attributes = {}, this.actions = {}, this.resetDialogInputs(), n("mousedown", { onElement: this.element, matchingSelector: a, withCallback: this.didClickActionButton }), n("mousedown", { onElement: this.element, matchingSelector: c, withCallback: this.didClickAttributeButton }), n("click", { onElement: this.element, matchingSelector: v, preventDefault: true }), n("click", { onElement: this.element, matchingSelector: l, withCallback: this.didClickDialogButton }), n("keydown", { onElement: this.element, matchingSelector: h, withCallback: this.didKeyDownDialogInput });
              }
              var a, u, c, l, h, p, d, f, g, m, v;
              return r(s2, e2), c = "[data-trix-attribute]", a = "[data-trix-action]", v = c + ", " + a, p = "[data-trix-dialog]", u = p + "[data-trix-active]", l = p + " [data-trix-method]", h = p + " [data-trix-input]", s2.prototype.didClickActionButton = function(t3, e3) {
                var n2, i2, o2;
                return (i2 = this.delegate) != null && i2.toolbarDidClickButton(), t3.preventDefault(), n2 = d(e3), this.getDialog(n2) ? this.toggleDialog(n2) : (o2 = this.delegate) != null ? o2.toolbarDidInvokeAction(n2) : void 0;
              }, s2.prototype.didClickAttributeButton = function(t3, e3) {
                var n2, i2, o2;
                return (i2 = this.delegate) != null && i2.toolbarDidClickButton(), t3.preventDefault(), n2 = f(e3), this.getDialog(n2) ? this.toggleDialog(n2) : (o2 = this.delegate) != null && o2.toolbarDidToggleAttribute(n2), this.refreshAttributeButtons();
              }, s2.prototype.didClickDialogButton = function(e3, n2) {
                var i2, o2;
                return i2 = t2(n2, { matchingSelector: p }), o2 = n2.getAttribute("data-trix-method"), this[o2].call(this, i2);
              }, s2.prototype.didKeyDownDialogInput = function(t3, e3) {
                var n2, i2;
                return t3.keyCode === 13 && (t3.preventDefault(), n2 = e3.getAttribute("name"), i2 = this.getDialog(n2), this.setAttribute(i2)), t3.keyCode === 27 ? (t3.preventDefault(), this.hideDialog()) : void 0;
              }, s2.prototype.updateActions = function(t3) {
                return this.actions = t3, this.refreshActionButtons();
              }, s2.prototype.refreshActionButtons = function() {
                return this.eachActionButton(function(t3) {
                  return function(e3, n2) {
                    return e3.disabled = t3.actions[n2] === false;
                  };
                }(this));
              }, s2.prototype.eachActionButton = function(t3) {
                var e3, n2, i2, o2, r2;
                for (o2 = this.element.querySelectorAll(a), r2 = [], n2 = 0, i2 = o2.length; i2 > n2; n2++)
                  e3 = o2[n2], r2.push(t3(e3, d(e3)));
                return r2;
              }, s2.prototype.updateAttributes = function(t3) {
                return this.attributes = t3, this.refreshAttributeButtons();
              }, s2.prototype.refreshAttributeButtons = function() {
                return this.eachAttributeButton(function(t3) {
                  return function(e3, n2) {
                    return e3.disabled = t3.attributes[n2] === false, t3.attributes[n2] || t3.dialogIsVisible(n2) ? (e3.setAttribute("data-trix-active", ""), e3.classList.add("trix-active")) : (e3.removeAttribute("data-trix-active"), e3.classList.remove("trix-active"));
                  };
                }(this));
              }, s2.prototype.eachAttributeButton = function(t3) {
                var e3, n2, i2, o2, r2;
                for (o2 = this.element.querySelectorAll(c), r2 = [], n2 = 0, i2 = o2.length; i2 > n2; n2++)
                  e3 = o2[n2], r2.push(t3(e3, f(e3)));
                return r2;
              }, s2.prototype.applyKeyboardCommand = function(t3) {
                var e3, n2, o2, r2, s3, a2, u2;
                for (s3 = JSON.stringify(t3.sort()), u2 = this.element.querySelectorAll("[data-trix-key]"), r2 = 0, a2 = u2.length; a2 > r2; r2++)
                  if (e3 = u2[r2], o2 = e3.getAttribute("data-trix-key").split("+"), n2 = JSON.stringify(o2.sort()), n2 === s3)
                    return i("mousedown", { onElement: e3 }), true;
                return false;
              }, s2.prototype.dialogIsVisible = function(t3) {
                var e3;
                return (e3 = this.getDialog(t3)) ? e3.hasAttribute("data-trix-active") : void 0;
              }, s2.prototype.toggleDialog = function(t3) {
                return this.dialogIsVisible(t3) ? this.hideDialog() : this.showDialog(t3);
              }, s2.prototype.showDialog = function(t3) {
                var e3, n2, i2, o2, r2, s3, a2, u2, c2, l2;
                for (this.hideDialog(), (a2 = this.delegate) != null && a2.toolbarWillShowDialog(), i2 = this.getDialog(t3), i2.setAttribute("data-trix-active", ""), i2.classList.add("trix-active"), u2 = i2.querySelectorAll("input[disabled]"), o2 = 0, s3 = u2.length; s3 > o2; o2++)
                  n2 = u2[o2], n2.removeAttribute("disabled");
                return (e3 = f(i2)) && (r2 = m(i2, t3)) && (r2.value = (c2 = this.attributes[e3]) != null ? c2 : "", r2.select()), (l2 = this.delegate) != null ? l2.toolbarDidShowDialog(t3) : void 0;
              }, s2.prototype.setAttribute = function(t3) {
                var e3, n2, i2;
                return e3 = f(t3), n2 = m(t3, e3), n2.willValidate && !n2.checkValidity() ? (n2.setAttribute("data-trix-validate", ""), n2.classList.add("trix-validate"), n2.focus()) : ((i2 = this.delegate) != null && i2.toolbarDidUpdateAttribute(e3, n2.value), this.hideDialog());
              }, s2.prototype.removeAttribute = function(t3) {
                var e3, n2;
                return e3 = f(t3), (n2 = this.delegate) != null && n2.toolbarDidRemoveAttribute(e3), this.hideDialog();
              }, s2.prototype.hideDialog = function() {
                var t3, e3;
                return (t3 = this.element.querySelector(u)) ? (t3.removeAttribute("data-trix-active"), t3.classList.remove("trix-active"), this.resetDialogInputs(), (e3 = this.delegate) != null ? e3.toolbarDidHideDialog(g(t3)) : void 0) : void 0;
              }, s2.prototype.resetDialogInputs = function() {
                var t3, e3, n2, i2, o2;
                for (i2 = this.element.querySelectorAll(h), o2 = [], t3 = 0, n2 = i2.length; n2 > t3; t3++)
                  e3 = i2[t3], e3.setAttribute("disabled", "disabled"), e3.removeAttribute("data-trix-validate"), o2.push(e3.classList.remove("trix-validate"));
                return o2;
              }, s2.prototype.getDialog = function(t3) {
                return this.element.querySelector("[data-trix-dialog=" + t3 + "]");
              }, m = function(t3, e3) {
                return e3 == null && (e3 = f(t3)), t3.querySelector("[data-trix-input][name='" + e3 + "']");
              }, d = function(t3) {
                return t3.getAttribute("data-trix-action");
              }, f = function(t3) {
                var e3;
                return (e3 = t3.getAttribute("data-trix-attribute")) != null ? e3 : t3.getAttribute("data-trix-dialog-attribute");
              }, g = function(t3) {
                return t3.getAttribute("data-trix-dialog");
              }, s2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.ImagePreloadOperation = function(e2) {
              function n2(t3) {
                this.url = t3;
              }
              return t2(n2, e2), n2.prototype.perform = function(t3) {
                var e3;
                return e3 = new Image(), e3.onload = function(n3) {
                  return function() {
                    return e3.width = n3.width = e3.naturalWidth, e3.height = n3.height = e3.naturalHeight, t3(true, e3);
                  };
                }(this), e3.onerror = function() {
                  return t3(false);
                }, e3.src = this.url;
              }, n2;
            }(e.Operation);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, n = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var o in e2)
                i.call(e2, o) && (t3[o] = e2[o]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, i = {}.hasOwnProperty;
            e.Attachment = function(i2) {
              function o(n2) {
                n2 == null && (n2 = {}), this.releaseFile = t2(this.releaseFile, this), o.__super__.constructor.apply(this, arguments), this.attributes = e.Hash.box(n2), this.didChangeAttributes();
              }
              return n(o, i2), o.previewablePattern = /^image(\/(gif|png|jpe?g)|$)/, o.attachmentForFile = function(t3) {
                var e2, n2;
                return n2 = this.attributesForFile(t3), e2 = new this(n2), e2.setFile(t3), e2;
              }, o.attributesForFile = function(t3) {
                return new e.Hash({ filename: t3.name, filesize: t3.size, contentType: t3.type });
              }, o.fromJSON = function(t3) {
                return new this(t3);
              }, o.prototype.getAttribute = function(t3) {
                return this.attributes.get(t3);
              }, o.prototype.hasAttribute = function(t3) {
                return this.attributes.has(t3);
              }, o.prototype.getAttributes = function() {
                return this.attributes.toObject();
              }, o.prototype.setAttributes = function(t3) {
                var e2, n2, i3;
                return t3 == null && (t3 = {}), e2 = this.attributes.merge(t3), this.attributes.isEqualTo(e2) ? void 0 : (this.attributes = e2, this.didChangeAttributes(), (n2 = this.previewDelegate) != null && typeof n2.attachmentDidChangeAttributes == "function" && n2.attachmentDidChangeAttributes(this), (i3 = this.delegate) != null && typeof i3.attachmentDidChangeAttributes == "function" ? i3.attachmentDidChangeAttributes(this) : void 0);
              }, o.prototype.didChangeAttributes = function() {
                return this.isPreviewable() ? this.preloadURL() : void 0;
              }, o.prototype.isPending = function() {
                return this.file != null && !(this.getURL() || this.getHref());
              }, o.prototype.isPreviewable = function() {
                return this.attributes.has("previewable") ? this.attributes.get("previewable") : this.constructor.previewablePattern.test(this.getContentType());
              }, o.prototype.getType = function() {
                return this.hasContent() ? "content" : this.isPreviewable() ? "preview" : "file";
              }, o.prototype.getURL = function() {
                return this.attributes.get("url");
              }, o.prototype.getHref = function() {
                return this.attributes.get("href");
              }, o.prototype.getFilename = function() {
                var t3;
                return (t3 = this.attributes.get("filename")) != null ? t3 : "";
              }, o.prototype.getFilesize = function() {
                return this.attributes.get("filesize");
              }, o.prototype.getFormattedFilesize = function() {
                var t3;
                return t3 = this.attributes.get("filesize"), typeof t3 == "number" ? e.config.fileSize.formatter(t3) : "";
              }, o.prototype.getExtension = function() {
                var t3;
                return (t3 = this.getFilename().match(/\.(\w+)$/)) != null ? t3[1].toLowerCase() : void 0;
              }, o.prototype.getContentType = function() {
                return this.attributes.get("contentType");
              }, o.prototype.hasContent = function() {
                return this.attributes.has("content");
              }, o.prototype.getContent = function() {
                return this.attributes.get("content");
              }, o.prototype.getWidth = function() {
                return this.attributes.get("width");
              }, o.prototype.getHeight = function() {
                return this.attributes.get("height");
              }, o.prototype.getFile = function() {
                return this.file;
              }, o.prototype.setFile = function(t3) {
                return this.file = t3, this.isPreviewable() ? this.preloadFile() : void 0;
              }, o.prototype.releaseFile = function() {
                return this.releasePreloadedFile(), this.file = null;
              }, o.prototype.getUploadProgress = function() {
                var t3;
                return (t3 = this.uploadProgress) != null ? t3 : 0;
              }, o.prototype.setUploadProgress = function(t3) {
                var e2;
                return this.uploadProgress !== t3 ? (this.uploadProgress = t3, (e2 = this.uploadProgressDelegate) != null && typeof e2.attachmentDidChangeUploadProgress == "function" ? e2.attachmentDidChangeUploadProgress(this) : void 0) : void 0;
              }, o.prototype.toJSON = function() {
                return this.getAttributes();
              }, o.prototype.getCacheKey = function() {
                return [o.__super__.getCacheKey.apply(this, arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
              }, o.prototype.getPreviewURL = function() {
                return this.previewURL || this.preloadingURL;
              }, o.prototype.setPreviewURL = function(t3) {
                var e2, n2;
                return t3 !== this.getPreviewURL() ? (this.previewURL = t3, (e2 = this.previewDelegate) != null && typeof e2.attachmentDidChangeAttributes == "function" && e2.attachmentDidChangeAttributes(this), (n2 = this.delegate) != null && typeof n2.attachmentDidChangePreviewURL == "function" ? n2.attachmentDidChangePreviewURL(this) : void 0) : void 0;
              }, o.prototype.preloadURL = function() {
                return this.preload(this.getURL(), this.releaseFile);
              }, o.prototype.preloadFile = function() {
                return this.file ? (this.fileObjectURL = URL.createObjectURL(this.file), this.preload(this.fileObjectURL)) : void 0;
              }, o.prototype.releasePreloadedFile = function() {
                return this.fileObjectURL ? (URL.revokeObjectURL(this.fileObjectURL), this.fileObjectURL = null) : void 0;
              }, o.prototype.preload = function(t3, n2) {
                var i3;
                return t3 && t3 !== this.getPreviewURL() ? (this.preloadingURL = t3, i3 = new e.ImagePreloadOperation(t3), i3.then(function(e2) {
                  return function(i4) {
                    var o2, r;
                    return r = i4.width, o2 = i4.height, e2.getWidth() && e2.getHeight() || e2.setAttributes({ width: r, height: o2 }), e2.preloadingURL = null, e2.setPreviewURL(t3), typeof n2 == "function" ? n2() : void 0;
                  };
                }(this))["catch"](function(t4) {
                  return function() {
                    return t4.preloadingURL = null, typeof n2 == "function" ? n2() : void 0;
                  };
                }(this))) : void 0;
              }, o;
            }(e.Object);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Piece = function(n2) {
              function i(t3, n3) {
                n3 == null && (n3 = {}), i.__super__.constructor.apply(this, arguments), this.attributes = e.Hash.box(n3);
              }
              return t2(i, n2), i.types = {}, i.registerType = function(t3, e2) {
                return e2.type = t3, this.types[t3] = e2;
              }, i.fromJSON = function(t3) {
                var e2;
                return (e2 = this.types[t3.type]) ? e2.fromJSON(t3) : void 0;
              }, i.prototype.copyWithAttributes = function(t3) {
                return new this.constructor(this.getValue(), t3);
              }, i.prototype.copyWithAdditionalAttributes = function(t3) {
                return this.copyWithAttributes(this.attributes.merge(t3));
              }, i.prototype.copyWithoutAttribute = function(t3) {
                return this.copyWithAttributes(this.attributes.remove(t3));
              }, i.prototype.copy = function() {
                return this.copyWithAttributes(this.attributes);
              }, i.prototype.getAttribute = function(t3) {
                return this.attributes.get(t3);
              }, i.prototype.getAttributesHash = function() {
                return this.attributes;
              }, i.prototype.getAttributes = function() {
                return this.attributes.toObject();
              }, i.prototype.getCommonAttributes = function() {
                var t3, e2, n3;
                return (n3 = pieceList.getPieceAtIndex(0)) ? (t3 = n3.attributes, e2 = t3.getKeys(), pieceList.eachPiece(function(n4) {
                  return e2 = t3.getKeysCommonToHash(n4.attributes), t3 = t3.slice(e2);
                }), t3.toObject()) : {};
              }, i.prototype.hasAttribute = function(t3) {
                return this.attributes.has(t3);
              }, i.prototype.hasSameStringValueAsPiece = function(t3) {
                return t3 != null && this.toString() === t3.toString();
              }, i.prototype.hasSameAttributesAsPiece = function(t3) {
                return t3 != null && (this.attributes === t3.attributes || this.attributes.isEqualTo(t3.attributes));
              }, i.prototype.isBlockBreak = function() {
                return false;
              }, i.prototype.isEqualTo = function(t3) {
                return i.__super__.isEqualTo.apply(this, arguments) || this.hasSameConstructorAs(t3) && this.hasSameStringValueAsPiece(t3) && this.hasSameAttributesAsPiece(t3);
              }, i.prototype.isEmpty = function() {
                return this.length === 0;
              }, i.prototype.isSerializable = function() {
                return true;
              }, i.prototype.toJSON = function() {
                return { type: this.constructor.type, attributes: this.getAttributes() };
              }, i.prototype.contentsForInspection = function() {
                return { type: this.constructor.type, attributes: this.attributes.inspect() };
              }, i.prototype.canBeGrouped = function() {
                return this.hasAttribute("href");
              }, i.prototype.canBeGroupedWith = function(t3) {
                return this.getAttribute("href") === t3.getAttribute("href");
              }, i.prototype.getLength = function() {
                return this.length;
              }, i.prototype.canBeConsolidatedWith = function() {
                return false;
              }, i;
            }(e.Object);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Piece.registerType("attachment", e.AttachmentPiece = function(n2) {
              function i(t3) {
                this.attachment = t3, i.__super__.constructor.apply(this, arguments), this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
              }
              return t2(i, n2), i.fromJSON = function(t3) {
                return new this(e.Attachment.fromJSON(t3.attachment), t3.attributes);
              }, i.permittedAttributes = ["caption", "presentation"], i.prototype.ensureAttachmentExclusivelyHasAttribute = function(t3) {
                return this.hasAttribute(t3) ? (this.attachment.hasAttribute(t3) || this.attachment.setAttributes(this.attributes.slice(t3)), this.attributes = this.attributes.remove(t3)) : void 0;
              }, i.prototype.removeProhibitedAttributes = function() {
                var t3;
                return t3 = this.attributes.slice(this.constructor.permittedAttributes), t3.isEqualTo(this.attributes) ? void 0 : this.attributes = t3;
              }, i.prototype.getValue = function() {
                return this.attachment;
              }, i.prototype.isSerializable = function() {
                return !this.attachment.isPending();
              }, i.prototype.getCaption = function() {
                var t3;
                return (t3 = this.attributes.get("caption")) != null ? t3 : "";
              }, i.prototype.isEqualTo = function(t3) {
                var e2;
                return i.__super__.isEqualTo.apply(this, arguments) && this.attachment.id === (t3 != null && (e2 = t3.attachment) != null ? e2.id : void 0);
              }, i.prototype.toString = function() {
                return e.OBJECT_REPLACEMENT_CHARACTER;
              }, i.prototype.toJSON = function() {
                var t3;
                return t3 = i.__super__.toJSON.apply(this, arguments), t3.attachment = this.attachment, t3;
              }, i.prototype.getCacheKey = function() {
                return [i.__super__.getCacheKey.apply(this, arguments), this.attachment.getCacheKey()].join("/");
              }, i.prototype.toConsole = function() {
                return JSON.stringify(this.toString());
              }, i;
            }(e.Piece));
          }.call(this), function() {
            var t2, n = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var o in e2)
                i.call(e2, o) && (t3[o] = e2[o]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, i = {}.hasOwnProperty;
            t2 = e.normalizeNewlines, e.Piece.registerType("string", e.StringPiece = function(e2) {
              function i2(e3) {
                i2.__super__.constructor.apply(this, arguments), this.string = t2(e3), this.length = this.string.length;
              }
              return n(i2, e2), i2.fromJSON = function(t3) {
                return new this(t3.string, t3.attributes);
              }, i2.prototype.getValue = function() {
                return this.string;
              }, i2.prototype.toString = function() {
                return this.string.toString();
              }, i2.prototype.isBlockBreak = function() {
                return this.toString() === "\n" && this.getAttribute("blockBreak") === true;
              }, i2.prototype.toJSON = function() {
                var t3;
                return t3 = i2.__super__.toJSON.apply(this, arguments), t3.string = this.string, t3;
              }, i2.prototype.canBeConsolidatedWith = function(t3) {
                return t3 != null && this.hasSameConstructorAs(t3) && this.hasSameAttributesAsPiece(t3);
              }, i2.prototype.consolidateWith = function(t3) {
                return new this.constructor(this.toString() + t3.toString(), this.attributes);
              }, i2.prototype.splitAtOffset = function(t3) {
                var e3, n2;
                return t3 === 0 ? (e3 = null, n2 = this) : t3 === this.length ? (e3 = this, n2 = null) : (e3 = new this.constructor(this.string.slice(0, t3), this.attributes), n2 = new this.constructor(this.string.slice(t3), this.attributes)), [e3, n2];
              }, i2.prototype.toConsole = function() {
                var t3;
                return t3 = this.string, t3.length > 15 && (t3 = t3.slice(0, 14) + "\u2026"), JSON.stringify(t3.toString());
              }, i2;
            }(e.Piece));
          }.call(this), function() {
            var t2, n = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var o2 in e2)
                i.call(e2, o2) && (t3[o2] = e2[o2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, i = {}.hasOwnProperty, o = [].slice;
            t2 = e.spliceArray, e.SplittableList = function(e2) {
              function i2(t3) {
                t3 == null && (t3 = []), i2.__super__.constructor.apply(this, arguments), this.objects = t3.slice(0), this.length = this.objects.length;
              }
              var r, s, a;
              return n(i2, e2), i2.box = function(t3) {
                return t3 instanceof this ? t3 : new this(t3);
              }, i2.prototype.indexOf = function(t3) {
                return this.objects.indexOf(t3);
              }, i2.prototype.splice = function() {
                var e3;
                return e3 = 1 <= arguments.length ? o.call(arguments, 0) : [], new this.constructor(t2.apply(null, [this.objects].concat(o.call(e3))));
              }, i2.prototype.eachObject = function(t3) {
                var e3, n2, i3, o2, r2, s2;
                for (r2 = this.objects, s2 = [], n2 = e3 = 0, i3 = r2.length; i3 > e3; n2 = ++e3)
                  o2 = r2[n2], s2.push(t3(o2, n2));
                return s2;
              }, i2.prototype.insertObjectAtIndex = function(t3, e3) {
                return this.splice(e3, 0, t3);
              }, i2.prototype.insertSplittableListAtIndex = function(t3, e3) {
                return this.splice.apply(this, [e3, 0].concat(o.call(t3.objects)));
              }, i2.prototype.insertSplittableListAtPosition = function(t3, e3) {
                var n2, i3, o2;
                return o2 = this.splitObjectAtPosition(e3), i3 = o2[0], n2 = o2[1], new this.constructor(i3).insertSplittableListAtIndex(t3, n2);
              }, i2.prototype.editObjectAtIndex = function(t3, e3) {
                return this.replaceObjectAtIndex(e3(this.objects[t3]), t3);
              }, i2.prototype.replaceObjectAtIndex = function(t3, e3) {
                return this.splice(e3, 1, t3);
              }, i2.prototype.removeObjectAtIndex = function(t3) {
                return this.splice(t3, 1);
              }, i2.prototype.getObjectAtIndex = function(t3) {
                return this.objects[t3];
              }, i2.prototype.getSplittableListInRange = function(t3) {
                var e3, n2, i3, o2;
                return i3 = this.splitObjectsAtRange(t3), n2 = i3[0], e3 = i3[1], o2 = i3[2], new this.constructor(n2.slice(e3, o2 + 1));
              }, i2.prototype.selectSplittableList = function(t3) {
                var e3, n2;
                return n2 = function() {
                  var n3, i3, o2, r2;
                  for (o2 = this.objects, r2 = [], n3 = 0, i3 = o2.length; i3 > n3; n3++)
                    e3 = o2[n3], t3(e3) && r2.push(e3);
                  return r2;
                }.call(this), new this.constructor(n2);
              }, i2.prototype.removeObjectsInRange = function(t3) {
                var e3, n2, i3, o2;
                return i3 = this.splitObjectsAtRange(t3), n2 = i3[0], e3 = i3[1], o2 = i3[2], new this.constructor(n2).splice(e3, o2 - e3 + 1);
              }, i2.prototype.transformObjectsInRange = function(t3, e3) {
                var n2, i3, o2, r2, s2, a2, u;
                return s2 = this.splitObjectsAtRange(t3), r2 = s2[0], i3 = s2[1], a2 = s2[2], u = function() {
                  var t4, s3, u2;
                  for (u2 = [], n2 = t4 = 0, s3 = r2.length; s3 > t4; n2 = ++t4)
                    o2 = r2[n2], u2.push(n2 >= i3 && a2 >= n2 ? e3(o2) : o2);
                  return u2;
                }(), new this.constructor(u);
              }, i2.prototype.splitObjectsAtRange = function(t3) {
                var e3, n2, i3, o2, s2, u;
                return o2 = this.splitObjectAtPosition(a(t3)), n2 = o2[0], e3 = o2[1], i3 = o2[2], s2 = new this.constructor(n2).splitObjectAtPosition(r(t3) + i3), n2 = s2[0], u = s2[1], [n2, e3, u - 1];
              }, i2.prototype.getObjectAtPosition = function(t3) {
                var e3, n2, i3;
                return i3 = this.findIndexAndOffsetAtPosition(t3), e3 = i3.index, n2 = i3.offset, this.objects[e3];
              }, i2.prototype.splitObjectAtPosition = function(t3) {
                var e3, n2, i3, o2, r2, s2, a2, u, c, l;
                return s2 = this.findIndexAndOffsetAtPosition(t3), e3 = s2.index, r2 = s2.offset, o2 = this.objects.slice(0), e3 != null ? r2 === 0 ? (c = e3, l = 0) : (i3 = this.getObjectAtIndex(e3), a2 = i3.splitAtOffset(r2), n2 = a2[0], u = a2[1], o2.splice(e3, 1, n2, u), c = e3 + 1, l = n2.getLength() - r2) : (c = o2.length, l = 0), [o2, c, l];
              }, i2.prototype.consolidate = function() {
                var t3, e3, n2, i3, o2, r2;
                for (i3 = [], o2 = this.objects[0], r2 = this.objects.slice(1), t3 = 0, e3 = r2.length; e3 > t3; t3++)
                  n2 = r2[t3], (typeof o2.canBeConsolidatedWith == "function" ? o2.canBeConsolidatedWith(n2) : void 0) ? o2 = o2.consolidateWith(n2) : (i3.push(o2), o2 = n2);
                return o2 != null && i3.push(o2), new this.constructor(i3);
              }, i2.prototype.consolidateFromIndexToIndex = function(t3, e3) {
                var n2, i3, r2;
                return i3 = this.objects.slice(0), r2 = i3.slice(t3, e3 + 1), n2 = new this.constructor(r2).consolidate().toArray(), this.splice.apply(this, [t3, r2.length].concat(o.call(n2)));
              }, i2.prototype.findIndexAndOffsetAtPosition = function(t3) {
                var e3, n2, i3, o2, r2, s2, a2;
                for (e3 = 0, a2 = this.objects, i3 = n2 = 0, o2 = a2.length; o2 > n2; i3 = ++n2) {
                  if (s2 = a2[i3], r2 = e3 + s2.getLength(), t3 >= e3 && r2 > t3)
                    return { index: i3, offset: t3 - e3 };
                  e3 = r2;
                }
                return { index: null, offset: null };
              }, i2.prototype.findPositionAtIndexAndOffset = function(t3, e3) {
                var n2, i3, o2, r2, s2, a2;
                for (s2 = 0, a2 = this.objects, n2 = i3 = 0, o2 = a2.length; o2 > i3; n2 = ++i3)
                  if (r2 = a2[n2], t3 > n2)
                    s2 += r2.getLength();
                  else if (n2 === t3) {
                    s2 += e3;
                    break;
                  }
                return s2;
              }, i2.prototype.getEndPosition = function() {
                var t3, e3;
                return this.endPosition != null ? this.endPosition : this.endPosition = function() {
                  var n2, i3, o2;
                  for (e3 = 0, o2 = this.objects, n2 = 0, i3 = o2.length; i3 > n2; n2++)
                    t3 = o2[n2], e3 += t3.getLength();
                  return e3;
                }.call(this);
              }, i2.prototype.toString = function() {
                return this.objects.join("");
              }, i2.prototype.toArray = function() {
                return this.objects.slice(0);
              }, i2.prototype.toJSON = function() {
                return this.toArray();
              }, i2.prototype.isEqualTo = function(t3) {
                return i2.__super__.isEqualTo.apply(this, arguments) || s(this.objects, t3 != null ? t3.objects : void 0);
              }, s = function(t3, e3) {
                var n2, i3, o2, r2, s2;
                if (e3 == null && (e3 = []), t3.length !== e3.length)
                  return false;
                for (s2 = true, i3 = n2 = 0, o2 = t3.length; o2 > n2; i3 = ++n2)
                  r2 = t3[i3], s2 && !r2.isEqualTo(e3[i3]) && (s2 = false);
                return s2;
              }, i2.prototype.contentsForInspection = function() {
                var t3;
                return { objects: "[" + function() {
                  var e3, n2, i3, o2;
                  for (i3 = this.objects, o2 = [], e3 = 0, n2 = i3.length; n2 > e3; e3++)
                    t3 = i3[e3], o2.push(t3.inspect());
                  return o2;
                }.call(this).join(", ") + "]" };
              }, a = function(t3) {
                return t3[0];
              }, r = function(t3) {
                return t3[1];
              }, i2;
            }(e.Object);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.Text = function(n2) {
              function i(t3) {
                var n3;
                t3 == null && (t3 = []), i.__super__.constructor.apply(this, arguments), this.pieceList = new e.SplittableList(function() {
                  var e2, i2, o;
                  for (o = [], e2 = 0, i2 = t3.length; i2 > e2; e2++)
                    n3 = t3[e2], n3.isEmpty() || o.push(n3);
                  return o;
                }());
              }
              return t2(i, n2), i.textForAttachmentWithAttributes = function(t3, n3) {
                var i2;
                return i2 = new e.AttachmentPiece(t3, n3), new this([i2]);
              }, i.textForStringWithAttributes = function(t3, n3) {
                var i2;
                return i2 = new e.StringPiece(t3, n3), new this([i2]);
              }, i.fromJSON = function(t3) {
                var n3, i2;
                return i2 = function() {
                  var i3, o, r;
                  for (r = [], i3 = 0, o = t3.length; o > i3; i3++)
                    n3 = t3[i3], r.push(e.Piece.fromJSON(n3));
                  return r;
                }(), new this(i2);
              }, i.prototype.copy = function() {
                return this.copyWithPieceList(this.pieceList);
              }, i.prototype.copyWithPieceList = function(t3) {
                return new this.constructor(t3.consolidate().toArray());
              }, i.prototype.copyUsingObjectMap = function(t3) {
                var e2, n3;
                return n3 = function() {
                  var n4, i2, o, r, s;
                  for (o = this.getPieces(), s = [], n4 = 0, i2 = o.length; i2 > n4; n4++)
                    e2 = o[n4], s.push((r = t3.find(e2)) != null ? r : e2);
                  return s;
                }.call(this), new this.constructor(n3);
              }, i.prototype.appendText = function(t3) {
                return this.insertTextAtPosition(t3, this.getLength());
              }, i.prototype.insertTextAtPosition = function(t3, e2) {
                return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t3.pieceList, e2));
              }, i.prototype.removeTextAtRange = function(t3) {
                return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t3));
              }, i.prototype.replaceTextAtRange = function(t3, e2) {
                return this.removeTextAtRange(e2).insertTextAtPosition(t3, e2[0]);
              }, i.prototype.moveTextFromRangeToPosition = function(t3, e2) {
                var n3, i2;
                if (!(t3[0] <= e2 && e2 <= t3[1]))
                  return i2 = this.getTextAtRange(t3), n3 = i2.getLength(), t3[0] < e2 && (e2 -= n3), this.removeTextAtRange(t3).insertTextAtPosition(i2, e2);
              }, i.prototype.addAttributeAtRange = function(t3, e2, n3) {
                var i2;
                return i2 = {}, i2[t3] = e2, this.addAttributesAtRange(i2, n3);
              }, i.prototype.addAttributesAtRange = function(t3, e2) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, function(e3) {
                  return e3.copyWithAdditionalAttributes(t3);
                }));
              }, i.prototype.removeAttributeAtRange = function(t3, e2) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, function(e3) {
                  return e3.copyWithoutAttribute(t3);
                }));
              }, i.prototype.setAttributesAtRange = function(t3, e2) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e2, function(e3) {
                  return e3.copyWithAttributes(t3);
                }));
              }, i.prototype.getAttributesAtPosition = function(t3) {
                var e2, n3;
                return (e2 = (n3 = this.pieceList.getObjectAtPosition(t3)) != null ? n3.getAttributes() : void 0) != null ? e2 : {};
              }, i.prototype.getCommonAttributes = function() {
                var t3, n3;
                return t3 = function() {
                  var t4, e2, i2, o;
                  for (i2 = this.pieceList.toArray(), o = [], t4 = 0, e2 = i2.length; e2 > t4; t4++)
                    n3 = i2[t4], o.push(n3.getAttributes());
                  return o;
                }.call(this), e.Hash.fromCommonAttributesOfObjects(t3).toObject();
              }, i.prototype.getCommonAttributesAtRange = function(t3) {
                var e2;
                return (e2 = this.getTextAtRange(t3).getCommonAttributes()) != null ? e2 : {};
              }, i.prototype.getExpandedRangeForAttributeAtOffset = function(t3, e2) {
                var n3, i2, o;
                for (n3 = o = e2, i2 = this.getLength(); n3 > 0 && this.getCommonAttributesAtRange([n3 - 1, o])[t3]; )
                  n3--;
                for (; i2 > o && this.getCommonAttributesAtRange([e2, o + 1])[t3]; )
                  o++;
                return [n3, o];
              }, i.prototype.getTextAtRange = function(t3) {
                return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t3));
              }, i.prototype.getStringAtRange = function(t3) {
                return this.pieceList.getSplittableListInRange(t3).toString();
              }, i.prototype.getStringAtPosition = function(t3) {
                return this.getStringAtRange([t3, t3 + 1]);
              }, i.prototype.startsWithString = function(t3) {
                return this.getStringAtRange([0, t3.length]) === t3;
              }, i.prototype.endsWithString = function(t3) {
                var e2;
                return e2 = this.getLength(), this.getStringAtRange([e2 - t3.length, e2]) === t3;
              }, i.prototype.getAttachmentPieces = function() {
                var t3, e2, n3, i2, o;
                for (i2 = this.pieceList.toArray(), o = [], t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  n3 = i2[t3], n3.attachment != null && o.push(n3);
                return o;
              }, i.prototype.getAttachments = function() {
                var t3, e2, n3, i2, o;
                for (i2 = this.getAttachmentPieces(), o = [], t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  n3 = i2[t3], o.push(n3.attachment);
                return o;
              }, i.prototype.getAttachmentAndPositionById = function(t3) {
                var e2, n3, i2, o, r, s;
                for (o = 0, r = this.pieceList.toArray(), e2 = 0, n3 = r.length; n3 > e2; e2++) {
                  if (i2 = r[e2], ((s = i2.attachment) != null ? s.id : void 0) === t3)
                    return { attachment: i2.attachment, position: o };
                  o += i2.length;
                }
                return { attachment: null, position: null };
              }, i.prototype.getAttachmentById = function(t3) {
                var e2, n3, i2;
                return i2 = this.getAttachmentAndPositionById(t3), e2 = i2.attachment, n3 = i2.position, e2;
              }, i.prototype.getRangeOfAttachment = function(t3) {
                var e2, n3;
                return n3 = this.getAttachmentAndPositionById(t3.id), t3 = n3.attachment, e2 = n3.position, t3 != null ? [e2, e2 + 1] : void 0;
              }, i.prototype.updateAttributesForAttachment = function(t3, e2) {
                var n3;
                return (n3 = this.getRangeOfAttachment(e2)) ? this.addAttributesAtRange(t3, n3) : this;
              }, i.prototype.getLength = function() {
                return this.pieceList.getEndPosition();
              }, i.prototype.isEmpty = function() {
                return this.getLength() === 0;
              }, i.prototype.isEqualTo = function(t3) {
                var e2;
                return i.__super__.isEqualTo.apply(this, arguments) || (t3 != null && (e2 = t3.pieceList) != null ? e2.isEqualTo(this.pieceList) : void 0);
              }, i.prototype.isBlockBreak = function() {
                return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
              }, i.prototype.eachPiece = function(t3) {
                return this.pieceList.eachObject(t3);
              }, i.prototype.getPieces = function() {
                return this.pieceList.toArray();
              }, i.prototype.getPieceAtPosition = function(t3) {
                return this.pieceList.getObjectAtPosition(t3);
              }, i.prototype.contentsForInspection = function() {
                return { pieceList: this.pieceList.inspect() };
              }, i.prototype.toSerializableText = function() {
                var t3;
                return t3 = this.pieceList.selectSplittableList(function(t4) {
                  return t4.isSerializable();
                }), this.copyWithPieceList(t3);
              }, i.prototype.toString = function() {
                return this.pieceList.toString();
              }, i.prototype.toJSON = function() {
                return this.pieceList.toJSON();
              }, i.prototype.toConsole = function() {
                var t3;
                return JSON.stringify(function() {
                  var e2, n3, i2, o;
                  for (i2 = this.pieceList.toArray(), o = [], e2 = 0, n3 = i2.length; n3 > e2; e2++)
                    t3 = i2[e2], o.push(JSON.parse(t3.toConsole()));
                  return o;
                }.call(this));
              }, i.prototype.getDirection = function() {
                return e.getDirection(this.toString());
              }, i.prototype.isRTL = function() {
                return this.getDirection() === "rtl";
              }, i;
            }(e.Object);
          }.call(this), function() {
            var t2, n, i, o, r, s = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                a.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, a = {}.hasOwnProperty, u = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            }, c = [].slice;
            t2 = e.arraysAreEqual, r = e.spliceArray, i = e.getBlockConfig, n = e.getBlockAttributeNames, o = e.getListAttributeNames, e.Block = function(n2) {
              function a2(t3, n3) {
                t3 == null && (t3 = new e.Text()), n3 == null && (n3 = []), a2.__super__.constructor.apply(this, arguments), this.text = h(t3), this.attributes = n3;
              }
              var l, h, p, d, f, g, m, v, y;
              return s(a2, n2), a2.fromJSON = function(t3) {
                var n3;
                return n3 = e.Text.fromJSON(t3.text), new this(n3, t3.attributes);
              }, a2.prototype.isEmpty = function() {
                return this.text.isBlockBreak();
              }, a2.prototype.isEqualTo = function(e2) {
                return a2.__super__.isEqualTo.apply(this, arguments) || this.text.isEqualTo(e2 != null ? e2.text : void 0) && t2(this.attributes, e2 != null ? e2.attributes : void 0);
              }, a2.prototype.copyWithText = function(t3) {
                return new this.constructor(t3, this.attributes);
              }, a2.prototype.copyWithoutText = function() {
                return this.copyWithText(null);
              }, a2.prototype.copyWithAttributes = function(t3) {
                return new this.constructor(this.text, t3);
              }, a2.prototype.copyWithoutAttributes = function() {
                return this.copyWithAttributes(null);
              }, a2.prototype.copyUsingObjectMap = function(t3) {
                var e2;
                return this.copyWithText((e2 = t3.find(this.text)) ? e2 : this.text.copyUsingObjectMap(t3));
              }, a2.prototype.addAttribute = function(t3) {
                var e2;
                return e2 = this.attributes.concat(d(t3)), this.copyWithAttributes(e2);
              }, a2.prototype.removeAttribute = function(t3) {
                var e2, n3;
                return n3 = i(t3).listAttribute, e2 = g(g(this.attributes, t3), n3), this.copyWithAttributes(e2);
              }, a2.prototype.removeLastAttribute = function() {
                return this.removeAttribute(this.getLastAttribute());
              }, a2.prototype.getLastAttribute = function() {
                return f(this.attributes);
              }, a2.prototype.getAttributes = function() {
                return this.attributes.slice(0);
              }, a2.prototype.getAttributeLevel = function() {
                return this.attributes.length;
              }, a2.prototype.getAttributeAtLevel = function(t3) {
                return this.attributes[t3 - 1];
              }, a2.prototype.hasAttribute = function(t3) {
                return u.call(this.attributes, t3) >= 0;
              }, a2.prototype.hasAttributes = function() {
                return this.getAttributeLevel() > 0;
              }, a2.prototype.getLastNestableAttribute = function() {
                return f(this.getNestableAttributes());
              }, a2.prototype.getNestableAttributes = function() {
                var t3, e2, n3, o2, r2;
                for (o2 = this.attributes, r2 = [], e2 = 0, n3 = o2.length; n3 > e2; e2++)
                  t3 = o2[e2], i(t3).nestable && r2.push(t3);
                return r2;
              }, a2.prototype.getNestingLevel = function() {
                return this.getNestableAttributes().length;
              }, a2.prototype.decreaseNestingLevel = function() {
                var t3;
                return (t3 = this.getLastNestableAttribute()) ? this.removeAttribute(t3) : this;
              }, a2.prototype.increaseNestingLevel = function() {
                var t3, e2, n3;
                return (t3 = this.getLastNestableAttribute()) ? (n3 = this.attributes.lastIndexOf(t3), e2 = r.apply(null, [this.attributes, n3 + 1, 0].concat(c.call(d(t3)))), this.copyWithAttributes(e2)) : this;
              }, a2.prototype.getListItemAttributes = function() {
                var t3, e2, n3, o2, r2;
                for (o2 = this.attributes, r2 = [], e2 = 0, n3 = o2.length; n3 > e2; e2++)
                  t3 = o2[e2], i(t3).listAttribute && r2.push(t3);
                return r2;
              }, a2.prototype.isListItem = function() {
                var t3;
                return (t3 = i(this.getLastAttribute())) != null ? t3.listAttribute : void 0;
              }, a2.prototype.isTerminalBlock = function() {
                var t3;
                return (t3 = i(this.getLastAttribute())) != null ? t3.terminal : void 0;
              }, a2.prototype.breaksOnReturn = function() {
                var t3;
                return (t3 = i(this.getLastAttribute())) != null ? t3.breakOnReturn : void 0;
              }, a2.prototype.findLineBreakInDirectionFromPosition = function(t3, e2) {
                var n3, i2;
                return i2 = this.toString(), n3 = function() {
                  switch (t3) {
                    case "forward":
                      return i2.indexOf("\n", e2);
                    case "backward":
                      return i2.slice(0, e2).lastIndexOf("\n");
                  }
                }(), n3 !== -1 ? n3 : void 0;
              }, a2.prototype.contentsForInspection = function() {
                return { text: this.text.inspect(), attributes: this.attributes };
              }, a2.prototype.toString = function() {
                return this.text.toString();
              }, a2.prototype.toJSON = function() {
                return { text: this.text, attributes: this.attributes };
              }, a2.prototype.getDirection = function() {
                return this.text.getDirection();
              }, a2.prototype.isRTL = function() {
                return this.text.isRTL();
              }, a2.prototype.getLength = function() {
                return this.text.getLength();
              }, a2.prototype.canBeConsolidatedWith = function(t3) {
                return !this.hasAttributes() && !t3.hasAttributes() && this.getDirection() === t3.getDirection();
              }, a2.prototype.consolidateWith = function(t3) {
                var n3, i2;
                return n3 = e.Text.textForStringWithAttributes("\n"), i2 = this.getTextWithoutBlockBreak().appendText(n3), this.copyWithText(i2.appendText(t3.text));
              }, a2.prototype.splitAtOffset = function(t3) {
                var e2, n3;
                return t3 === 0 ? (e2 = null, n3 = this) : t3 === this.getLength() ? (e2 = this, n3 = null) : (e2 = this.copyWithText(this.text.getTextAtRange([0, t3])), n3 = this.copyWithText(this.text.getTextAtRange([t3, this.getLength()]))), [e2, n3];
              }, a2.prototype.getBlockBreakPosition = function() {
                return this.text.getLength() - 1;
              }, a2.prototype.getTextWithoutBlockBreak = function() {
                return m(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
              }, a2.prototype.canBeGrouped = function(t3) {
                return this.attributes[t3];
              }, a2.prototype.canBeGroupedWith = function(t3, e2) {
                var n3, r2, s2, a3;
                return s2 = t3.getAttributes(), r2 = s2[e2], n3 = this.attributes[e2], !(n3 !== r2 || i(n3).group === false && (a3 = s2[e2 + 1], u.call(o(), a3) < 0) || this.getDirection() !== t3.getDirection() && !t3.isEmpty());
              }, h = function(t3) {
                return t3 = y(t3), t3 = l(t3);
              }, y = function(t3) {
                var n3, i2, o2, r2, s2, a3;
                return r2 = false, a3 = t3.getPieces(), i2 = 2 <= a3.length ? c.call(a3, 0, n3 = a3.length - 1) : (n3 = 0, []), o2 = a3[n3++], o2 == null ? t3 : (i2 = function() {
                  var t4, e2, n4;
                  for (n4 = [], t4 = 0, e2 = i2.length; e2 > t4; t4++)
                    s2 = i2[t4], s2.isBlockBreak() ? (r2 = true, n4.push(v(s2))) : n4.push(s2);
                  return n4;
                }(), r2 ? new e.Text(c.call(i2).concat([o2])) : t3);
              }, p = e.Text.textForStringWithAttributes("\n", { blockBreak: true }), l = function(t3) {
                return m(t3) ? t3 : t3.appendText(p);
              }, m = function(t3) {
                var e2, n3;
                return n3 = t3.getLength(), n3 === 0 ? false : (e2 = t3.getTextAtRange([n3 - 1, n3]), e2.isBlockBreak());
              }, v = function(t3) {
                return t3.copyWithoutAttribute("blockBreak");
              }, d = function(t3) {
                var e2;
                return e2 = i(t3).listAttribute, e2 != null ? [e2, t3] : [t3];
              }, f = function(t3) {
                return t3.slice(-1)[0];
              }, g = function(t3, e2) {
                var n3;
                return n3 = t3.lastIndexOf(e2), n3 === -1 ? t3 : r(t3, n3, 1);
              }, a2;
            }(e.Object);
          }.call(this), function() {
            var t2, n, i, o = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                r.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, r = {}.hasOwnProperty, s = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            }, a = [].slice;
            n = e.tagName, i = e.walkTree, t2 = e.nodeIsAttachmentElement, e.HTMLSanitizer = function(r2) {
              function u(t3, e2) {
                var n2;
                n2 = e2 != null ? e2 : {}, this.allowedAttributes = n2.allowedAttributes, this.forbiddenProtocols = n2.forbiddenProtocols, this.forbiddenElements = n2.forbiddenElements, this.allowedAttributes == null && (this.allowedAttributes = c), this.forbiddenProtocols == null && (this.forbiddenProtocols = h), this.forbiddenElements == null && (this.forbiddenElements = l), this.body = p(t3);
              }
              var c, l, h, p;
              return o(u, r2), c = "style href src width height class".split(" "), h = "javascript:".split(" "), l = "script iframe".split(" "), u.sanitize = function(t3, e2) {
                var n2;
                return n2 = new this(t3, e2), n2.sanitize(), n2;
              }, u.prototype.sanitize = function() {
                return this.sanitizeElements(), this.normalizeListElementNesting();
              }, u.prototype.getHTML = function() {
                return this.body.innerHTML;
              }, u.prototype.getBody = function() {
                return this.body;
              }, u.prototype.sanitizeElements = function() {
                var t3, n2, o2, r3, s2;
                for (s2 = i(this.body), r3 = []; s2.nextNode(); )
                  switch (o2 = s2.currentNode, o2.nodeType) {
                    case Node.ELEMENT_NODE:
                      this.elementIsRemovable(o2) ? r3.push(o2) : this.sanitizeElement(o2);
                      break;
                    case Node.COMMENT_NODE:
                      r3.push(o2);
                  }
                for (t3 = 0, n2 = r3.length; n2 > t3; t3++)
                  o2 = r3[t3], e.removeNode(o2);
                return this.body;
              }, u.prototype.sanitizeElement = function(t3) {
                var e2, n2, i2, o2, r3;
                for (t3.hasAttribute("href") && (o2 = t3.protocol, s.call(this.forbiddenProtocols, o2) >= 0 && t3.removeAttribute("href")), r3 = a.call(t3.attributes), e2 = 0, n2 = r3.length; n2 > e2; e2++)
                  i2 = r3[e2].name, s.call(this.allowedAttributes, i2) >= 0 || i2.indexOf("data-trix") === 0 || t3.removeAttribute(i2);
                return t3;
              }, u.prototype.normalizeListElementNesting = function() {
                var t3, e2, i2, o2, r3;
                for (r3 = a.call(this.body.querySelectorAll("ul,ol")), t3 = 0, e2 = r3.length; e2 > t3; t3++)
                  i2 = r3[t3], (o2 = i2.previousElementSibling) && n(o2) === "li" && o2.appendChild(i2);
                return this.body;
              }, u.prototype.elementIsRemovable = function(t3) {
                return (t3 != null ? t3.nodeType : void 0) === Node.ELEMENT_NODE ? this.elementIsForbidden(t3) || this.elementIsntSerializable(t3) : void 0;
              }, u.prototype.elementIsForbidden = function(t3) {
                var e2;
                return e2 = n(t3), s.call(this.forbiddenElements, e2) >= 0;
              }, u.prototype.elementIsntSerializable = function(e2) {
                return e2.getAttribute("data-trix-serialize") === "false" && !t2(e2);
              }, p = function(t3) {
                var e2, n2, i2, o2, r3;
                for (t3 == null && (t3 = ""), t3 = t3.replace(/<\/html[^>]*>[^]*$/i, "</html>"), e2 = document.implementation.createHTMLDocument(""), e2.documentElement.innerHTML = t3, r3 = e2.head.querySelectorAll("style"), i2 = 0, o2 = r3.length; o2 > i2; i2++)
                  n2 = r3[i2], e2.body.appendChild(n2);
                return e2.body;
              }, u;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c, l, h, p = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                d.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, d = {}.hasOwnProperty, f = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = e.arraysAreEqual, s = e.makeElement, l = e.tagName, r = e.getBlockTagNames, h = e.walkTree, o = e.findClosestElementFromNode, i = e.elementContainsNode, a = e.nodeIsAttachmentElement, u = e.normalizeSpaces, n = e.breakableWhitespacePattern, c = e.squishBreakableWhitespace, e.HTMLParser = function(d2) {
              function g(t3, e2) {
                this.html = t3, this.referenceElement = (e2 != null ? e2 : {}).referenceElement, this.blocks = [], this.blockElements = [], this.processedElements = [];
              }
              var m, v, y, b, A, C, x, w, E, S, R, k;
              return p(g, d2), g.parse = function(t3, e2) {
                var n2;
                return n2 = new this(t3, e2), n2.parse(), n2;
              }, g.prototype.getDocument = function() {
                return e.Document.fromJSON(this.blocks);
              }, g.prototype.parse = function() {
                var t3, n2;
                try {
                  for (this.createHiddenContainer(), t3 = e.HTMLSanitizer.sanitize(this.html).getHTML(), this.containerElement.innerHTML = t3, n2 = h(this.containerElement, { usingFilter: x }); n2.nextNode(); )
                    this.processNode(n2.currentNode);
                  return this.translateBlockElementMarginsToNewlines();
                } finally {
                  this.removeHiddenContainer();
                }
              }, g.prototype.createHiddenContainer = function() {
                return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(false), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = s({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
              }, g.prototype.removeHiddenContainer = function() {
                return e.removeNode(this.containerElement);
              }, x = function(t3) {
                return l(t3) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, g.prototype.processNode = function(t3) {
                switch (t3.nodeType) {
                  case Node.TEXT_NODE:
                    if (!this.isInsignificantTextNode(t3))
                      return this.appendBlockForTextNode(t3), this.processTextNode(t3);
                    break;
                  case Node.ELEMENT_NODE:
                    return this.appendBlockForElement(t3), this.processElement(t3);
                }
              }, g.prototype.appendBlockForTextNode = function(e2) {
                var n2, i2, o2;
                return i2 = e2.parentNode, i2 === this.currentBlockElement && this.isBlockElement(e2.previousSibling) ? this.appendStringWithAttributes("\n") : i2 !== this.containerElement && !this.isBlockElement(i2) || (n2 = this.getBlockAttributes(i2), t2(n2, (o2 = this.currentBlock) != null ? o2.attributes : void 0)) ? void 0 : (this.currentBlock = this.appendBlockForAttributesWithElement(n2, i2), this.currentBlockElement = i2);
              }, g.prototype.appendBlockForElement = function(e2) {
                var n2, o2, r2, s2;
                if (r2 = this.isBlockElement(e2), o2 = i(this.currentBlockElement, e2), r2 && !this.isBlockElement(e2.firstChild)) {
                  if ((!this.isInsignificantTextNode(e2.firstChild) || !this.isBlockElement(e2.firstElementChild)) && (n2 = this.getBlockAttributes(e2), e2.firstChild))
                    return o2 && t2(n2, this.currentBlock.attributes) ? this.appendStringWithAttributes("\n") : (this.currentBlock = this.appendBlockForAttributesWithElement(n2, e2), this.currentBlockElement = e2);
                } else if (this.currentBlockElement && !o2 && !r2)
                  return (s2 = this.findParentBlockElement(e2)) ? this.appendBlockForElement(s2) : (this.currentBlock = this.appendEmptyBlock(), this.currentBlockElement = null);
              }, g.prototype.findParentBlockElement = function(t3) {
                var e2;
                for (e2 = t3.parentElement; e2 && e2 !== this.containerElement; ) {
                  if (this.isBlockElement(e2) && f.call(this.blockElements, e2) >= 0)
                    return e2;
                  e2 = e2.parentElement;
                }
                return null;
              }, g.prototype.processTextNode = function(t3) {
                var e2, n2;
                return n2 = t3.data, v(t3.parentNode) || (n2 = c(n2), R((e2 = t3.previousSibling) != null ? e2.textContent : void 0) && (n2 = A(n2))), this.appendStringWithAttributes(n2, this.getTextAttributes(t3.parentNode));
              }, g.prototype.processElement = function(t3) {
                var e2, n2, i2, o2, r2;
                if (a(t3))
                  return e2 = w(t3, "attachment"), Object.keys(e2).length && (o2 = this.getTextAttributes(t3), this.appendAttachmentWithAttributes(e2, o2), t3.innerHTML = ""), this.processedElements.push(t3);
                switch (l(t3)) {
                  case "br":
                    return this.isExtraBR(t3) || this.isBlockElement(t3.nextSibling) || this.appendStringWithAttributes("\n", this.getTextAttributes(t3)), this.processedElements.push(t3);
                  case "img":
                    e2 = { url: t3.getAttribute("src"), contentType: "image" }, i2 = b(t3);
                    for (n2 in i2)
                      r2 = i2[n2], e2[n2] = r2;
                    return this.appendAttachmentWithAttributes(e2, this.getTextAttributes(t3)), this.processedElements.push(t3);
                  case "tr":
                    if (t3.parentNode.firstChild !== t3)
                      return this.appendStringWithAttributes("\n");
                    break;
                  case "td":
                    if (t3.parentNode.firstChild !== t3)
                      return this.appendStringWithAttributes(" | ");
                }
              }, g.prototype.appendBlockForAttributesWithElement = function(t3, e2) {
                var n2;
                return this.blockElements.push(e2), n2 = m(t3), this.blocks.push(n2), n2;
              }, g.prototype.appendEmptyBlock = function() {
                return this.appendBlockForAttributesWithElement([], null);
              }, g.prototype.appendStringWithAttributes = function(t3, e2) {
                return this.appendPiece(S(t3, e2));
              }, g.prototype.appendAttachmentWithAttributes = function(t3, e2) {
                return this.appendPiece(E(t3, e2));
              }, g.prototype.appendPiece = function(t3) {
                return this.blocks.length === 0 && this.appendEmptyBlock(), this.blocks[this.blocks.length - 1].text.push(t3);
              }, g.prototype.appendStringToTextAtIndex = function(t3, e2) {
                var n2, i2;
                return i2 = this.blocks[e2].text, n2 = i2[i2.length - 1], (n2 != null ? n2.type : void 0) === "string" ? n2.string += t3 : i2.push(S(t3));
              }, g.prototype.prependStringToTextAtIndex = function(t3, e2) {
                var n2, i2;
                return i2 = this.blocks[e2].text, n2 = i2[0], (n2 != null ? n2.type : void 0) === "string" ? n2.string = t3 + n2.string : i2.unshift(S(t3));
              }, S = function(t3, e2) {
                var n2;
                return e2 == null && (e2 = {}), n2 = "string", t3 = u(t3), { string: t3, attributes: e2, type: n2 };
              }, E = function(t3, e2) {
                var n2;
                return e2 == null && (e2 = {}), n2 = "attachment", { attachment: t3, attributes: e2, type: n2 };
              }, m = function(t3) {
                var e2;
                return t3 == null && (t3 = {}), e2 = [], { text: e2, attributes: t3 };
              }, g.prototype.getTextAttributes = function(t3) {
                var n2, i2, r2, s2, u2, c2, l2, h2, p2, d3, f2, g2;
                r2 = {}, p2 = e.config.textAttributes;
                for (n2 in p2)
                  if (u2 = p2[n2], u2.tagName && o(t3, { matchingSelector: u2.tagName, untilNode: this.containerElement }))
                    r2[n2] = true;
                  else if (u2.parser) {
                    if (g2 = u2.parser(t3)) {
                      for (i2 = false, d3 = this.findBlockElementAncestors(t3), c2 = 0, h2 = d3.length; h2 > c2; c2++)
                        if (s2 = d3[c2], u2.parser(s2) === g2) {
                          i2 = true;
                          break;
                        }
                      i2 || (r2[n2] = g2);
                    }
                  } else
                    u2.styleProperty && (g2 = t3.style[u2.styleProperty]) && (r2[n2] = g2);
                if (a(t3)) {
                  f2 = w(t3, "attributes");
                  for (l2 in f2)
                    g2 = f2[l2], r2[l2] = g2;
                }
                return r2;
              }, g.prototype.getBlockAttributes = function(t3) {
                var n2, i2, o2, r2;
                for (i2 = []; t3 && t3 !== this.containerElement; ) {
                  r2 = e.config.blockAttributes;
                  for (n2 in r2)
                    o2 = r2[n2], o2.parse !== false && l(t3) === o2.tagName && ((typeof o2.test == "function" ? o2.test(t3) : void 0) || !o2.test) && (i2.push(n2), o2.listAttribute && i2.push(o2.listAttribute));
                  t3 = t3.parentNode;
                }
                return i2.reverse();
              }, g.prototype.findBlockElementAncestors = function(t3) {
                var e2, n2;
                for (e2 = []; t3 && t3 !== this.containerElement; )
                  n2 = l(t3), f.call(r(), n2) >= 0 && e2.push(t3), t3 = t3.parentNode;
                return e2;
              }, w = function(t3, e2) {
                try {
                  return JSON.parse(t3.getAttribute("data-trix-" + e2));
                } catch (n2) {
                  return {};
                }
              }, b = function(t3) {
                var e2, n2, i2;
                return i2 = t3.getAttribute("width"), n2 = t3.getAttribute("height"), e2 = {}, i2 && (e2.width = parseInt(i2, 10)), n2 && (e2.height = parseInt(n2, 10)), e2;
              }, g.prototype.isBlockElement = function(t3) {
                var e2;
                if ((t3 != null ? t3.nodeType : void 0) === Node.ELEMENT_NODE && !a(t3) && !o(t3, { matchingSelector: "td", untilNode: this.containerElement }))
                  return e2 = l(t3), f.call(r(), e2) >= 0 || window.getComputedStyle(t3).display === "block";
              }, g.prototype.isInsignificantTextNode = function(t3) {
                var e2, n2, i2;
                if ((t3 != null ? t3.nodeType : void 0) === Node.TEXT_NODE && k(t3.data) && (n2 = t3.parentNode, i2 = t3.previousSibling, e2 = t3.nextSibling, (!C(n2.previousSibling) || this.isBlockElement(n2.previousSibling)) && !v(n2)))
                  return !i2 || this.isBlockElement(i2) || !e2 || this.isBlockElement(e2);
              }, g.prototype.isExtraBR = function(t3) {
                return l(t3) === "br" && this.isBlockElement(t3.parentNode) && t3.parentNode.lastChild === t3;
              }, v = function(t3) {
                var e2;
                return e2 = window.getComputedStyle(t3).whiteSpace, e2 === "pre" || e2 === "pre-wrap" || e2 === "pre-line";
              }, C = function(t3) {
                return t3 && !R(t3.textContent);
              }, g.prototype.translateBlockElementMarginsToNewlines = function() {
                var t3, e2, n2, i2, o2, r2, s2, a2;
                for (e2 = this.getMarginOfDefaultBlockElement(), s2 = this.blocks, a2 = [], i2 = n2 = 0, o2 = s2.length; o2 > n2; i2 = ++n2)
                  t3 = s2[i2], (r2 = this.getMarginOfBlockElementAtIndex(i2)) && (r2.top > 2 * e2.top && this.prependStringToTextAtIndex("\n", i2), a2.push(r2.bottom > 2 * e2.bottom ? this.appendStringToTextAtIndex("\n", i2) : void 0));
                return a2;
              }, g.prototype.getMarginOfBlockElementAtIndex = function(t3) {
                var e2, n2;
                return !(e2 = this.blockElements[t3]) || !e2.textContent || (n2 = l(e2), f.call(r(), n2) >= 0 || f.call(this.processedElements, e2) >= 0) ? void 0 : y(e2);
              }, g.prototype.getMarginOfDefaultBlockElement = function() {
                var t3;
                return t3 = s(e.config.blockAttributes["default"].tagName), this.containerElement.appendChild(t3), y(t3);
              }, y = function(t3) {
                var e2;
                return e2 = window.getComputedStyle(t3), e2.display === "block" ? { top: parseInt(e2.marginTop), bottom: parseInt(e2.marginBottom) } : void 0;
              }, A = function(t3) {
                return t3.replace(RegExp("^" + n.source + "+"), "");
              }, k = function(t3) {
                return RegExp("^" + n.source + "*$").test(t3);
              }, R = function(t3) {
                return /\s$/.test(t3);
              }, g;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                s.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, s = {}.hasOwnProperty, a = [].slice, u = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = e.arraysAreEqual, i = e.normalizeRange, o = e.rangeIsCollapsed, n = e.getBlockConfig, e.Document = function(s2) {
              function c(t3) {
                t3 == null && (t3 = []), c.__super__.constructor.apply(this, arguments), t3.length === 0 && (t3 = [new e.Block()]), this.blockList = e.SplittableList.box(t3);
              }
              var l;
              return r(c, s2), c.fromJSON = function(t3) {
                var n2, i2;
                return i2 = function() {
                  var i3, o2, r2;
                  for (r2 = [], i3 = 0, o2 = t3.length; o2 > i3; i3++)
                    n2 = t3[i3], r2.push(e.Block.fromJSON(n2));
                  return r2;
                }(), new this(i2);
              }, c.fromHTML = function(t3, n2) {
                return e.HTMLParser.parse(t3, n2).getDocument();
              }, c.fromString = function(t3, n2) {
                var i2;
                return i2 = e.Text.textForStringWithAttributes(t3, n2), new this([new e.Block(i2)]);
              }, c.prototype.isEmpty = function() {
                var t3;
                return this.blockList.length === 1 && (t3 = this.getBlockAtIndex(0), t3.isEmpty() && !t3.hasAttributes());
              }, c.prototype.copy = function(t3) {
                var e2;
                return t3 == null && (t3 = {}), e2 = t3.consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray(), new this.constructor(e2);
              }, c.prototype.copyUsingObjectsFromDocument = function(t3) {
                var n2;
                return n2 = new e.ObjectMap(t3.getObjects()), this.copyUsingObjectMap(n2);
              }, c.prototype.copyUsingObjectMap = function(t3) {
                var e2, n2, i2;
                return n2 = function() {
                  var n3, o2, r2, s3;
                  for (r2 = this.getBlocks(), s3 = [], n3 = 0, o2 = r2.length; o2 > n3; n3++)
                    e2 = r2[n3], s3.push((i2 = t3.find(e2)) ? i2 : e2.copyUsingObjectMap(t3));
                  return s3;
                }.call(this), new this.constructor(n2);
              }, c.prototype.copyWithBaseBlockAttributes = function(t3) {
                var e2, n2, i2;
                return t3 == null && (t3 = []), i2 = function() {
                  var i3, o2, r2, s3;
                  for (r2 = this.getBlocks(), s3 = [], i3 = 0, o2 = r2.length; o2 > i3; i3++)
                    n2 = r2[i3], e2 = t3.concat(n2.getAttributes()), s3.push(n2.copyWithAttributes(e2));
                  return s3;
                }.call(this), new this.constructor(i2);
              }, c.prototype.replaceBlock = function(t3, e2) {
                var n2;
                return n2 = this.blockList.indexOf(t3), n2 === -1 ? this : new this.constructor(this.blockList.replaceObjectAtIndex(e2, n2));
              }, c.prototype.insertDocumentAtRange = function(t3, e2) {
                var n2, r2, s3, a2, u2, c2, l2;
                return r2 = t3.blockList, u2 = (e2 = i(e2))[0], c2 = this.locationFromPosition(u2), s3 = c2.index, a2 = c2.offset, l2 = this, n2 = this.getBlockAtPosition(u2), o(e2) && n2.isEmpty() && !n2.hasAttributes() ? l2 = new this.constructor(l2.blockList.removeObjectAtIndex(s3)) : n2.getBlockBreakPosition() === a2 && u2++, l2 = l2.removeTextAtRange(e2), new this.constructor(l2.blockList.insertSplittableListAtPosition(r2, u2));
              }, c.prototype.mergeDocumentAtRange = function(e2, n2) {
                var o2, r2, s3, a2, u2, c2, l2, h, p, d, f, g;
                return f = (n2 = i(n2))[0], d = this.locationFromPosition(f), r2 = this.getBlockAtIndex(d.index).getAttributes(), o2 = e2.getBaseBlockAttributes(), g = r2.slice(-o2.length), t2(o2, g) ? (l2 = r2.slice(0, -o2.length), c2 = e2.copyWithBaseBlockAttributes(l2)) : c2 = e2.copy({ consolidateBlocks: true }).copyWithBaseBlockAttributes(r2), s3 = c2.getBlockCount(), a2 = c2.getBlockAtIndex(0), t2(r2, a2.getAttributes()) ? (u2 = a2.getTextWithoutBlockBreak(), p = this.insertTextAtRange(u2, n2), s3 > 1 && (c2 = new this.constructor(c2.getBlocks().slice(1)), h = f + u2.getLength(), p = p.insertDocumentAtRange(c2, h))) : p = this.insertDocumentAtRange(c2, n2), p;
              }, c.prototype.insertTextAtRange = function(t3, e2) {
                var n2, o2, r2, s3, a2;
                return a2 = (e2 = i(e2))[0], s3 = this.locationFromPosition(a2), o2 = s3.index, r2 = s3.offset, n2 = this.removeTextAtRange(e2), new this.constructor(n2.blockList.editObjectAtIndex(o2, function(e3) {
                  return e3.copyWithText(e3.text.insertTextAtPosition(t3, r2));
                }));
              }, c.prototype.removeTextAtRange = function(t3) {
                var e2, n2, r2, s3, a2, u2, c2, l2, h, p, d, f, g, m, v, y, b, A, C, x, w;
                return p = t3 = i(t3), l2 = p[0], A = p[1], o(t3) ? this : (d = this.locationRangeFromRange(t3), u2 = d[0], y = d[1], a2 = u2.index, c2 = u2.offset, s3 = this.getBlockAtIndex(a2), v = y.index, b = y.offset, m = this.getBlockAtIndex(v), f = A - l2 === 1 && s3.getBlockBreakPosition() === c2 && m.getBlockBreakPosition() !== b && m.text.getStringAtPosition(b) === "\n", f ? r2 = this.blockList.editObjectAtIndex(v, function(t4) {
                  return t4.copyWithText(t4.text.removeTextAtRange([b, b + 1]));
                }) : (h = s3.text.getTextAtRange([0, c2]), C = m.text.getTextAtRange([b, m.getLength()]), x = h.appendText(C), g = a2 !== v && c2 === 0, w = g && s3.getAttributeLevel() >= m.getAttributeLevel(), n2 = w ? m.copyWithText(x) : s3.copyWithText(x), e2 = v + 1 - a2, r2 = this.blockList.splice(a2, e2, n2)), new this.constructor(r2));
              }, c.prototype.moveTextFromRangeToPosition = function(t3, e2) {
                var n2, o2, r2, s3, u2, c2, l2, h, p, d;
                return c2 = t3 = i(t3), p = c2[0], r2 = c2[1], e2 >= p && r2 >= e2 ? this : (o2 = this.getDocumentAtRange(t3), h = this.removeTextAtRange(t3), u2 = e2 > p, u2 && (e2 -= o2.getLength()), l2 = o2.getBlocks(), s3 = l2[0], n2 = 2 <= l2.length ? a.call(l2, 1) : [], n2.length === 0 ? (d = s3.getTextWithoutBlockBreak(), u2 && (e2 += 1)) : d = s3.text, h = h.insertTextAtRange(d, e2), n2.length === 0 ? h : (o2 = new this.constructor(n2), e2 += d.getLength(), h.insertDocumentAtRange(o2, e2)));
              }, c.prototype.addAttributeAtRange = function(t3, e2, i2) {
                var o2;
                return o2 = this.blockList, this.eachBlockAtRange(i2, function(i3, r2, s3) {
                  return o2 = o2.editObjectAtIndex(s3, function() {
                    return n(t3) ? i3.addAttribute(t3, e2) : r2[0] === r2[1] ? i3 : i3.copyWithText(i3.text.addAttributeAtRange(t3, e2, r2));
                  });
                }), new this.constructor(o2);
              }, c.prototype.addAttribute = function(t3, e2) {
                var n2;
                return n2 = this.blockList, this.eachBlock(function(i2, o2) {
                  return n2 = n2.editObjectAtIndex(o2, function() {
                    return i2.addAttribute(t3, e2);
                  });
                }), new this.constructor(n2);
              }, c.prototype.removeAttributeAtRange = function(t3, e2) {
                var i2;
                return i2 = this.blockList, this.eachBlockAtRange(e2, function(e3, o2, r2) {
                  return n(t3) ? i2 = i2.editObjectAtIndex(r2, function() {
                    return e3.removeAttribute(t3);
                  }) : o2[0] !== o2[1] ? i2 = i2.editObjectAtIndex(r2, function() {
                    return e3.copyWithText(e3.text.removeAttributeAtRange(t3, o2));
                  }) : void 0;
                }), new this.constructor(i2);
              }, c.prototype.updateAttributesForAttachment = function(t3, e2) {
                var n2, i2, o2, r2;
                return o2 = (i2 = this.getRangeOfAttachment(e2))[0], n2 = this.locationFromPosition(o2).index, r2 = this.getTextAtIndex(n2), new this.constructor(this.blockList.editObjectAtIndex(n2, function(n3) {
                  return n3.copyWithText(r2.updateAttributesForAttachment(t3, e2));
                }));
              }, c.prototype.removeAttributeForAttachment = function(t3, e2) {
                var n2;
                return n2 = this.getRangeOfAttachment(e2), this.removeAttributeAtRange(t3, n2);
              }, c.prototype.insertBlockBreakAtRange = function(t3) {
                var n2, o2, r2, s3;
                return s3 = (t3 = i(t3))[0], r2 = this.locationFromPosition(s3).offset, o2 = this.removeTextAtRange(t3), r2 === 0 && (n2 = [new e.Block()]), new this.constructor(o2.blockList.insertSplittableListAtPosition(new e.SplittableList(n2), s3));
              }, c.prototype.applyBlockAttributeAtRange = function(t3, e2, i2) {
                var o2, r2, s3, a2;
                return s3 = this.expandRangeToLineBreaksAndSplitBlocks(i2), r2 = s3.document, i2 = s3.range, o2 = n(t3), o2.listAttribute ? (r2 = r2.removeLastListAttributeAtRange(i2, { exceptAttributeName: t3 }), a2 = r2.convertLineBreaksToBlockBreaksInRange(i2), r2 = a2.document, i2 = a2.range) : r2 = o2.exclusive ? r2.removeBlockAttributesAtRange(i2) : o2.terminal ? r2.removeLastTerminalAttributeAtRange(i2) : r2.consolidateBlocksAtRange(i2), r2.addAttributeAtRange(t3, e2, i2);
              }, c.prototype.removeLastListAttributeAtRange = function(t3, e2) {
                var i2;
                return e2 == null && (e2 = {}), i2 = this.blockList, this.eachBlockAtRange(t3, function(t4, o2, r2) {
                  var s3;
                  if ((s3 = t4.getLastAttribute()) && n(s3).listAttribute && s3 !== e2.exceptAttributeName)
                    return i2 = i2.editObjectAtIndex(r2, function() {
                      return t4.removeAttribute(s3);
                    });
                }), new this.constructor(i2);
              }, c.prototype.removeLastTerminalAttributeAtRange = function(t3) {
                var e2;
                return e2 = this.blockList, this.eachBlockAtRange(t3, function(t4, i2, o2) {
                  var r2;
                  if ((r2 = t4.getLastAttribute()) && n(r2).terminal)
                    return e2 = e2.editObjectAtIndex(o2, function() {
                      return t4.removeAttribute(r2);
                    });
                }), new this.constructor(e2);
              }, c.prototype.removeBlockAttributesAtRange = function(t3) {
                var e2;
                return e2 = this.blockList, this.eachBlockAtRange(t3, function(t4, n2, i2) {
                  return t4.hasAttributes() ? e2 = e2.editObjectAtIndex(i2, function() {
                    return t4.copyWithoutAttributes();
                  }) : void 0;
                }), new this.constructor(e2);
              }, c.prototype.expandRangeToLineBreaksAndSplitBlocks = function(t3) {
                var e2, n2, o2, r2, s3, a2, u2, c2, l2;
                return a2 = t3 = i(t3), l2 = a2[0], r2 = a2[1], c2 = this.locationFromPosition(l2), o2 = this.locationFromPosition(r2), e2 = this, u2 = e2.getBlockAtIndex(c2.index), (c2.offset = u2.findLineBreakInDirectionFromPosition("backward", c2.offset)) != null && (s3 = e2.positionFromLocation(c2), e2 = e2.insertBlockBreakAtRange([s3, s3 + 1]), o2.index += 1, o2.offset -= e2.getBlockAtIndex(c2.index).getLength(), c2.index += 1), c2.offset = 0, o2.offset === 0 && o2.index > c2.index ? (o2.index -= 1, o2.offset = e2.getBlockAtIndex(o2.index).getBlockBreakPosition()) : (n2 = e2.getBlockAtIndex(o2.index), n2.text.getStringAtRange([o2.offset - 1, o2.offset]) === "\n" ? o2.offset -= 1 : o2.offset = n2.findLineBreakInDirectionFromPosition("forward", o2.offset), o2.offset !== n2.getBlockBreakPosition() && (s3 = e2.positionFromLocation(o2), e2 = e2.insertBlockBreakAtRange([s3, s3 + 1]))), l2 = e2.positionFromLocation(c2), r2 = e2.positionFromLocation(o2), t3 = i([l2, r2]), { document: e2, range: t3 };
              }, c.prototype.convertLineBreaksToBlockBreaksInRange = function(t3) {
                var e2, n2, o2;
                return n2 = (t3 = i(t3))[0], o2 = this.getStringAtRange(t3).slice(0, -1), e2 = this, o2.replace(/.*?\n/g, function(t4) {
                  return n2 += t4.length, e2 = e2.insertBlockBreakAtRange([n2 - 1, n2]);
                }), { document: e2, range: t3 };
              }, c.prototype.consolidateBlocksAtRange = function(t3) {
                var e2, n2, o2, r2, s3;
                return o2 = t3 = i(t3), s3 = o2[0], n2 = o2[1], r2 = this.locationFromPosition(s3).index, e2 = this.locationFromPosition(n2).index, new this.constructor(this.blockList.consolidateFromIndexToIndex(r2, e2));
              }, c.prototype.getDocumentAtRange = function(t3) {
                var e2;
                return t3 = i(t3), e2 = this.blockList.getSplittableListInRange(t3).toArray(), new this.constructor(e2);
              }, c.prototype.getStringAtRange = function(t3) {
                var e2, n2, o2;
                return o2 = t3 = i(t3), n2 = o2[o2.length - 1], n2 !== this.getLength() && (e2 = -1), this.getDocumentAtRange(t3).toString().slice(0, e2);
              }, c.prototype.getBlockAtIndex = function(t3) {
                return this.blockList.getObjectAtIndex(t3);
              }, c.prototype.getBlockAtPosition = function(t3) {
                var e2;
                return e2 = this.locationFromPosition(t3).index, this.getBlockAtIndex(e2);
              }, c.prototype.getTextAtIndex = function(t3) {
                var e2;
                return (e2 = this.getBlockAtIndex(t3)) != null ? e2.text : void 0;
              }, c.prototype.getTextAtPosition = function(t3) {
                var e2;
                return e2 = this.locationFromPosition(t3).index, this.getTextAtIndex(e2);
              }, c.prototype.getPieceAtPosition = function(t3) {
                var e2, n2, i2;
                return i2 = this.locationFromPosition(t3), e2 = i2.index, n2 = i2.offset, this.getTextAtIndex(e2).getPieceAtPosition(n2);
              }, c.prototype.getCharacterAtPosition = function(t3) {
                var e2, n2, i2;
                return i2 = this.locationFromPosition(t3), e2 = i2.index, n2 = i2.offset, this.getTextAtIndex(e2).getStringAtRange([n2, n2 + 1]);
              }, c.prototype.getLength = function() {
                return this.blockList.getEndPosition();
              }, c.prototype.getBlocks = function() {
                return this.blockList.toArray();
              }, c.prototype.getBlockCount = function() {
                return this.blockList.length;
              }, c.prototype.getEditCount = function() {
                return this.editCount;
              }, c.prototype.eachBlock = function(t3) {
                return this.blockList.eachObject(t3);
              }, c.prototype.eachBlockAtRange = function(t3, e2) {
                var n2, o2, r2, s3, a2, u2, c2, l2, h, p, d, f;
                if (u2 = t3 = i(t3), d = u2[0], r2 = u2[1], p = this.locationFromPosition(d), o2 = this.locationFromPosition(r2), p.index === o2.index)
                  return n2 = this.getBlockAtIndex(p.index), f = [p.offset, o2.offset], e2(n2, f, p.index);
                for (h = [], a2 = s3 = c2 = p.index, l2 = o2.index; l2 >= c2 ? l2 >= s3 : s3 >= l2; a2 = l2 >= c2 ? ++s3 : --s3)
                  (n2 = this.getBlockAtIndex(a2)) ? (f = function() {
                    switch (a2) {
                      case p.index:
                        return [p.offset, n2.text.getLength()];
                      case o2.index:
                        return [0, o2.offset];
                      default:
                        return [0, n2.text.getLength()];
                    }
                  }(), h.push(e2(n2, f, a2))) : h.push(void 0);
                return h;
              }, c.prototype.getCommonAttributesAtRange = function(t3) {
                var n2, r2, s3;
                return r2 = (t3 = i(t3))[0], o(t3) ? this.getCommonAttributesAtPosition(r2) : (s3 = [], n2 = [], this.eachBlockAtRange(t3, function(t4, e2) {
                  return e2[0] !== e2[1] ? (s3.push(t4.text.getCommonAttributesAtRange(e2)), n2.push(l(t4))) : void 0;
                }), e.Hash.fromCommonAttributesOfObjects(s3).merge(e.Hash.fromCommonAttributesOfObjects(n2)).toObject());
              }, c.prototype.getCommonAttributesAtPosition = function(t3) {
                var n2, i2, o2, r2, s3, a2, c2, h, p, d;
                if (p = this.locationFromPosition(t3), s3 = p.index, h = p.offset, o2 = this.getBlockAtIndex(s3), !o2)
                  return {};
                r2 = l(o2), n2 = o2.text.getAttributesAtPosition(h), i2 = o2.text.getAttributesAtPosition(h - 1), a2 = function() {
                  var t4, n3;
                  t4 = e.config.textAttributes, n3 = [];
                  for (c2 in t4)
                    d = t4[c2], d.inheritable && n3.push(c2);
                  return n3;
                }();
                for (c2 in i2)
                  d = i2[c2], (d === n2[c2] || u.call(a2, c2) >= 0) && (r2[c2] = d);
                return r2;
              }, c.prototype.getRangeOfCommonAttributeAtPosition = function(t3, e2) {
                var n2, o2, r2, s3, a2, u2, c2, l2, h;
                return a2 = this.locationFromPosition(e2), r2 = a2.index, s3 = a2.offset, h = this.getTextAtIndex(r2), u2 = h.getExpandedRangeForAttributeAtOffset(t3, s3), l2 = u2[0], o2 = u2[1], c2 = this.positionFromLocation({ index: r2, offset: l2 }), n2 = this.positionFromLocation({ index: r2, offset: o2 }), i([c2, n2]);
              }, c.prototype.getBaseBlockAttributes = function() {
                var t3, e2, n2, i2, o2, r2, s3;
                for (t3 = this.getBlockAtIndex(0).getAttributes(), n2 = i2 = 1, s3 = this.getBlockCount(); s3 >= 1 ? s3 > i2 : i2 > s3; n2 = s3 >= 1 ? ++i2 : --i2)
                  e2 = this.getBlockAtIndex(n2).getAttributes(), r2 = Math.min(t3.length, e2.length), t3 = function() {
                    var n3, i3, s4;
                    for (s4 = [], o2 = n3 = 0, i3 = r2; (i3 >= 0 ? i3 > n3 : n3 > i3) && e2[o2] === t3[o2]; o2 = i3 >= 0 ? ++n3 : --n3)
                      s4.push(e2[o2]);
                    return s4;
                  }();
                return t3;
              }, l = function(t3) {
                var e2, n2;
                return n2 = {}, (e2 = t3.getLastAttribute()) && (n2[e2] = true), n2;
              }, c.prototype.getAttachmentById = function(t3) {
                var e2, n2, i2, o2;
                for (o2 = this.getAttachments(), n2 = 0, i2 = o2.length; i2 > n2; n2++)
                  if (e2 = o2[n2], e2.id === t3)
                    return e2;
              }, c.prototype.getAttachmentPieces = function() {
                var t3;
                return t3 = [], this.blockList.eachObject(function(e2) {
                  var n2;
                  return n2 = e2.text, t3 = t3.concat(n2.getAttachmentPieces());
                }), t3;
              }, c.prototype.getAttachments = function() {
                var t3, e2, n2, i2, o2;
                for (i2 = this.getAttachmentPieces(), o2 = [], t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  n2 = i2[t3], o2.push(n2.attachment);
                return o2;
              }, c.prototype.getRangeOfAttachment = function(t3) {
                var e2, n2, o2, r2, s3, a2, u2;
                for (r2 = 0, s3 = this.blockList.toArray(), n2 = e2 = 0, o2 = s3.length; o2 > e2; n2 = ++e2) {
                  if (a2 = s3[n2].text, u2 = a2.getRangeOfAttachment(t3))
                    return i([r2 + u2[0], r2 + u2[1]]);
                  r2 += a2.getLength();
                }
              }, c.prototype.getLocationRangeOfAttachment = function(t3) {
                var e2;
                return e2 = this.getRangeOfAttachment(t3), this.locationRangeFromRange(e2);
              }, c.prototype.getAttachmentPieceForAttachment = function(t3) {
                var e2, n2, i2, o2;
                for (o2 = this.getAttachmentPieces(), e2 = 0, n2 = o2.length; n2 > e2; e2++)
                  if (i2 = o2[e2], i2.attachment === t3)
                    return i2;
              }, c.prototype.findRangesForBlockAttribute = function(t3) {
                var e2, n2, i2, o2, r2, s3, a2;
                for (r2 = 0, s3 = [], a2 = this.getBlocks(), n2 = 0, i2 = a2.length; i2 > n2; n2++)
                  e2 = a2[n2], o2 = e2.getLength(), e2.hasAttribute(t3) && s3.push([r2, r2 + o2]), r2 += o2;
                return s3;
              }, c.prototype.findRangesForTextAttribute = function(t3, e2) {
                var n2, i2, o2, r2, s3, a2, u2, c2, l2, h;
                for (h = (e2 != null ? e2 : {}).withValue, a2 = 0, u2 = [], c2 = [], r2 = function(e3) {
                  return h != null ? e3.getAttribute(t3) === h : e3.hasAttribute(t3);
                }, l2 = this.getPieces(), n2 = 0, i2 = l2.length; i2 > n2; n2++)
                  s3 = l2[n2], o2 = s3.getLength(), r2(s3) && (u2[1] === a2 ? u2[1] = a2 + o2 : c2.push(u2 = [a2, a2 + o2])), a2 += o2;
                return c2;
              }, c.prototype.locationFromPosition = function(t3) {
                var e2, n2;
                return n2 = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, t3)), n2.index != null ? n2 : (e2 = this.getBlocks(), { index: e2.length - 1, offset: e2[e2.length - 1].getLength() });
              }, c.prototype.positionFromLocation = function(t3) {
                return this.blockList.findPositionAtIndexAndOffset(t3.index, t3.offset);
              }, c.prototype.locationRangeFromPosition = function(t3) {
                return i(this.locationFromPosition(t3));
              }, c.prototype.locationRangeFromRange = function(t3) {
                var e2, n2, o2, r2;
                if (t3 = i(t3))
                  return r2 = t3[0], n2 = t3[1], o2 = this.locationFromPosition(r2), e2 = this.locationFromPosition(n2), i([o2, e2]);
              }, c.prototype.rangeFromLocationRange = function(t3) {
                var e2, n2;
                return t3 = i(t3), e2 = this.positionFromLocation(t3[0]), o(t3) || (n2 = this.positionFromLocation(t3[1])), i([e2, n2]);
              }, c.prototype.isEqualTo = function(t3) {
                return this.blockList.isEqualTo(t3 != null ? t3.blockList : void 0);
              }, c.prototype.getTexts = function() {
                var t3, e2, n2, i2, o2;
                for (i2 = this.getBlocks(), o2 = [], e2 = 0, n2 = i2.length; n2 > e2; e2++)
                  t3 = i2[e2], o2.push(t3.text);
                return o2;
              }, c.prototype.getPieces = function() {
                var t3, e2, n2, i2, o2;
                for (n2 = [], i2 = this.getTexts(), t3 = 0, e2 = i2.length; e2 > t3; t3++)
                  o2 = i2[t3], n2.push.apply(n2, o2.getPieces());
                return n2;
              }, c.prototype.getObjects = function() {
                return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
              }, c.prototype.toSerializableDocument = function() {
                var t3;
                return t3 = [], this.blockList.eachObject(function(e2) {
                  return t3.push(e2.copyWithText(e2.text.toSerializableText()));
                }), new this.constructor(t3);
              }, c.prototype.toString = function() {
                return this.blockList.toString();
              }, c.prototype.toJSON = function() {
                return this.blockList.toJSON();
              }, c.prototype.toConsole = function() {
                var t3;
                return JSON.stringify(function() {
                  var e2, n2, i2, o2;
                  for (i2 = this.blockList.toArray(), o2 = [], e2 = 0, n2 = i2.length; n2 > e2; e2++)
                    t3 = i2[e2], o2.push(JSON.parse(t3.text.toConsole()));
                  return o2;
                }.call(this));
              }, c;
            }(e.Object);
          }.call(this), function() {
            e.LineBreakInsertion = function() {
              function t2(t3) {
                var e2;
                this.composition = t3, this.document = this.composition.document, e2 = this.composition.getSelectedRange(), this.startPosition = e2[0], this.endPosition = e2[1], this.startLocation = this.document.locationFromPosition(this.startPosition), this.endLocation = this.document.locationFromPosition(this.endPosition), this.block = this.document.getBlockAtIndex(this.endLocation.index), this.breaksOnReturn = this.block.breaksOnReturn(), this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1), this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
              }
              return t2.prototype.shouldInsertBlockBreak = function() {
                return this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty() ? this.startLocation.offset !== 0 : this.breaksOnReturn && this.nextCharacter !== "\n";
              }, t2.prototype.shouldBreakFormattedBlock = function() {
                return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === "\n" || this.previousCharacter === "\n");
              }, t2.prototype.shouldDecreaseListLevel = function() {
                return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
              }, t2.prototype.shouldPrependListItem = function() {
                return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
              }, t2.prototype.shouldRemoveLastBlockAttribute = function() {
                return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
              }, t2;
            }();
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c, l, h = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                p.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, p = {}.hasOwnProperty;
            s = e.normalizeRange, c = e.rangesAreEqual, u = e.rangeIsCollapsed, a = e.objectsAreEqual, t2 = e.arrayStartsWith, l = e.summarizeArrayChange, i = e.getAllAttributeNames, o = e.getBlockConfig, r = e.getTextConfig, n = e.extend, e.Composition = function(p2) {
              function d() {
                this.document = new e.Document(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
              }
              var f;
              return h(d, p2), d.prototype.setDocument = function(t3) {
                var e2;
                return t3.isEqualTo(this.document) ? void 0 : (this.document = t3, this.refreshAttachments(), this.revision++, (e2 = this.delegate) != null && typeof e2.compositionDidChangeDocument == "function" ? e2.compositionDidChangeDocument(t3) : void 0);
              }, d.prototype.getSnapshot = function() {
                return { document: this.document, selectedRange: this.getSelectedRange() };
              }, d.prototype.loadSnapshot = function(t3) {
                var n2, i2, o2, r2;
                return n2 = t3.document, r2 = t3.selectedRange, (i2 = this.delegate) != null && typeof i2.compositionWillLoadSnapshot == "function" && i2.compositionWillLoadSnapshot(), this.setDocument(n2 != null ? n2 : new e.Document()), this.setSelection(r2 != null ? r2 : [0, 0]), (o2 = this.delegate) != null && typeof o2.compositionDidLoadSnapshot == "function" ? o2.compositionDidLoadSnapshot() : void 0;
              }, d.prototype.insertText = function(t3, e2) {
                var n2, i2, o2, r2;
                return r2 = (e2 != null ? e2 : { updatePosition: true }).updatePosition, i2 = this.getSelectedRange(), this.setDocument(this.document.insertTextAtRange(t3, i2)), o2 = i2[0], n2 = o2 + t3.getLength(), r2 && this.setSelection(n2), this.notifyDelegateOfInsertionAtRange([o2, n2]);
              }, d.prototype.insertBlock = function(t3) {
                var n2;
                return t3 == null && (t3 = new e.Block()), n2 = new e.Document([t3]), this.insertDocument(n2);
              }, d.prototype.insertDocument = function(t3) {
                var n2, i2, o2;
                return t3 == null && (t3 = new e.Document()), i2 = this.getSelectedRange(), this.setDocument(this.document.insertDocumentAtRange(t3, i2)), o2 = i2[0], n2 = o2 + t3.getLength(), this.setSelection(n2), this.notifyDelegateOfInsertionAtRange([o2, n2]);
              }, d.prototype.insertString = function(t3, n2) {
                var i2, o2;
                return i2 = this.getCurrentTextAttributes(), o2 = e.Text.textForStringWithAttributes(t3, i2), this.insertText(o2, n2);
              }, d.prototype.insertBlockBreak = function() {
                var t3, e2, n2;
                return e2 = this.getSelectedRange(), this.setDocument(this.document.insertBlockBreakAtRange(e2)), n2 = e2[0], t3 = n2 + 1, this.setSelection(t3), this.notifyDelegateOfInsertionAtRange([n2, t3]);
              }, d.prototype.insertLineBreak = function() {
                var t3, n2;
                return n2 = new e.LineBreakInsertion(this), n2.shouldDecreaseListLevel() ? (this.decreaseListLevel(), this.setSelection(n2.startPosition)) : n2.shouldPrependListItem() ? (t3 = new e.Document([n2.block.copyWithoutText()]), this.insertDocument(t3)) : n2.shouldInsertBlockBreak() ? this.insertBlockBreak() : n2.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : n2.shouldBreakFormattedBlock() ? this.breakFormattedBlock(n2) : this.insertString("\n");
              }, d.prototype.insertHTML = function(t3) {
                var n2, i2, o2, r2;
                return n2 = e.Document.fromHTML(t3), o2 = this.getSelectedRange(), this.setDocument(this.document.mergeDocumentAtRange(n2, o2)), r2 = o2[0], i2 = r2 + n2.getLength() - 1, this.setSelection(i2), this.notifyDelegateOfInsertionAtRange([r2, i2]);
              }, d.prototype.replaceHTML = function(t3) {
                var n2, i2, o2;
                return n2 = e.Document.fromHTML(t3).copyUsingObjectsFromDocument(this.document), i2 = this.getLocationRange({ strict: false }), o2 = this.document.rangeFromLocationRange(i2), this.setDocument(n2), this.setSelection(o2);
              }, d.prototype.insertFile = function(t3) {
                return this.insertFiles([t3]);
              }, d.prototype.insertFiles = function(t3) {
                var n2, i2, o2, r2, s2, a2;
                for (i2 = [], r2 = 0, s2 = t3.length; s2 > r2; r2++)
                  o2 = t3[r2], ((a2 = this.delegate) != null ? a2.compositionShouldAcceptFile(o2) : void 0) && (n2 = e.Attachment.attachmentForFile(o2), i2.push(n2));
                return this.insertAttachments(i2);
              }, d.prototype.insertAttachment = function(t3) {
                return this.insertAttachments([t3]);
              }, d.prototype.insertAttachments = function(t3) {
                var n2, i2, o2, r2, s2, a2, u2, c2, l2;
                for (c2 = new e.Text(), r2 = 0, s2 = t3.length; s2 > r2; r2++)
                  n2 = t3[r2], l2 = n2.getType(), a2 = (u2 = e.config.attachments[l2]) != null ? u2.presentation : void 0, o2 = this.getCurrentTextAttributes(), a2 && (o2.presentation = a2), i2 = e.Text.textForAttachmentWithAttributes(n2, o2), c2 = c2.appendText(i2);
                return this.insertText(c2);
              }, d.prototype.shouldManageDeletingInDirection = function(t3) {
                var e2;
                if (e2 = this.getLocationRange(), u(e2)) {
                  if (t3 === "backward" && e2[0].offset === 0)
                    return true;
                  if (this.shouldManageMovingCursorInDirection(t3))
                    return true;
                } else if (e2[0].index !== e2[1].index)
                  return true;
                return false;
              }, d.prototype.deleteInDirection = function(t3, e2) {
                var n2, i2, o2, r2, s2, a2, c2, l2;
                return r2 = (e2 != null ? e2 : {}).length, s2 = this.getLocationRange(), a2 = this.getSelectedRange(), c2 = u(a2), c2 ? o2 = t3 === "backward" && s2[0].offset === 0 : l2 = s2[0].index !== s2[1].index, o2 && this.canDecreaseBlockAttributeLevel() && (i2 = this.getBlock(), i2.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(a2[0]), i2.isEmpty()) ? false : (c2 && (a2 = this.getExpandedRangeInDirection(t3, { length: r2 }), t3 === "backward" && (n2 = this.getAttachmentAtRange(a2))), n2 ? (this.editAttachment(n2), false) : (this.setDocument(this.document.removeTextAtRange(a2)), this.setSelection(a2[0]), o2 || l2 ? false : void 0));
              }, d.prototype.moveTextFromRange = function(t3) {
                var e2;
                return e2 = this.getSelectedRange()[0], this.setDocument(this.document.moveTextFromRangeToPosition(t3, e2)), this.setSelection(e2);
              }, d.prototype.removeAttachment = function(t3) {
                var e2;
                return (e2 = this.document.getRangeOfAttachment(t3)) ? (this.stopEditingAttachment(), this.setDocument(this.document.removeTextAtRange(e2)), this.setSelection(e2[0])) : void 0;
              }, d.prototype.removeLastBlockAttribute = function() {
                var t3, e2, n2, i2;
                return n2 = this.getSelectedRange(), i2 = n2[0], e2 = n2[1], t3 = this.document.getBlockAtPosition(e2), this.removeCurrentAttribute(t3.getLastAttribute()), this.setSelection(i2);
              }, f = " ", d.prototype.insertPlaceholder = function() {
                return this.placeholderPosition = this.getPosition(), this.insertString(f);
              }, d.prototype.selectPlaceholder = function() {
                return this.placeholderPosition != null ? (this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + f.length]), this.getSelectedRange()) : void 0;
              }, d.prototype.forgetPlaceholder = function() {
                return this.placeholderPosition = null;
              }, d.prototype.hasCurrentAttribute = function(t3) {
                var e2;
                return e2 = this.currentAttributes[t3], e2 != null && e2 !== false;
              }, d.prototype.toggleCurrentAttribute = function(t3) {
                var e2;
                return (e2 = !this.currentAttributes[t3]) ? this.setCurrentAttribute(t3, e2) : this.removeCurrentAttribute(t3);
              }, d.prototype.canSetCurrentAttribute = function(t3) {
                return o(t3) ? this.canSetCurrentBlockAttribute(t3) : this.canSetCurrentTextAttribute(t3);
              }, d.prototype.canSetCurrentTextAttribute = function() {
                var t3, e2, n2, i2, o2;
                if (e2 = this.getSelectedDocument()) {
                  for (o2 = e2.getAttachments(), n2 = 0, i2 = o2.length; i2 > n2; n2++)
                    if (t3 = o2[n2], !t3.hasContent())
                      return false;
                  return true;
                }
              }, d.prototype.canSetCurrentBlockAttribute = function() {
                var t3;
                if (t3 = this.getBlock())
                  return !t3.isTerminalBlock();
              }, d.prototype.setCurrentAttribute = function(t3, e2) {
                return o(t3) ? this.setBlockAttribute(t3, e2) : (this.setTextAttribute(t3, e2), this.currentAttributes[t3] = e2, this.notifyDelegateOfCurrentAttributesChange());
              }, d.prototype.setTextAttribute = function(t3, n2) {
                var i2, o2, r2, s2;
                if (o2 = this.getSelectedRange())
                  return r2 = o2[0], i2 = o2[1], r2 !== i2 ? this.setDocument(this.document.addAttributeAtRange(t3, n2, o2)) : t3 === "href" ? (s2 = e.Text.textForStringWithAttributes(n2, { href: n2 }), this.insertText(s2)) : void 0;
              }, d.prototype.setBlockAttribute = function(t3, e2) {
                var n2, i2;
                if (i2 = this.getSelectedRange())
                  return this.canSetCurrentAttribute(t3) ? (n2 = this.getBlock(), this.setDocument(this.document.applyBlockAttributeAtRange(t3, e2, i2)), this.setSelection(i2)) : void 0;
              }, d.prototype.removeCurrentAttribute = function(t3) {
                return o(t3) ? (this.removeBlockAttribute(t3), this.updateCurrentAttributes()) : (this.removeTextAttribute(t3), delete this.currentAttributes[t3], this.notifyDelegateOfCurrentAttributesChange());
              }, d.prototype.removeTextAttribute = function(t3) {
                var e2;
                if (e2 = this.getSelectedRange())
                  return this.setDocument(this.document.removeAttributeAtRange(t3, e2));
              }, d.prototype.removeBlockAttribute = function(t3) {
                var e2;
                if (e2 = this.getSelectedRange())
                  return this.setDocument(this.document.removeAttributeAtRange(t3, e2));
              }, d.prototype.canDecreaseNestingLevel = function() {
                var t3;
                return ((t3 = this.getBlock()) != null ? t3.getNestingLevel() : void 0) > 0;
              }, d.prototype.canIncreaseNestingLevel = function() {
                var e2, n2, i2;
                if (e2 = this.getBlock())
                  return ((i2 = o(e2.getLastNestableAttribute())) != null ? i2.listAttribute : 0) ? (n2 = this.getPreviousBlock()) ? t2(n2.getListItemAttributes(), e2.getListItemAttributes()) : void 0 : e2.getNestingLevel() > 0;
              }, d.prototype.decreaseNestingLevel = function() {
                var t3;
                if (t3 = this.getBlock())
                  return this.setDocument(this.document.replaceBlock(t3, t3.decreaseNestingLevel()));
              }, d.prototype.increaseNestingLevel = function() {
                var t3;
                if (t3 = this.getBlock())
                  return this.setDocument(this.document.replaceBlock(t3, t3.increaseNestingLevel()));
              }, d.prototype.canDecreaseBlockAttributeLevel = function() {
                var t3;
                return ((t3 = this.getBlock()) != null ? t3.getAttributeLevel() : void 0) > 0;
              }, d.prototype.decreaseBlockAttributeLevel = function() {
                var t3, e2;
                return (t3 = (e2 = this.getBlock()) != null ? e2.getLastAttribute() : void 0) ? this.removeCurrentAttribute(t3) : void 0;
              }, d.prototype.decreaseListLevel = function() {
                var t3, e2, n2, i2, o2, r2;
                for (r2 = this.getSelectedRange()[0], o2 = this.document.locationFromPosition(r2).index, n2 = o2, t3 = this.getBlock().getAttributeLevel(); (e2 = this.document.getBlockAtIndex(n2 + 1)) && e2.isListItem() && e2.getAttributeLevel() > t3; )
                  n2++;
                return r2 = this.document.positionFromLocation({ index: o2, offset: 0 }), i2 = this.document.positionFromLocation({ index: n2, offset: 0 }), this.setDocument(this.document.removeLastListAttributeAtRange([r2, i2]));
              }, d.prototype.updateCurrentAttributes = function() {
                var t3, e2, n2, o2, r2, s2;
                if (s2 = this.getSelectedRange({ ignoreLock: true })) {
                  for (e2 = this.document.getCommonAttributesAtRange(s2), r2 = i(), n2 = 0, o2 = r2.length; o2 > n2; n2++)
                    t3 = r2[n2], e2[t3] || this.canSetCurrentAttribute(t3) || (e2[t3] = false);
                  if (!a(e2, this.currentAttributes))
                    return this.currentAttributes = e2, this.notifyDelegateOfCurrentAttributesChange();
                }
              }, d.prototype.getCurrentAttributes = function() {
                return n.call({}, this.currentAttributes);
              }, d.prototype.getCurrentTextAttributes = function() {
                var t3, e2, n2, i2;
                t3 = {}, n2 = this.currentAttributes;
                for (e2 in n2)
                  i2 = n2[e2], i2 !== false && r(e2) && (t3[e2] = i2);
                return t3;
              }, d.prototype.freezeSelection = function() {
                return this.setCurrentAttribute("frozen", true);
              }, d.prototype.thawSelection = function() {
                return this.removeCurrentAttribute("frozen");
              }, d.prototype.hasFrozenSelection = function() {
                return this.hasCurrentAttribute("frozen");
              }, d.proxyMethod("getSelectionManager().getPointRange"), d.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), d.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), d.proxyMethod("getSelectionManager().locationIsCursorTarget"), d.proxyMethod("getSelectionManager().selectionIsExpanded"), d.proxyMethod("delegate?.getSelectionManager"), d.prototype.setSelection = function(t3) {
                var e2, n2;
                return e2 = this.document.locationRangeFromRange(t3), (n2 = this.delegate) != null ? n2.compositionDidRequestChangingSelectionToLocationRange(e2) : void 0;
              }, d.prototype.getSelectedRange = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.rangeFromLocationRange(t3) : void 0;
              }, d.prototype.setSelectedRange = function(t3) {
                var e2;
                return e2 = this.document.locationRangeFromRange(t3), this.getSelectionManager().setLocationRange(e2);
              }, d.prototype.getPosition = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.positionFromLocation(t3[0]) : void 0;
              }, d.prototype.getLocationRange = function(t3) {
                var e2, n2;
                return (e2 = (n2 = this.targetLocationRange) != null ? n2 : this.getSelectionManager().getLocationRange(t3)) != null ? e2 : s({ index: 0, offset: 0 });
              }, d.prototype.withTargetLocationRange = function(t3, e2) {
                var n2;
                this.targetLocationRange = t3;
                try {
                  n2 = e2();
                } finally {
                  this.targetLocationRange = null;
                }
                return n2;
              }, d.prototype.withTargetRange = function(t3, e2) {
                var n2;
                return n2 = this.document.locationRangeFromRange(t3), this.withTargetLocationRange(n2, e2);
              }, d.prototype.withTargetDOMRange = function(t3, e2) {
                var n2;
                return n2 = this.createLocationRangeFromDOMRange(t3, { strict: false }), this.withTargetLocationRange(n2, e2);
              }, d.prototype.getExpandedRangeInDirection = function(t3, e2) {
                var n2, i2, o2, r2;
                return i2 = (e2 != null ? e2 : {}).length, o2 = this.getSelectedRange(), r2 = o2[0], n2 = o2[1], t3 === "backward" ? i2 ? r2 -= i2 : r2 = this.translateUTF16PositionFromOffset(r2, -1) : i2 ? n2 += i2 : n2 = this.translateUTF16PositionFromOffset(n2, 1), s([r2, n2]);
              }, d.prototype.shouldManageMovingCursorInDirection = function(t3) {
                var e2;
                return this.editingAttachment ? true : (e2 = this.getExpandedRangeInDirection(t3), this.getAttachmentAtRange(e2) != null);
              }, d.prototype.moveCursorInDirection = function(t3) {
                var e2, n2, i2, o2;
                return this.editingAttachment ? i2 = this.document.getRangeOfAttachment(this.editingAttachment) : (o2 = this.getSelectedRange(), i2 = this.getExpandedRangeInDirection(t3), n2 = !c(o2, i2)), this.setSelectedRange(t3 === "backward" ? i2[0] : i2[1]), n2 && (e2 = this.getAttachmentAtRange(i2)) ? this.editAttachment(e2) : void 0;
              }, d.prototype.expandSelectionInDirection = function(t3, e2) {
                var n2, i2;
                return n2 = (e2 != null ? e2 : {}).length, i2 = this.getExpandedRangeInDirection(t3, { length: n2 }), this.setSelectedRange(i2);
              }, d.prototype.expandSelectionForEditing = function() {
                return this.hasCurrentAttribute("href") ? this.expandSelectionAroundCommonAttribute("href") : void 0;
              }, d.prototype.expandSelectionAroundCommonAttribute = function(t3) {
                var e2, n2;
                return e2 = this.getPosition(), n2 = this.document.getRangeOfCommonAttributeAtPosition(t3, e2), this.setSelectedRange(n2);
              }, d.prototype.selectionContainsAttachments = function() {
                var t3;
                return ((t3 = this.getSelectedAttachments()) != null ? t3.length : void 0) > 0;
              }, d.prototype.selectionIsInCursorTarget = function() {
                return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
              }, d.prototype.positionIsCursorTarget = function(t3) {
                var e2;
                return (e2 = this.document.locationFromPosition(t3)) ? this.locationIsCursorTarget(e2) : void 0;
              }, d.prototype.positionIsBlockBreak = function(t3) {
                var e2;
                return (e2 = this.document.getPieceAtPosition(t3)) != null ? e2.isBlockBreak() : void 0;
              }, d.prototype.getSelectedDocument = function() {
                var t3;
                return (t3 = this.getSelectedRange()) ? this.document.getDocumentAtRange(t3) : void 0;
              }, d.prototype.getSelectedAttachments = function() {
                var t3;
                return (t3 = this.getSelectedDocument()) != null ? t3.getAttachments() : void 0;
              }, d.prototype.getAttachments = function() {
                return this.attachments.slice(0);
              }, d.prototype.refreshAttachments = function() {
                var t3, e2, n2, i2, o2, r2, s2, a2, u2, c2, h2, p3;
                for (n2 = this.document.getAttachments(), a2 = l(this.attachments, n2), t3 = a2.added, h2 = a2.removed, this.attachments = n2, i2 = 0, r2 = h2.length; r2 > i2; i2++)
                  e2 = h2[i2], e2.delegate = null, (u2 = this.delegate) != null && typeof u2.compositionDidRemoveAttachment == "function" && u2.compositionDidRemoveAttachment(e2);
                for (p3 = [], o2 = 0, s2 = t3.length; s2 > o2; o2++)
                  e2 = t3[o2], e2.delegate = this, p3.push((c2 = this.delegate) != null && typeof c2.compositionDidAddAttachment == "function" ? c2.compositionDidAddAttachment(e2) : void 0);
                return p3;
              }, d.prototype.attachmentDidChangeAttributes = function(t3) {
                var e2;
                return this.revision++, (e2 = this.delegate) != null && typeof e2.compositionDidEditAttachment == "function" ? e2.compositionDidEditAttachment(t3) : void 0;
              }, d.prototype.attachmentDidChangePreviewURL = function(t3) {
                var e2;
                return this.revision++, (e2 = this.delegate) != null && typeof e2.compositionDidChangeAttachmentPreviewURL == "function" ? e2.compositionDidChangeAttachmentPreviewURL(t3) : void 0;
              }, d.prototype.editAttachment = function(t3, e2) {
                var n2;
                if (t3 !== this.editingAttachment)
                  return this.stopEditingAttachment(), this.editingAttachment = t3, (n2 = this.delegate) != null && typeof n2.compositionDidStartEditingAttachment == "function" ? n2.compositionDidStartEditingAttachment(this.editingAttachment, e2) : void 0;
              }, d.prototype.stopEditingAttachment = function() {
                var t3;
                if (this.editingAttachment)
                  return (t3 = this.delegate) != null && typeof t3.compositionDidStopEditingAttachment == "function" && t3.compositionDidStopEditingAttachment(this.editingAttachment), this.editingAttachment = null;
              }, d.prototype.updateAttributesForAttachment = function(t3, e2) {
                return this.setDocument(this.document.updateAttributesForAttachment(t3, e2));
              }, d.prototype.removeAttributeForAttachment = function(t3, e2) {
                return this.setDocument(this.document.removeAttributeForAttachment(t3, e2));
              }, d.prototype.breakFormattedBlock = function(t3) {
                var n2, i2, o2, r2, s2;
                return i2 = t3.document, n2 = t3.block, r2 = t3.startPosition, s2 = [r2 - 1, r2], n2.getBlockBreakPosition() === t3.startLocation.offset ? (n2.breaksOnReturn() && t3.nextCharacter === "\n" ? r2 += 1 : i2 = i2.removeTextAtRange(s2), s2 = [r2, r2]) : t3.nextCharacter === "\n" ? t3.previousCharacter === "\n" ? s2 = [r2 - 1, r2 + 1] : (s2 = [r2, r2 + 1], r2 += 1) : t3.startLocation.offset - 1 !== 0 && (r2 += 1), o2 = new e.Document([n2.removeLastAttribute().copyWithoutText()]), this.setDocument(i2.insertDocumentAtRange(o2, s2)), this.setSelection(r2);
              }, d.prototype.getPreviousBlock = function() {
                var t3, e2;
                return (e2 = this.getLocationRange()) && (t3 = e2[0].index, t3 > 0) ? this.document.getBlockAtIndex(t3 - 1) : void 0;
              }, d.prototype.getBlock = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.getBlockAtIndex(t3[0].index) : void 0;
              }, d.prototype.getAttachmentAtRange = function(t3) {
                var n2;
                return n2 = this.document.getDocumentAtRange(t3), n2.toString() === e.OBJECT_REPLACEMENT_CHARACTER + "\n" ? n2.getAttachments()[0] : void 0;
              }, d.prototype.notifyDelegateOfCurrentAttributesChange = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.compositionDidChangeCurrentAttributes == "function" ? t3.compositionDidChangeCurrentAttributes(this.currentAttributes) : void 0;
              }, d.prototype.notifyDelegateOfInsertionAtRange = function(t3) {
                var e2;
                return (e2 = this.delegate) != null && typeof e2.compositionDidPerformInsertionAtRange == "function" ? e2.compositionDidPerformInsertionAtRange(t3) : void 0;
              }, d.prototype.translateUTF16PositionFromOffset = function(t3, e2) {
                var n2, i2;
                return i2 = this.document.toUTF16String(), n2 = i2.offsetFromUCS2Offset(t3), i2.offsetToUCS2Offset(n2 + e2);
              }, d;
            }(e.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.UndoManager = function(e2) {
              function n2(t3) {
                this.composition = t3, this.undoEntries = [], this.redoEntries = [];
              }
              var i;
              return t2(n2, e2), n2.prototype.recordUndoEntry = function(t3, e3) {
                var n3, o, r, s, a;
                return s = e3 != null ? e3 : {}, o = s.context, n3 = s.consolidatable, r = this.undoEntries.slice(-1)[0], n3 && i(r, t3, o) ? void 0 : (a = this.createEntry({ description: t3, context: o }), this.undoEntries.push(a), this.redoEntries = []);
              }, n2.prototype.undo = function() {
                var t3, e3;
                return (e3 = this.undoEntries.pop()) ? (t3 = this.createEntry(e3), this.redoEntries.push(t3), this.composition.loadSnapshot(e3.snapshot)) : void 0;
              }, n2.prototype.redo = function() {
                var t3, e3;
                return (t3 = this.redoEntries.pop()) ? (e3 = this.createEntry(t3), this.undoEntries.push(e3), this.composition.loadSnapshot(t3.snapshot)) : void 0;
              }, n2.prototype.canUndo = function() {
                return this.undoEntries.length > 0;
              }, n2.prototype.canRedo = function() {
                return this.redoEntries.length > 0;
              }, n2.prototype.createEntry = function(t3) {
                var e3, n3, i2;
                return i2 = t3 != null ? t3 : {}, n3 = i2.description, e3 = i2.context, { description: n3 != null ? n3.toString() : void 0, context: JSON.stringify(e3), snapshot: this.composition.getSnapshot() };
              }, i = function(t3, e3, n3) {
                return (t3 != null ? t3.description : void 0) === (e3 != null ? e3.toString() : void 0) && (t3 != null ? t3.context : void 0) === JSON.stringify(n3);
              }, n2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2;
            e.attachmentGalleryFilter = function(e2) {
              var n;
              return n = new t2(e2), n.perform(), n.getSnapshot();
            }, t2 = function() {
              function t3(t4) {
                this.document = t4.document, this.selectedRange = t4.selectedRange;
              }
              var e2, n, i;
              return e2 = "attachmentGallery", n = "presentation", i = "gallery", t3.prototype.perform = function() {
                return this.removeBlockAttribute(), this.applyBlockAttribute();
              }, t3.prototype.getSnapshot = function() {
                return { document: this.document, selectedRange: this.selectedRange };
              }, t3.prototype.removeBlockAttribute = function() {
                var t4, n2, i2, o, r;
                for (o = this.findRangesOfBlocks(), r = [], t4 = 0, n2 = o.length; n2 > t4; t4++)
                  i2 = o[t4], r.push(this.document = this.document.removeAttributeAtRange(e2, i2));
                return r;
              }, t3.prototype.applyBlockAttribute = function() {
                var t4, n2, i2, o, r, s;
                for (i2 = 0, r = this.findRangesOfPieces(), s = [], t4 = 0, n2 = r.length; n2 > t4; t4++)
                  o = r[t4], o[1] - o[0] > 1 && (o[0] += i2, o[1] += i2, this.document.getCharacterAtPosition(o[1]) !== "\n" && (this.document = this.document.insertBlockBreakAtRange(o[1]), o[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), o[1]++, i2++), o[0] !== 0 && this.document.getCharacterAtPosition(o[0] - 1) !== "\n" && (this.document = this.document.insertBlockBreakAtRange(o[0]), o[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), o[0]++, i2++), s.push(this.document = this.document.applyBlockAttributeAtRange(e2, true, o)));
                return s;
              }, t3.prototype.findRangesOfBlocks = function() {
                return this.document.findRangesForBlockAttribute(e2);
              }, t3.prototype.findRangesOfPieces = function() {
                return this.document.findRangesForTextAttribute(n, { withValue: i });
              }, t3.prototype.moveSelectedRangeForward = function() {
                return this.selectedRange[0] += 1, this.selectedRange[1] += 1;
              }, t3;
            }();
          }.call(this), function() {
            var t2 = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            };
            e.Editor = function() {
              function n(n2, o, r) {
                this.composition = n2, this.selectionManager = o, this.element = r, this.insertFiles = t2(this.insertFiles, this), this.undoManager = new e.UndoManager(this.composition), this.filters = i.slice(0);
              }
              var i;
              return i = [e.attachmentGalleryFilter], n.prototype.loadDocument = function(t3) {
                return this.loadSnapshot({ document: t3, selectedRange: [0, 0] });
              }, n.prototype.loadHTML = function(t3) {
                return t3 == null && (t3 = ""), this.loadDocument(e.Document.fromHTML(t3, { referenceElement: this.element }));
              }, n.prototype.loadJSON = function(t3) {
                var n2, i2;
                return n2 = t3.document, i2 = t3.selectedRange, n2 = e.Document.fromJSON(n2), this.loadSnapshot({ document: n2, selectedRange: i2 });
              }, n.prototype.loadSnapshot = function(t3) {
                return this.undoManager = new e.UndoManager(this.composition), this.composition.loadSnapshot(t3);
              }, n.prototype.getDocument = function() {
                return this.composition.document;
              }, n.prototype.getSelectedDocument = function() {
                return this.composition.getSelectedDocument();
              }, n.prototype.getSnapshot = function() {
                return this.composition.getSnapshot();
              }, n.prototype.toJSON = function() {
                return this.getSnapshot();
              }, n.prototype.deleteInDirection = function(t3) {
                return this.composition.deleteInDirection(t3);
              }, n.prototype.insertAttachment = function(t3) {
                return this.composition.insertAttachment(t3);
              }, n.prototype.insertAttachments = function(t3) {
                return this.composition.insertAttachments(t3);
              }, n.prototype.insertDocument = function(t3) {
                return this.composition.insertDocument(t3);
              }, n.prototype.insertFile = function(t3) {
                return this.composition.insertFile(t3);
              }, n.prototype.insertFiles = function(t3) {
                return this.composition.insertFiles(t3);
              }, n.prototype.insertHTML = function(t3) {
                return this.composition.insertHTML(t3);
              }, n.prototype.insertString = function(t3) {
                return this.composition.insertString(t3);
              }, n.prototype.insertText = function(t3) {
                return this.composition.insertText(t3);
              }, n.prototype.insertLineBreak = function() {
                return this.composition.insertLineBreak();
              }, n.prototype.getSelectedRange = function() {
                return this.composition.getSelectedRange();
              }, n.prototype.getPosition = function() {
                return this.composition.getPosition();
              }, n.prototype.getClientRectAtPosition = function(t3) {
                var e2;
                return e2 = this.getDocument().locationRangeFromRange([t3, t3 + 1]), this.selectionManager.getClientRectAtLocationRange(e2);
              }, n.prototype.expandSelectionInDirection = function(t3) {
                return this.composition.expandSelectionInDirection(t3);
              }, n.prototype.moveCursorInDirection = function(t3) {
                return this.composition.moveCursorInDirection(t3);
              }, n.prototype.setSelectedRange = function(t3) {
                return this.composition.setSelectedRange(t3);
              }, n.prototype.activateAttribute = function(t3, e2) {
                return e2 == null && (e2 = true), this.composition.setCurrentAttribute(t3, e2);
              }, n.prototype.attributeIsActive = function(t3) {
                return this.composition.hasCurrentAttribute(t3);
              }, n.prototype.canActivateAttribute = function(t3) {
                return this.composition.canSetCurrentAttribute(t3);
              }, n.prototype.deactivateAttribute = function(t3) {
                return this.composition.removeCurrentAttribute(t3);
              }, n.prototype.canDecreaseNestingLevel = function() {
                return this.composition.canDecreaseNestingLevel();
              }, n.prototype.canIncreaseNestingLevel = function() {
                return this.composition.canIncreaseNestingLevel();
              }, n.prototype.decreaseNestingLevel = function() {
                return this.canDecreaseNestingLevel() ? this.composition.decreaseNestingLevel() : void 0;
              }, n.prototype.increaseNestingLevel = function() {
                return this.canIncreaseNestingLevel() ? this.composition.increaseNestingLevel() : void 0;
              }, n.prototype.canRedo = function() {
                return this.undoManager.canRedo();
              }, n.prototype.canUndo = function() {
                return this.undoManager.canUndo();
              }, n.prototype.recordUndoEntry = function(t3, e2) {
                var n2, i2, o;
                return o = e2 != null ? e2 : {}, i2 = o.context, n2 = o.consolidatable, this.undoManager.recordUndoEntry(t3, { context: i2, consolidatable: n2 });
              }, n.prototype.redo = function() {
                return this.canRedo() ? this.undoManager.redo() : void 0;
              }, n.prototype.undo = function() {
                return this.canUndo() ? this.undoManager.undo() : void 0;
              }, n;
            }();
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.ManagedAttachment = function(e2) {
              function n2(t3, e3) {
                var n3;
                this.attachmentManager = t3, this.attachment = e3, n3 = this.attachment, this.id = n3.id, this.file = n3.file;
              }
              return t2(n2, e2), n2.prototype.remove = function() {
                return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
              }, n2.proxyMethod("attachment.getAttribute"), n2.proxyMethod("attachment.hasAttribute"), n2.proxyMethod("attachment.setAttribute"), n2.proxyMethod("attachment.getAttributes"), n2.proxyMethod("attachment.setAttributes"), n2.proxyMethod("attachment.isPending"), n2.proxyMethod("attachment.isPreviewable"), n2.proxyMethod("attachment.getURL"), n2.proxyMethod("attachment.getHref"), n2.proxyMethod("attachment.getFilename"), n2.proxyMethod("attachment.getFilesize"), n2.proxyMethod("attachment.getFormattedFilesize"), n2.proxyMethod("attachment.getExtension"), n2.proxyMethod("attachment.getContentType"), n2.proxyMethod("attachment.getFile"), n2.proxyMethod("attachment.setFile"), n2.proxyMethod("attachment.releaseFile"), n2.proxyMethod("attachment.getUploadProgress"), n2.proxyMethod("attachment.setUploadProgress"), n2;
            }(e.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e2) {
              function i() {
                this.constructor = t3;
              }
              for (var o in e2)
                n.call(e2, o) && (t3[o] = e2[o]);
              return i.prototype = e2.prototype, t3.prototype = new i(), t3.__super__ = e2.prototype, t3;
            }, n = {}.hasOwnProperty;
            e.AttachmentManager = function(n2) {
              function i(t3) {
                var e2, n3, i2;
                for (t3 == null && (t3 = []), this.managedAttachments = {}, n3 = 0, i2 = t3.length; i2 > n3; n3++)
                  e2 = t3[n3], this.manageAttachment(e2);
              }
              return t2(i, n2), i.prototype.getAttachments = function() {
                var t3, e2, n3, i2;
                n3 = this.managedAttachments, i2 = [];
                for (e2 in n3)
                  t3 = n3[e2], i2.push(t3);
                return i2;
              }, i.prototype.manageAttachment = function(t3) {
                var n3, i2;
                return (n3 = this.managedAttachments)[i2 = t3.id] != null ? n3[i2] : n3[i2] = new e.ManagedAttachment(this, t3);
              }, i.prototype.attachmentIsManaged = function(t3) {
                return t3.id in this.managedAttachments;
              }, i.prototype.requestRemovalOfAttachment = function(t3) {
                var e2;
                return this.attachmentIsManaged(t3) && (e2 = this.delegate) != null && typeof e2.attachmentManagerDidRequestRemovalOfAttachment == "function" ? e2.attachmentManagerDidRequestRemovalOfAttachment(t3) : void 0;
              }, i.prototype.unmanageAttachment = function(t3) {
                var e2;
                return e2 = this.managedAttachments[t3.id], delete this.managedAttachments[t3.id], e2;
              }, i;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c, l, h;
            t2 = e.elementContainsNode, n = e.findChildIndexOfNode, r = e.nodeIsBlockStart, s = e.nodeIsBlockStartComment, o = e.nodeIsBlockContainer, a = e.nodeIsCursorTarget, u = e.nodeIsEmptyTextNode, c = e.nodeIsTextNode, i = e.nodeIsAttachmentElement, l = e.tagName, h = e.walkTree, e.LocationMapper = function() {
              function e2(t3) {
                this.element = t3;
              }
              var p, d, f, g;
              return e2.prototype.findLocationFromContainerAndOffset = function(e3, i2, o2) {
                var s2, u2, l2, p2, g2, m, v;
                for (m = (o2 != null ? o2 : { strict: true }).strict, u2 = 0, l2 = false, p2 = { index: 0, offset: 0 }, (s2 = this.findAttachmentElementParentForNode(e3)) && (e3 = s2.parentNode, i2 = n(s2)), v = h(this.element, { usingFilter: f }); v.nextNode(); ) {
                  if (g2 = v.currentNode, g2 === e3 && c(e3)) {
                    a(g2) || (p2.offset += i2);
                    break;
                  }
                  if (g2.parentNode === e3) {
                    if (u2++ === i2)
                      break;
                  } else if (!t2(e3, g2) && u2 > 0)
                    break;
                  r(g2, { strict: m }) ? (l2 && p2.index++, p2.offset = 0, l2 = true) : p2.offset += d(g2);
                }
                return p2;
              }, e2.prototype.findContainerAndOffsetFromLocation = function(t3) {
                var e3, i2, s2, u2, l2;
                if (t3.index === 0 && t3.offset === 0) {
                  for (e3 = this.element, u2 = 0; e3.firstChild; )
                    if (e3 = e3.firstChild, o(e3)) {
                      u2 = 1;
                      break;
                    }
                  return [e3, u2];
                }
                if (l2 = this.findNodeAndOffsetFromLocation(t3), i2 = l2[0], s2 = l2[1], i2) {
                  if (c(i2))
                    d(i2) === 0 ? (e3 = i2.parentNode.parentNode, u2 = n(i2.parentNode), a(i2, { name: "right" }) && u2++) : (e3 = i2, u2 = t3.offset - s2);
                  else {
                    if (e3 = i2.parentNode, !r(i2.previousSibling) && !o(e3))
                      for (; i2 === e3.lastChild && (i2 = e3, e3 = e3.parentNode, !o(e3)); )
                        ;
                    u2 = n(i2), t3.offset !== 0 && u2++;
                  }
                  return [e3, u2];
                }
              }, e2.prototype.findNodeAndOffsetFromLocation = function(t3) {
                var e3, n2, i2, o2, r2, s2, u2, l2;
                for (u2 = 0, l2 = this.getSignificantNodesForIndex(t3.index), n2 = 0, i2 = l2.length; i2 > n2; n2++) {
                  if (e3 = l2[n2], o2 = d(e3), t3.offset <= u2 + o2)
                    if (c(e3)) {
                      if (r2 = e3, s2 = u2, t3.offset === s2 && a(r2))
                        break;
                    } else
                      r2 || (r2 = e3, s2 = u2);
                  if (u2 += o2, u2 > t3.offset)
                    break;
                }
                return [r2, s2];
              }, e2.prototype.findAttachmentElementParentForNode = function(t3) {
                for (; t3 && t3 !== this.element; ) {
                  if (i(t3))
                    return t3;
                  t3 = t3.parentNode;
                }
              }, e2.prototype.getSignificantNodesForIndex = function(t3) {
                var e3, n2, i2, o2, r2;
                for (i2 = [], r2 = h(this.element, { usingFilter: p }), o2 = false; r2.nextNode(); )
                  if (n2 = r2.currentNode, s(n2)) {
                    if (typeof e3 != "undefined" && e3 !== null ? e3++ : e3 = 0, e3 === t3)
                      o2 = true;
                    else if (o2)
                      break;
                  } else
                    o2 && i2.push(n2);
                return i2;
              }, d = function(t3) {
                var e3;
                return t3.nodeType === Node.TEXT_NODE ? a(t3) ? 0 : (e3 = t3.textContent, e3.length) : l(t3) === "br" || i(t3) ? 1 : 0;
              }, p = function(t3) {
                return g(t3) === NodeFilter.FILTER_ACCEPT ? f(t3) : NodeFilter.FILTER_REJECT;
              }, g = function(t3) {
                return u(t3) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, f = function(t3) {
                return i(t3.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, e2;
            }();
          }.call(this), function() {
            var t2, n, i = [].slice;
            t2 = e.getDOMRange, n = e.setDOMRange, e.PointMapper = function() {
              function e2() {
              }
              return e2.prototype.createDOMRangeFromPoint = function(e3) {
                var i2, o, r, s, a, u, c, l;
                if (c = e3.x, l = e3.y, document.caretPositionFromPoint)
                  return a = document.caretPositionFromPoint(c, l), r = a.offsetNode, o = a.offset, i2 = document.createRange(), i2.setStart(r, o), i2;
                if (document.caretRangeFromPoint)
                  return document.caretRangeFromPoint(c, l);
                if (document.body.createTextRange) {
                  s = t2();
                  try {
                    u = document.body.createTextRange(), u.moveToPoint(c, l), u.select();
                  } catch (h) {
                  }
                  return i2 = t2(), n(s), i2;
                }
              }, e2.prototype.getClientRectsForDOMRange = function(t3) {
                var e3, n2, o;
                return n2 = i.call(t3.getClientRects()), o = n2[0], e3 = n2[n2.length - 1], [o, e3];
              }, e2;
            }();
          }.call(this), function() {
            var t2, n = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, i = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                o.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, o = {}.hasOwnProperty, r = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            t2 = e.getDOMRange, e.SelectionChangeObserver = function(e2) {
              function o2() {
                this.run = n(this.run, this), this.update = n(this.update, this), this.selectionManagers = [];
              }
              var s;
              return i(o2, e2), o2.prototype.start = function() {
                return this.started ? void 0 : (this.started = true, "onselectionchange" in document ? document.addEventListener("selectionchange", this.update, true) : this.run());
              }, o2.prototype.stop = function() {
                return this.started ? (this.started = false, document.removeEventListener("selectionchange", this.update, true)) : void 0;
              }, o2.prototype.registerSelectionManager = function(t3) {
                return r.call(this.selectionManagers, t3) < 0 ? (this.selectionManagers.push(t3), this.start()) : void 0;
              }, o2.prototype.unregisterSelectionManager = function(t3) {
                var e3;
                return this.selectionManagers = function() {
                  var n2, i2, o3, r2;
                  for (o3 = this.selectionManagers, r2 = [], n2 = 0, i2 = o3.length; i2 > n2; n2++)
                    e3 = o3[n2], e3 !== t3 && r2.push(e3);
                  return r2;
                }.call(this), this.selectionManagers.length === 0 ? this.stop() : void 0;
              }, o2.prototype.notifySelectionManagersOfSelectionChange = function() {
                var t3, e3, n2, i2, o3;
                for (n2 = this.selectionManagers, i2 = [], t3 = 0, e3 = n2.length; e3 > t3; t3++)
                  o3 = n2[t3], i2.push(o3.selectionDidChange());
                return i2;
              }, o2.prototype.update = function() {
                var e3;
                return e3 = t2(), s(e3, this.domRange) ? void 0 : (this.domRange = e3, this.notifySelectionManagersOfSelectionChange());
              }, o2.prototype.reset = function() {
                return this.domRange = null, this.update();
              }, o2.prototype.run = function() {
                return this.started ? (this.update(), requestAnimationFrame(this.run)) : void 0;
              }, s = function(t3, e3) {
                return (t3 != null ? t3.startContainer : void 0) === (e3 != null ? e3.startContainer : void 0) && (t3 != null ? t3.startOffset : void 0) === (e3 != null ? e3.startOffset : void 0) && (t3 != null ? t3.endContainer : void 0) === (e3 != null ? e3.endContainer : void 0) && (t3 != null ? t3.endOffset : void 0) === (e3 != null ? e3.endOffset : void 0);
              }, o2;
            }(e.BasicObject), e.selectionChangeObserver == null && (e.selectionChangeObserver = new e.SelectionChangeObserver());
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u, c, l, h = function(t3, e2) {
              return function() {
                return t3.apply(e2, arguments);
              };
            }, p = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                d.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, d = {}.hasOwnProperty;
            i = e.getDOMSelection, n = e.getDOMRange, l = e.setDOMRange, t2 = e.elementContainsNode, s = e.nodeIsCursorTarget, r = e.innerElementIsActive, o = e.handleEvent, a = e.normalizeRange, u = e.rangeIsCollapsed, c = e.rangesAreEqual, e.SelectionManager = function(d2) {
              function f(t3) {
                this.element = t3, this.selectionDidChange = h(this.selectionDidChange, this), this.didMouseDown = h(this.didMouseDown, this), this.locationMapper = new e.LocationMapper(this.element), this.pointMapper = new e.PointMapper(), this.lockCount = 0, o("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
              }
              return p(f, d2), f.prototype.getLocationRange = function(t3) {
                var e2, i2;
                return t3 == null && (t3 = {}), e2 = t3.strict === false ? this.createLocationRangeFromDOMRange(n(), { strict: false }) : t3.ignoreLock ? this.currentLocationRange : (i2 = this.lockedLocationRange) != null ? i2 : this.currentLocationRange;
              }, f.prototype.setLocationRange = function(t3) {
                var e2;
                if (!this.lockedLocationRange)
                  return t3 = a(t3), (e2 = this.createDOMRangeFromLocationRange(t3)) ? (l(e2), this.updateCurrentLocationRange(t3)) : void 0;
              }, f.prototype.setLocationRangeFromPointRange = function(t3) {
                var e2, n2;
                return t3 = a(t3), n2 = this.getLocationAtPoint(t3[0]), e2 = this.getLocationAtPoint(t3[1]), this.setLocationRange([n2, e2]);
              }, f.prototype.getClientRectAtLocationRange = function(t3) {
                var e2;
                return (e2 = this.createDOMRangeFromLocationRange(t3)) ? this.getClientRectsForDOMRange(e2)[1] : void 0;
              }, f.prototype.locationIsCursorTarget = function(t3) {
                var e2, n2, i2;
                return i2 = this.findNodeAndOffsetFromLocation(t3), e2 = i2[0], n2 = i2[1], s(e2);
              }, f.prototype.lock = function() {
                return this.lockCount++ === 0 ? (this.updateCurrentLocationRange(), this.lockedLocationRange = this.getLocationRange()) : void 0;
              }, f.prototype.unlock = function() {
                var t3;
                return --this.lockCount === 0 && (t3 = this.lockedLocationRange, this.lockedLocationRange = null, t3 != null) ? this.setLocationRange(t3) : void 0;
              }, f.prototype.clearSelection = function() {
                var t3;
                return (t3 = i()) != null ? t3.removeAllRanges() : void 0;
              }, f.prototype.selectionIsCollapsed = function() {
                var t3;
                return ((t3 = n()) != null ? t3.collapsed : void 0) === true;
              }, f.prototype.selectionIsExpanded = function() {
                return !this.selectionIsCollapsed();
              }, f.prototype.createLocationRangeFromDOMRange = function(t3, e2) {
                var n2, i2;
                if (t3 != null && this.domRangeWithinElement(t3) && (i2 = this.findLocationFromContainerAndOffset(t3.startContainer, t3.startOffset, e2)))
                  return t3.collapsed || (n2 = this.findLocationFromContainerAndOffset(t3.endContainer, t3.endOffset, e2)), a([i2, n2]);
              }, f.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), f.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), f.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), f.proxyMethod("pointMapper.createDOMRangeFromPoint"), f.proxyMethod("pointMapper.getClientRectsForDOMRange"), f.prototype.didMouseDown = function() {
                return this.pauseTemporarily();
              }, f.prototype.pauseTemporarily = function() {
                var e2, n2, i2, r2;
                return this.paused = true, n2 = function(e3) {
                  return function() {
                    var n3, o2, s2;
                    for (e3.paused = false, clearTimeout(r2), o2 = 0, s2 = i2.length; s2 > o2; o2++)
                      n3 = i2[o2], n3.destroy();
                    return t2(document, e3.element) ? e3.selectionDidChange() : void 0;
                  };
                }(this), r2 = setTimeout(n2, 200), i2 = function() {
                  var t3, i3, r3, s2;
                  for (r3 = ["mousemove", "keydown"], s2 = [], t3 = 0, i3 = r3.length; i3 > t3; t3++)
                    e2 = r3[t3], s2.push(o(e2, { onElement: document, withCallback: n2 }));
                  return s2;
                }();
              }, f.prototype.selectionDidChange = function() {
                return this.paused || r(this.element) ? void 0 : this.updateCurrentLocationRange();
              }, f.prototype.updateCurrentLocationRange = function(t3) {
                var e2;
                return (t3 != null ? t3 : t3 = this.createLocationRangeFromDOMRange(n())) && !c(t3, this.currentLocationRange) ? (this.currentLocationRange = t3, (e2 = this.delegate) != null && typeof e2.locationRangeDidChange == "function" ? e2.locationRangeDidChange(this.currentLocationRange.slice(0)) : void 0) : void 0;
              }, f.prototype.createDOMRangeFromLocationRange = function(t3) {
                var e2, n2, i2, o2;
                return i2 = this.findContainerAndOffsetFromLocation(t3[0]), n2 = u(t3) ? i2 : (o2 = this.findContainerAndOffsetFromLocation(t3[1])) != null ? o2 : i2, i2 != null && n2 != null ? (e2 = document.createRange(), e2.setStart.apply(e2, i2), e2.setEnd.apply(e2, n2), e2) : void 0;
              }, f.prototype.getLocationAtPoint = function(t3) {
                var e2, n2;
                return (e2 = this.createDOMRangeFromPoint(t3)) && (n2 = this.createLocationRangeFromDOMRange(e2)) != null ? n2[0] : void 0;
              }, f.prototype.domRangeWithinElement = function(e2) {
                return e2.collapsed ? t2(this.element, e2.startContainer) : t2(this.element, e2.startContainer) && t2(this.element, e2.endContainer);
              }, f;
            }(e.BasicObject);
          }.call(this), function() {
            var t2, n, i, o, r = function(t3, e2) {
              function n2() {
                this.constructor = t3;
              }
              for (var i2 in e2)
                s.call(e2, i2) && (t3[i2] = e2[i2]);
              return n2.prototype = e2.prototype, t3.prototype = new n2(), t3.__super__ = e2.prototype, t3;
            }, s = {}.hasOwnProperty, a = [].slice;
            i = e.rangeIsCollapsed, o = e.rangesAreEqual, n = e.objectsAreEqual, t2 = e.getBlockConfig, e.EditorController = function(s2) {
              function u(t3) {
                var n2, i2;
                this.editorElement = t3.editorElement, n2 = t3.document, i2 = t3.html, this.selectionManager = new e.SelectionManager(this.editorElement), this.selectionManager.delegate = this, this.composition = new e.Composition(), this.composition.delegate = this, this.attachmentManager = new e.AttachmentManager(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = new e["Level" + e.config.input.getLevel() + "InputController"](this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new e.CompositionController(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new e.ToolbarController(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new e.Editor(this.composition, this.selectionManager, this.editorElement), n2 != null ? this.editor.loadDocument(n2) : this.editor.loadHTML(i2);
              }
              var c;
              return r(u, s2), u.prototype.registerSelectionManager = function() {
                return e.selectionChangeObserver.registerSelectionManager(this.selectionManager);
              }, u.prototype.unregisterSelectionManager = function() {
                return e.selectionChangeObserver.unregisterSelectionManager(this.selectionManager);
              }, u.prototype.render = function() {
                return this.compositionController.render();
              }, u.prototype.reparse = function() {
                return this.composition.replaceHTML(this.editorElement.innerHTML);
              }, u.prototype.compositionDidChangeDocument = function() {
                return this.notifyEditorElement("document-change"), this.handlingInput ? void 0 : this.render();
              }, u.prototype.compositionDidChangeCurrentAttributes = function(t3) {
                return this.currentAttributes = t3, this.toolbarController.updateAttributes(this.currentAttributes), this.updateCurrentActions(), this.notifyEditorElement("attributes-change", { attributes: this.currentAttributes });
              }, u.prototype.compositionDidPerformInsertionAtRange = function(t3) {
                return this.pasting ? this.pastedRange = t3 : void 0;
              }, u.prototype.compositionShouldAcceptFile = function(t3) {
                return this.notifyEditorElement("file-accept", { file: t3 });
              }, u.prototype.compositionDidAddAttachment = function(t3) {
                var e2;
                return e2 = this.attachmentManager.manageAttachment(t3), this.notifyEditorElement("attachment-add", { attachment: e2 });
              }, u.prototype.compositionDidEditAttachment = function(t3) {
                var e2;
                return this.compositionController.rerenderViewForObject(t3), e2 = this.attachmentManager.manageAttachment(t3), this.notifyEditorElement("attachment-edit", { attachment: e2 }), this.notifyEditorElement("change");
              }, u.prototype.compositionDidChangeAttachmentPreviewURL = function(t3) {
                return this.compositionController.invalidateViewForObject(t3), this.notifyEditorElement("change");
              }, u.prototype.compositionDidRemoveAttachment = function(t3) {
                var e2;
                return e2 = this.attachmentManager.unmanageAttachment(t3), this.notifyEditorElement("attachment-remove", { attachment: e2 });
              }, u.prototype.compositionDidStartEditingAttachment = function(t3, e2) {
                return this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(t3), this.compositionController.installAttachmentEditorForAttachment(t3, e2), this.selectionManager.setLocationRange(this.attachmentLocationRange);
              }, u.prototype.compositionDidStopEditingAttachment = function() {
                return this.compositionController.uninstallAttachmentEditor(), this.attachmentLocationRange = null;
              }, u.prototype.compositionDidRequestChangingSelectionToLocationRange = function(t3) {
                return !this.loadingSnapshot || this.isFocused() ? (this.requestedLocationRange = t3, this.compositionRevisionWhenLocationRangeRequested = this.composition.revision, this.handlingInput ? void 0 : this.render()) : void 0;
              }, u.prototype.compositionWillLoadSnapshot = function() {
                return this.loadingSnapshot = true;
              }, u.prototype.compositionDidLoadSnapshot = function() {
                return this.compositionController.refreshViewCache(), this.render(), this.loadingSnapshot = false;
              }, u.prototype.getSelectionManager = function() {
                return this.selectionManager;
              }, u.proxyMethod("getSelectionManager().setLocationRange"), u.proxyMethod("getSelectionManager().getLocationRange"), u.prototype.attachmentManagerDidRequestRemovalOfAttachment = function(t3) {
                return this.removeAttachment(t3);
              }, u.prototype.compositionControllerWillSyncDocumentView = function() {
                return this.inputController.editorWillSyncDocumentView(), this.selectionManager.lock(), this.selectionManager.clearSelection();
              }, u.prototype.compositionControllerDidSyncDocumentView = function() {
                return this.inputController.editorDidSyncDocumentView(), this.selectionManager.unlock(), this.updateCurrentActions(), this.notifyEditorElement("sync");
              }, u.prototype.compositionControllerDidRender = function() {
                return this.requestedLocationRange != null && (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision && this.selectionManager.setLocationRange(this.requestedLocationRange), this.requestedLocationRange = null, this.compositionRevisionWhenLocationRangeRequested = null), this.renderedCompositionRevision !== this.composition.revision && (this.runEditorFilters(), this.composition.updateCurrentAttributes(), this.notifyEditorElement("render")), this.renderedCompositionRevision = this.composition.revision;
              }, u.prototype.compositionControllerDidFocus = function() {
                return this.isFocusedInvisibly() && this.setLocationRange({ index: 0, offset: 0 }), this.toolbarController.hideDialog(), this.notifyEditorElement("focus");
              }, u.prototype.compositionControllerDidBlur = function() {
                return this.notifyEditorElement("blur");
              }, u.prototype.compositionControllerDidSelectAttachment = function(t3, e2) {
                return this.toolbarController.hideDialog(), this.composition.editAttachment(t3, e2);
              }, u.prototype.compositionControllerDidRequestDeselectingAttachment = function(t3) {
                var e2, n2;
                return e2 = (n2 = this.attachmentLocationRange) != null ? n2 : this.composition.document.getLocationRangeOfAttachment(t3), this.selectionManager.setLocationRange(e2[1]);
              }, u.prototype.compositionControllerWillUpdateAttachment = function(t3) {
                return this.editor.recordUndoEntry("Edit Attachment", { context: t3.id, consolidatable: true });
              }, u.prototype.compositionControllerDidRequestRemovalOfAttachment = function(t3) {
                return this.removeAttachment(t3);
              }, u.prototype.inputControllerWillHandleInput = function() {
                return this.handlingInput = true, this.requestedRender = false;
              }, u.prototype.inputControllerDidRequestRender = function() {
                return this.requestedRender = true;
              }, u.prototype.inputControllerDidHandleInput = function() {
                return this.handlingInput = false, this.requestedRender ? (this.requestedRender = false, this.render()) : void 0;
              }, u.prototype.inputControllerDidAllowUnhandledInput = function() {
                return this.notifyEditorElement("change");
              }, u.prototype.inputControllerDidRequestReparse = function() {
                return this.reparse();
              }, u.prototype.inputControllerWillPerformTyping = function() {
                return this.recordTypingUndoEntry();
              }, u.prototype.inputControllerWillPerformFormatting = function(t3) {
                return this.recordFormattingUndoEntry(t3);
              }, u.prototype.inputControllerWillCutText = function() {
                return this.editor.recordUndoEntry("Cut");
              }, u.prototype.inputControllerWillPaste = function(t3) {
                return this.editor.recordUndoEntry("Paste"), this.pasting = true, this.notifyEditorElement("before-paste", { paste: t3 });
              }, u.prototype.inputControllerDidPaste = function(t3) {
                return t3.range = this.pastedRange, this.pastedRange = null, this.pasting = null, this.notifyEditorElement("paste", { paste: t3 });
              }, u.prototype.inputControllerWillMoveText = function() {
                return this.editor.recordUndoEntry("Move");
              }, u.prototype.inputControllerWillAttachFiles = function() {
                return this.editor.recordUndoEntry("Drop Files");
              }, u.prototype.inputControllerWillPerformUndo = function() {
                return this.editor.undo();
              }, u.prototype.inputControllerWillPerformRedo = function() {
                return this.editor.redo();
              }, u.prototype.inputControllerDidReceiveKeyboardCommand = function(t3) {
                return this.toolbarController.applyKeyboardCommand(t3);
              }, u.prototype.inputControllerDidStartDrag = function() {
                return this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
              }, u.prototype.inputControllerDidReceiveDragOverPoint = function(t3) {
                return this.selectionManager.setLocationRangeFromPointRange(t3);
              }, u.prototype.inputControllerDidCancelDrag = function() {
                return this.selectionManager.setLocationRange(this.locationRangeBeforeDrag), this.locationRangeBeforeDrag = null;
              }, u.prototype.locationRangeDidChange = function(t3) {
                return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !o(this.attachmentLocationRange, t3) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
              }, u.prototype.toolbarDidClickButton = function() {
                return this.getLocationRange() ? void 0 : this.setLocationRange({ index: 0, offset: 0 });
              }, u.prototype.toolbarDidInvokeAction = function(t3) {
                return this.invokeAction(t3);
              }, u.prototype.toolbarDidToggleAttribute = function(t3) {
                return this.recordFormattingUndoEntry(t3), this.composition.toggleCurrentAttribute(t3), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarDidUpdateAttribute = function(t3, e2) {
                return this.recordFormattingUndoEntry(t3), this.composition.setCurrentAttribute(t3, e2), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarDidRemoveAttribute = function(t3) {
                return this.recordFormattingUndoEntry(t3), this.composition.removeCurrentAttribute(t3), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarWillShowDialog = function() {
                return this.composition.expandSelectionForEditing(), this.freezeSelection();
              }, u.prototype.toolbarDidShowDialog = function(t3) {
                return this.notifyEditorElement("toolbar-dialog-show", { dialogName: t3 });
              }, u.prototype.toolbarDidHideDialog = function(t3) {
                return this.thawSelection(), this.editorElement.focus(), this.notifyEditorElement("toolbar-dialog-hide", { dialogName: t3 });
              }, u.prototype.freezeSelection = function() {
                return this.selectionFrozen ? void 0 : (this.selectionManager.lock(), this.composition.freezeSelection(), this.selectionFrozen = true, this.render());
              }, u.prototype.thawSelection = function() {
                return this.selectionFrozen ? (this.composition.thawSelection(), this.selectionManager.unlock(), this.selectionFrozen = false, this.render()) : void 0;
              }, u.prototype.actions = { undo: { test: function() {
                return this.editor.canUndo();
              }, perform: function() {
                return this.editor.undo();
              } }, redo: { test: function() {
                return this.editor.canRedo();
              }, perform: function() {
                return this.editor.redo();
              } }, link: { test: function() {
                return this.editor.canActivateAttribute("href");
              } }, increaseNestingLevel: { test: function() {
                return this.editor.canIncreaseNestingLevel();
              }, perform: function() {
                return this.editor.increaseNestingLevel() && this.render();
              } }, decreaseNestingLevel: { test: function() {
                return this.editor.canDecreaseNestingLevel();
              }, perform: function() {
                return this.editor.decreaseNestingLevel() && this.render();
              } }, attachFiles: { test: function() {
                return true;
              }, perform: function() {
                return e.config.input.pickFiles(this.editor.insertFiles);
              } } }, u.prototype.canInvokeAction = function(t3) {
                var e2, n2;
                return this.actionIsExternal(t3) ? true : !!((e2 = this.actions[t3]) != null && (n2 = e2.test) != null ? n2.call(this) : void 0);
              }, u.prototype.invokeAction = function(t3) {
                var e2, n2;
                return this.actionIsExternal(t3) ? this.notifyEditorElement("action-invoke", { actionName: t3 }) : (e2 = this.actions[t3]) != null && (n2 = e2.perform) != null ? n2.call(this) : void 0;
              }, u.prototype.actionIsExternal = function(t3) {
                return /^x-./.test(t3);
              }, u.prototype.getCurrentActions = function() {
                var t3, e2;
                e2 = {};
                for (t3 in this.actions)
                  e2[t3] = this.canInvokeAction(t3);
                return e2;
              }, u.prototype.updateCurrentActions = function() {
                var t3;
                return t3 = this.getCurrentActions(), n(t3, this.currentActions) ? void 0 : (this.currentActions = t3, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions }));
              }, u.prototype.runEditorFilters = function() {
                var t3, e2, n2, i2, o2, r2, s3, a2;
                for (a2 = this.composition.getSnapshot(), o2 = this.editor.filters, n2 = 0, i2 = o2.length; i2 > n2; n2++)
                  e2 = o2[n2], t3 = a2.document, s3 = a2.selectedRange, a2 = (r2 = e2.call(this.editor, a2)) != null ? r2 : {}, a2.document == null && (a2.document = t3), a2.selectedRange == null && (a2.selectedRange = s3);
                return c(a2, this.composition.getSnapshot()) ? void 0 : this.composition.loadSnapshot(a2);
              }, c = function(t3, e2) {
                return o(t3.selectedRange, e2.selectedRange) && t3.document.isEqualTo(e2.document);
              }, u.prototype.updateInputElement = function() {
                var t3, n2;
                return t3 = this.compositionController.getSerializableElement(), n2 = e.serializeToContentType(t3, "text/html"), this.editorElement.setInputElementValue(n2);
              }, u.prototype.notifyEditorElement = function(t3, e2) {
                switch (t3) {
                  case "document-change":
                    this.documentChangedSinceLastRender = true;
                    break;
                  case "render":
                    this.documentChangedSinceLastRender && (this.documentChangedSinceLastRender = false, this.notifyEditorElement("change"));
                    break;
                  case "change":
                  case "attachment-add":
                  case "attachment-edit":
                  case "attachment-remove":
                    this.updateInputElement();
                }
                return this.editorElement.notify(t3, e2);
              }, u.prototype.removeAttachment = function(t3) {
                return this.editor.recordUndoEntry("Delete Attachment"), this.composition.removeAttachment(t3), this.render();
              }, u.prototype.recordFormattingUndoEntry = function(e2) {
                var n2, o2;
                return n2 = t2(e2), o2 = this.selectionManager.getLocationRange(), n2 || !i(o2) ? this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: true }) : void 0;
              }, u.prototype.recordTypingUndoEntry = function() {
                return this.editor.recordUndoEntry("Typing", { context: this.getUndoContext(this.currentAttributes), consolidatable: true });
              }, u.prototype.getUndoContext = function() {
                var t3;
                return t3 = 1 <= arguments.length ? a.call(arguments, 0) : [], [this.getLocationContext(), this.getTimeContext()].concat(a.call(t3));
              }, u.prototype.getLocationContext = function() {
                var t3;
                return t3 = this.selectionManager.getLocationRange(), i(t3) ? t3[0].index : t3;
              }, u.prototype.getTimeContext = function() {
                return e.config.undoInterval > 0 ? Math.floor(new Date().getTime() / e.config.undoInterval) : 0;
              }, u.prototype.isFocused = function() {
                var t3;
                return this.editorElement === ((t3 = this.editorElement.ownerDocument) != null ? t3.activeElement : void 0);
              }, u.prototype.isFocusedInvisibly = function() {
                return this.isFocused() && !this.getLocationRange();
              }, u;
            }(e.Controller);
          }.call(this), function() {
            var t2, n, i, o, r, s, a, u = [].indexOf || function(t3) {
              for (var e2 = 0, n2 = this.length; n2 > e2; e2++)
                if (e2 in this && this[e2] === t3)
                  return e2;
              return -1;
            };
            n = e.browser, s = e.makeElement, a = e.triggerEvent, o = e.handleEvent, r = e.handleEventOnce, i = e.findClosestElementFromNode, t2 = e.AttachmentView.attachmentSelector, e.registerElement("trix-editor", function() {
              var c, l, h, p, d, f, g, m, v;
              return g = 0, l = function(t3) {
                return !document.querySelector(":focus") && t3.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t3 ? t3.focus() : void 0;
              }, m = function(t3) {
                return t3.hasAttribute("contenteditable") ? void 0 : (t3.setAttribute("contenteditable", ""), r("focus", { onElement: t3, withCallback: function() {
                  return h(t3);
                } }));
              }, h = function(t3) {
                return d(t3), v(t3);
              }, d = function(t3) {
                return (typeof document.queryCommandSupported == "function" ? document.queryCommandSupported("enableObjectResizing") : void 0) ? (document.execCommand("enableObjectResizing", false, false), o("mscontrolselect", { onElement: t3, preventDefault: true })) : void 0;
              }, v = function() {
                var t3;
                return (typeof document.queryCommandSupported == "function" ? document.queryCommandSupported("DefaultParagraphSeparator") : void 0) && (t3 = e.config.blockAttributes["default"].tagName, t3 === "div" || t3 === "p") ? document.execCommand("DefaultParagraphSeparator", false, t3) : void 0;
              }, c = function(t3) {
                return t3.hasAttribute("role") ? void 0 : t3.setAttribute("role", "textbox");
              }, f = function(t3) {
                var e2;
                if (!t3.hasAttribute("aria-label") && !t3.hasAttribute("aria-labelledby"))
                  return (e2 = function() {
                    var e3, n2, i2;
                    return i2 = function() {
                      var n3, i3, o2, r2;
                      for (o2 = t3.labels, r2 = [], n3 = 0, i3 = o2.length; i3 > n3; n3++)
                        e3 = o2[n3], e3.contains(t3) || r2.push(e3.textContent);
                      return r2;
                    }(), (n2 = i2.join(" ")) ? t3.setAttribute("aria-label", n2) : t3.removeAttribute("aria-label");
                  })(), o("focus", { onElement: t3, withCallback: e2 });
              }, p = function() {
                return n.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
              }(), { defaultCSS: "%t {\n  display: block;\n}\n\n%t:empty:not(:focus)::before {\n  content: attr(placeholder);\n  color: graytext;\n  cursor: text;\n  pointer-events: none;\n}\n\n%t a[contenteditable=false] {\n  cursor: text;\n}\n\n%t img {\n  max-width: 100%;\n  height: auto;\n}\n\n%t " + t2 + " figcaption textarea {\n  resize: none;\n}\n\n%t " + t2 + " figcaption textarea.trix-autoresize-clone {\n  position: absolute;\n  left: -9999px;\n  max-height: 0px;\n}\n\n%t " + t2 + " figcaption[data-trix-placeholder]:empty::before {\n  content: attr(data-trix-placeholder);\n  color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n  display: " + p.display + " !important;\n  width: " + p.width + " !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n  vertical-align: top !important;\n  margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n  vertical-align: bottom !important;\n  margin-right: -1px !important;\n}", trixId: { get: function() {
                return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++g), this.trixId);
              } }, labels: { get: function() {
                var t3, e2, n2;
                return e2 = [], this.id && this.ownerDocument && e2.push.apply(e2, this.ownerDocument.querySelectorAll("label[for='" + this.id + "']")), (t3 = i(this, { matchingSelector: "label" })) && ((n2 = t3.control) === this || n2 === null) && e2.push(t3), e2;
              } }, toolbarElement: { get: function() {
                var t3, e2, n2;
                return this.hasAttribute("toolbar") ? (e2 = this.ownerDocument) != null ? e2.getElementById(this.getAttribute("toolbar")) : void 0 : this.parentNode ? (n2 = "trix-toolbar-" + this.trixId, this.setAttribute("toolbar", n2), t3 = s("trix-toolbar", { id: n2 }), this.parentNode.insertBefore(t3, this), t3) : void 0;
              } }, inputElement: { get: function() {
                var t3, e2, n2;
                return this.hasAttribute("input") ? (n2 = this.ownerDocument) != null ? n2.getElementById(this.getAttribute("input")) : void 0 : this.parentNode ? (e2 = "trix-input-" + this.trixId, this.setAttribute("input", e2), t3 = s("input", { type: "hidden", id: e2 }), this.parentNode.insertBefore(t3, this.nextElementSibling), t3) : void 0;
              } }, editor: { get: function() {
                var t3;
                return (t3 = this.editorController) != null ? t3.editor : void 0;
              } }, name: { get: function() {
                var t3;
                return (t3 = this.inputElement) != null ? t3.name : void 0;
              } }, value: { get: function() {
                var t3;
                return (t3 = this.inputElement) != null ? t3.value : void 0;
              }, set: function(t3) {
                var e2;
                return this.defaultValue = t3, (e2 = this.editor) != null ? e2.loadHTML(this.defaultValue) : void 0;
              } }, notify: function(t3, e2) {
                return this.editorController ? a("trix-" + t3, { onElement: this, attributes: e2 }) : void 0;
              }, setInputElementValue: function(t3) {
                var e2;
                return (e2 = this.inputElement) != null ? e2.value = t3 : void 0;
              }, initialize: function() {
                return this.hasAttribute("data-trix-internal") ? void 0 : (m(this), c(this), f(this));
              }, connect: function() {
                return this.hasAttribute("data-trix-internal") ? void 0 : (this.editorController || (a("trix-before-initialize", { onElement: this }), this.editorController = new e.EditorController({ editorElement: this, html: this.defaultValue = this.value }), requestAnimationFrame(function(t3) {
                  return function() {
                    return a("trix-initialize", { onElement: t3 });
                  };
                }(this))), this.editorController.registerSelectionManager(), this.registerResetListener(), this.registerClickListener(), l(this));
              }, disconnect: function() {
                var t3;
                return (t3 = this.editorController) != null && t3.unregisterSelectionManager(), this.unregisterResetListener(), this.unregisterClickListener();
              }, registerResetListener: function() {
                return this.resetListener = this.resetBubbled.bind(this), window.addEventListener("reset", this.resetListener, false);
              }, unregisterResetListener: function() {
                return window.removeEventListener("reset", this.resetListener, false);
              }, registerClickListener: function() {
                return this.clickListener = this.clickBubbled.bind(this), window.addEventListener("click", this.clickListener, false);
              }, unregisterClickListener: function() {
                return window.removeEventListener("click", this.clickListener, false);
              }, resetBubbled: function(t3) {
                var e2;
                if (!t3.defaultPrevented && t3.target === ((e2 = this.inputElement) != null ? e2.form : void 0))
                  return this.reset();
              }, clickBubbled: function(t3) {
                var e2;
                if (!(t3.defaultPrevented || this.contains(t3.target) || !(e2 = i(t3.target, { matchingSelector: "label" })) || u.call(this.labels, e2) < 0))
                  return this.focus();
              }, reset: function() {
                return this.value = this.defaultValue;
              } };
            }());
          }.call(this), function() {
          }.call(this);
        }).call(this), typeof module == "object" && module.exports ? module.exports = e : typeof define == "function" && define.amd && define(e);
      }.call(exports);
    }
  });

  // node_modules/tailwindcss/lib/util/createPlugin.js
  var require_createPlugin = __commonJS({
    "node_modules/tailwindcss/lib/util/createPlugin.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      function createPlugin(plugin, config) {
        return {
          handler: plugin,
          config
        };
      }
      createPlugin.withOptions = function(pluginFunction, configFunction = () => ({})) {
        const optionsFunction = function(options) {
          return {
            __options: options,
            handler: pluginFunction(options),
            config: configFunction(options)
          };
        };
        optionsFunction.__isOptionsFunction = true;
        optionsFunction.__pluginFunction = pluginFunction;
        optionsFunction.__configFunction = configFunction;
        return optionsFunction;
      };
      var _default = createPlugin;
      exports.default = _default;
    }
  });

  // node_modules/tailwindcss/lib/public/create-plugin.js
  var require_create_plugin = __commonJS({
    "node_modules/tailwindcss/lib/public/create-plugin.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _createPlugin = _interopRequireDefault(require_createPlugin());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      var _default = _createPlugin.default;
      exports.default = _default;
    }
  });

  // node_modules/tailwindcss/plugin.js
  var require_plugin = __commonJS({
    "node_modules/tailwindcss/plugin.js"(exports, module) {
      var createPlugin = require_create_plugin();
      module.exports = (createPlugin.__esModule ? createPlugin : { default: createPlugin }).default;
    }
  });

  // node_modules/@tailwindcss/line-clamp/src/index.js
  var require_src = __commonJS({
    "node_modules/@tailwindcss/line-clamp/src/index.js"(exports, module) {
      var plugin = require_plugin();
      var lineClamp = plugin(function({ addUtilities, theme, variants, e }) {
        const values = theme("lineClamp");
        addUtilities([
          Object.entries(values).map(([key, value]) => {
            return {
              [`.${e(`line-clamp-${key}`)}`]: {
                overflow: "hidden",
                display: "-webkit-box",
                "-webkit-box-orient": "vertical",
                "-webkit-line-clamp": `${value}`
              }
            };
          }),
          {
            ".line-clamp-none": {
              "-webkit-line-clamp": "unset"
            }
          }
        ], variants("lineClamp"));
      }, {
        theme: {
          lineClamp: {
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6"
          }
        },
        variants: {
          lineClamp: ["responsive"]
        }
      });
      module.exports = lineClamp;
    }
  });

  // node_modules/mini-svg-data-uri/shorter-css-color-names.js
  var require_shorter_css_color_names = __commonJS({
    "node_modules/mini-svg-data-uri/shorter-css-color-names.js"(exports, module) {
      module.exports = {
        aqua: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        azure: /#f0ffff(ff)?(?!\w)/gi,
        beige: /#f5f5dc(ff)?(?!\w)/gi,
        bisque: /#ffe4c4(ff)?(?!\w)/gi,
        black: /#000000(ff)?(?!\w)|#000(f)?(?!\w)/gi,
        blue: /#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,
        brown: /#a52a2a(ff)?(?!\w)/gi,
        coral: /#ff7f50(ff)?(?!\w)/gi,
        cornsilk: /#fff8dc(ff)?(?!\w)/gi,
        crimson: /#dc143c(ff)?(?!\w)/gi,
        cyan: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        darkblue: /#00008b(ff)?(?!\w)/gi,
        darkcyan: /#008b8b(ff)?(?!\w)/gi,
        darkgrey: /#a9a9a9(ff)?(?!\w)/gi,
        darkred: /#8b0000(ff)?(?!\w)/gi,
        deeppink: /#ff1493(ff)?(?!\w)/gi,
        dimgrey: /#696969(ff)?(?!\w)/gi,
        gold: /#ffd700(ff)?(?!\w)/gi,
        green: /#008000(ff)?(?!\w)/gi,
        grey: /#808080(ff)?(?!\w)/gi,
        honeydew: /#f0fff0(ff)?(?!\w)/gi,
        hotpink: /#ff69b4(ff)?(?!\w)/gi,
        indigo: /#4b0082(ff)?(?!\w)/gi,
        ivory: /#fffff0(ff)?(?!\w)/gi,
        khaki: /#f0e68c(ff)?(?!\w)/gi,
        lavender: /#e6e6fa(ff)?(?!\w)/gi,
        lime: /#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,
        linen: /#faf0e6(ff)?(?!\w)/gi,
        maroon: /#800000(ff)?(?!\w)/gi,
        moccasin: /#ffe4b5(ff)?(?!\w)/gi,
        navy: /#000080(ff)?(?!\w)/gi,
        oldlace: /#fdf5e6(ff)?(?!\w)/gi,
        olive: /#808000(ff)?(?!\w)/gi,
        orange: /#ffa500(ff)?(?!\w)/gi,
        orchid: /#da70d6(ff)?(?!\w)/gi,
        peru: /#cd853f(ff)?(?!\w)/gi,
        pink: /#ffc0cb(ff)?(?!\w)/gi,
        plum: /#dda0dd(ff)?(?!\w)/gi,
        purple: /#800080(ff)?(?!\w)/gi,
        red: /#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,
        salmon: /#fa8072(ff)?(?!\w)/gi,
        seagreen: /#2e8b57(ff)?(?!\w)/gi,
        seashell: /#fff5ee(ff)?(?!\w)/gi,
        sienna: /#a0522d(ff)?(?!\w)/gi,
        silver: /#c0c0c0(ff)?(?!\w)/gi,
        skyblue: /#87ceeb(ff)?(?!\w)/gi,
        snow: /#fffafa(ff)?(?!\w)/gi,
        tan: /#d2b48c(ff)?(?!\w)/gi,
        teal: /#008080(ff)?(?!\w)/gi,
        thistle: /#d8bfd8(ff)?(?!\w)/gi,
        tomato: /#ff6347(ff)?(?!\w)/gi,
        violet: /#ee82ee(ff)?(?!\w)/gi,
        wheat: /#f5deb3(ff)?(?!\w)/gi,
        white: /#ffffff(ff)?(?!\w)|#fff(f)?(?!\w)/gi
      };
    }
  });

  // node_modules/mini-svg-data-uri/index.js
  var require_mini_svg_data_uri = __commonJS({
    "node_modules/mini-svg-data-uri/index.js"(exports, module) {
      var shorterNames = require_shorter_css_color_names();
      var REGEX = {
        whitespace: /\s+/g,
        urlHexPairs: /%[\dA-F]{2}/g,
        quotes: /"/g
      };
      function collapseWhitespace(str) {
        return str.trim().replace(REGEX.whitespace, " ");
      }
      function dataURIPayload(string) {
        return encodeURIComponent(string).replace(REGEX.urlHexPairs, specialHexEncode);
      }
      function colorCodeToShorterNames(string) {
        Object.keys(shorterNames).forEach(function(key) {
          if (shorterNames[key].test(string)) {
            string = string.replace(shorterNames[key], key);
          }
        });
        return string;
      }
      function specialHexEncode(match) {
        switch (match) {
          case "%20":
            return " ";
          case "%3D":
            return "=";
          case "%3A":
            return ":";
          case "%2F":
            return "/";
          default:
            return match.toLowerCase();
        }
      }
      function svgToTinyDataUri(svgString) {
        if (typeof svgString !== "string") {
          throw new TypeError("Expected a string, but received " + typeof svgString);
        }
        if (svgString.charCodeAt(0) === 65279) {
          svgString = svgString.slice(1);
        }
        var body = colorCodeToShorterNames(collapseWhitespace(svgString)).replace(REGEX.quotes, "'");
        return "data:image/svg+xml," + dataURIPayload(body);
      }
      svgToTinyDataUri.toSrcset = function toSrcset(svgString) {
        return svgToTinyDataUri(svgString).replace(/ /g, "%20");
      };
      module.exports = svgToTinyDataUri;
    }
  });

  // node_modules/tailwindcss/lib/util/cloneDeep.js
  var require_cloneDeep = __commonJS({
    "node_modules/tailwindcss/lib/util/cloneDeep.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.cloneDeep = cloneDeep;
      function cloneDeep(value) {
        if (Array.isArray(value)) {
          return value.map((child) => cloneDeep(child));
        }
        if (typeof value === "object" && value !== null) {
          return Object.fromEntries(Object.entries(value).map(([k, v]) => [
            k,
            cloneDeep(v)
          ]));
        }
        return value;
      }
    }
  });

  // node_modules/tailwindcss/stubs/defaultConfig.stub.js
  var require_defaultConfig_stub = __commonJS({
    "node_modules/tailwindcss/stubs/defaultConfig.stub.js"(exports, module) {
      module.exports = {
        content: [],
        presets: [],
        darkMode: "media",
        theme: {
          screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
          },
          colors: ({ colors }) => ({
            inherit: colors.inherit,
            current: colors.current,
            transparent: colors.transparent,
            black: colors.black,
            white: colors.white,
            slate: colors.slate,
            gray: colors.gray,
            zinc: colors.zinc,
            neutral: colors.neutral,
            stone: colors.stone,
            red: colors.red,
            orange: colors.orange,
            amber: colors.amber,
            yellow: colors.yellow,
            lime: colors.lime,
            green: colors.green,
            emerald: colors.emerald,
            teal: colors.teal,
            cyan: colors.cyan,
            sky: colors.sky,
            blue: colors.blue,
            indigo: colors.indigo,
            violet: colors.violet,
            purple: colors.purple,
            fuchsia: colors.fuchsia,
            pink: colors.pink,
            rose: colors.rose
          }),
          columns: {
            auto: "auto",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "10",
            11: "11",
            12: "12",
            "3xs": "16rem",
            "2xs": "18rem",
            xs: "20rem",
            sm: "24rem",
            md: "28rem",
            lg: "32rem",
            xl: "36rem",
            "2xl": "42rem",
            "3xl": "48rem",
            "4xl": "56rem",
            "5xl": "64rem",
            "6xl": "72rem",
            "7xl": "80rem"
          },
          spacing: {
            px: "1px",
            0: "0px",
            0.5: "0.125rem",
            1: "0.25rem",
            1.5: "0.375rem",
            2: "0.5rem",
            2.5: "0.625rem",
            3: "0.75rem",
            3.5: "0.875rem",
            4: "1rem",
            5: "1.25rem",
            6: "1.5rem",
            7: "1.75rem",
            8: "2rem",
            9: "2.25rem",
            10: "2.5rem",
            11: "2.75rem",
            12: "3rem",
            14: "3.5rem",
            16: "4rem",
            20: "5rem",
            24: "6rem",
            28: "7rem",
            32: "8rem",
            36: "9rem",
            40: "10rem",
            44: "11rem",
            48: "12rem",
            52: "13rem",
            56: "14rem",
            60: "15rem",
            64: "16rem",
            72: "18rem",
            80: "20rem",
            96: "24rem"
          },
          animation: {
            none: "none",
            spin: "spin 1s linear infinite",
            ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            bounce: "bounce 1s infinite"
          },
          aspectRatio: {
            auto: "auto",
            square: "1 / 1",
            video: "16 / 9"
          },
          backdropBlur: ({ theme }) => theme("blur"),
          backdropBrightness: ({ theme }) => theme("brightness"),
          backdropContrast: ({ theme }) => theme("contrast"),
          backdropGrayscale: ({ theme }) => theme("grayscale"),
          backdropHueRotate: ({ theme }) => theme("hueRotate"),
          backdropInvert: ({ theme }) => theme("invert"),
          backdropOpacity: ({ theme }) => theme("opacity"),
          backdropSaturate: ({ theme }) => theme("saturate"),
          backdropSepia: ({ theme }) => theme("sepia"),
          backgroundColor: ({ theme }) => theme("colors"),
          backgroundImage: {
            none: "none",
            "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
            "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
            "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
            "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
            "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
            "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
            "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
            "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
          },
          backgroundOpacity: ({ theme }) => theme("opacity"),
          backgroundPosition: {
            bottom: "bottom",
            center: "center",
            left: "left",
            "left-bottom": "left bottom",
            "left-top": "left top",
            right: "right",
            "right-bottom": "right bottom",
            "right-top": "right top",
            top: "top"
          },
          backgroundSize: {
            auto: "auto",
            cover: "cover",
            contain: "contain"
          },
          blur: {
            0: "0",
            none: "0",
            sm: "4px",
            DEFAULT: "8px",
            md: "12px",
            lg: "16px",
            xl: "24px",
            "2xl": "40px",
            "3xl": "64px"
          },
          brightness: {
            0: "0",
            50: ".5",
            75: ".75",
            90: ".9",
            95: ".95",
            100: "1",
            105: "1.05",
            110: "1.1",
            125: "1.25",
            150: "1.5",
            200: "2"
          },
          borderColor: ({ theme }) => ({
            ...theme("colors"),
            DEFAULT: theme("colors.gray.200", "currentColor")
          }),
          borderOpacity: ({ theme }) => theme("opacity"),
          borderRadius: {
            none: "0px",
            sm: "0.125rem",
            DEFAULT: "0.25rem",
            md: "0.375rem",
            lg: "0.5rem",
            xl: "0.75rem",
            "2xl": "1rem",
            "3xl": "1.5rem",
            full: "9999px"
          },
          borderWidth: {
            DEFAULT: "1px",
            0: "0px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          boxShadow: {
            sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
            none: "none"
          },
          boxShadowColor: ({ theme }) => theme("colors"),
          caretColor: ({ theme }) => theme("colors"),
          accentColor: ({ theme }) => ({
            ...theme("colors"),
            auto: "auto"
          }),
          contrast: {
            0: "0",
            50: ".5",
            75: ".75",
            100: "1",
            125: "1.25",
            150: "1.5",
            200: "2"
          },
          container: {},
          content: {
            none: "none"
          },
          cursor: {
            auto: "auto",
            default: "default",
            pointer: "pointer",
            wait: "wait",
            text: "text",
            move: "move",
            help: "help",
            "not-allowed": "not-allowed",
            none: "none",
            "context-menu": "context-menu",
            progress: "progress",
            cell: "cell",
            crosshair: "crosshair",
            "vertical-text": "vertical-text",
            alias: "alias",
            copy: "copy",
            "no-drop": "no-drop",
            grab: "grab",
            grabbing: "grabbing",
            "all-scroll": "all-scroll",
            "col-resize": "col-resize",
            "row-resize": "row-resize",
            "n-resize": "n-resize",
            "e-resize": "e-resize",
            "s-resize": "s-resize",
            "w-resize": "w-resize",
            "ne-resize": "ne-resize",
            "nw-resize": "nw-resize",
            "se-resize": "se-resize",
            "sw-resize": "sw-resize",
            "ew-resize": "ew-resize",
            "ns-resize": "ns-resize",
            "nesw-resize": "nesw-resize",
            "nwse-resize": "nwse-resize",
            "zoom-in": "zoom-in",
            "zoom-out": "zoom-out"
          },
          divideColor: ({ theme }) => theme("borderColor"),
          divideOpacity: ({ theme }) => theme("borderOpacity"),
          divideWidth: ({ theme }) => theme("borderWidth"),
          dropShadow: {
            sm: "0 1px 1px rgb(0 0 0 / 0.05)",
            DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
            md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
            lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
            xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
            "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
            none: "0 0 #0000"
          },
          fill: ({ theme }) => theme("colors"),
          grayscale: {
            0: "0",
            DEFAULT: "100%"
          },
          hueRotate: {
            0: "0deg",
            15: "15deg",
            30: "30deg",
            60: "60deg",
            90: "90deg",
            180: "180deg"
          },
          invert: {
            0: "0",
            DEFAULT: "100%"
          },
          flex: {
            1: "1 1 0%",
            auto: "1 1 auto",
            initial: "0 1 auto",
            none: "none"
          },
          flexBasis: ({ theme }) => ({
            auto: "auto",
            ...theme("spacing"),
            "1/2": "50%",
            "1/3": "33.333333%",
            "2/3": "66.666667%",
            "1/4": "25%",
            "2/4": "50%",
            "3/4": "75%",
            "1/5": "20%",
            "2/5": "40%",
            "3/5": "60%",
            "4/5": "80%",
            "1/6": "16.666667%",
            "2/6": "33.333333%",
            "3/6": "50%",
            "4/6": "66.666667%",
            "5/6": "83.333333%",
            "1/12": "8.333333%",
            "2/12": "16.666667%",
            "3/12": "25%",
            "4/12": "33.333333%",
            "5/12": "41.666667%",
            "6/12": "50%",
            "7/12": "58.333333%",
            "8/12": "66.666667%",
            "9/12": "75%",
            "10/12": "83.333333%",
            "11/12": "91.666667%",
            full: "100%"
          }),
          flexGrow: {
            0: "0",
            DEFAULT: "1"
          },
          flexShrink: {
            0: "0",
            DEFAULT: "1"
          },
          fontFamily: {
            sans: [
              "ui-sans-serif",
              "system-ui",
              "-apple-system",
              "BlinkMacSystemFont",
              '"Segoe UI"',
              "Roboto",
              '"Helvetica Neue"',
              "Arial",
              '"Noto Sans"',
              "sans-serif",
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
              '"Noto Color Emoji"'
            ],
            serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
            mono: [
              "ui-monospace",
              "SFMono-Regular",
              "Menlo",
              "Monaco",
              "Consolas",
              '"Liberation Mono"',
              '"Courier New"',
              "monospace"
            ]
          },
          fontSize: {
            xs: ["0.75rem", { lineHeight: "1rem" }],
            sm: ["0.875rem", { lineHeight: "1.25rem" }],
            base: ["1rem", { lineHeight: "1.5rem" }],
            lg: ["1.125rem", { lineHeight: "1.75rem" }],
            xl: ["1.25rem", { lineHeight: "1.75rem" }],
            "2xl": ["1.5rem", { lineHeight: "2rem" }],
            "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
            "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
            "5xl": ["3rem", { lineHeight: "1" }],
            "6xl": ["3.75rem", { lineHeight: "1" }],
            "7xl": ["4.5rem", { lineHeight: "1" }],
            "8xl": ["6rem", { lineHeight: "1" }],
            "9xl": ["8rem", { lineHeight: "1" }]
          },
          fontWeight: {
            thin: "100",
            extralight: "200",
            light: "300",
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
            extrabold: "800",
            black: "900"
          },
          gap: ({ theme }) => theme("spacing"),
          gradientColorStops: ({ theme }) => theme("colors"),
          gridAutoColumns: {
            auto: "auto",
            min: "min-content",
            max: "max-content",
            fr: "minmax(0, 1fr)"
          },
          gridAutoRows: {
            auto: "auto",
            min: "min-content",
            max: "max-content",
            fr: "minmax(0, 1fr)"
          },
          gridColumn: {
            auto: "auto",
            "span-1": "span 1 / span 1",
            "span-2": "span 2 / span 2",
            "span-3": "span 3 / span 3",
            "span-4": "span 4 / span 4",
            "span-5": "span 5 / span 5",
            "span-6": "span 6 / span 6",
            "span-7": "span 7 / span 7",
            "span-8": "span 8 / span 8",
            "span-9": "span 9 / span 9",
            "span-10": "span 10 / span 10",
            "span-11": "span 11 / span 11",
            "span-12": "span 12 / span 12",
            "span-full": "1 / -1"
          },
          gridColumnEnd: {
            auto: "auto",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "10",
            11: "11",
            12: "12",
            13: "13"
          },
          gridColumnStart: {
            auto: "auto",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "10",
            11: "11",
            12: "12",
            13: "13"
          },
          gridRow: {
            auto: "auto",
            "span-1": "span 1 / span 1",
            "span-2": "span 2 / span 2",
            "span-3": "span 3 / span 3",
            "span-4": "span 4 / span 4",
            "span-5": "span 5 / span 5",
            "span-6": "span 6 / span 6",
            "span-full": "1 / -1"
          },
          gridRowStart: {
            auto: "auto",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7"
          },
          gridRowEnd: {
            auto: "auto",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7"
          },
          gridTemplateColumns: {
            none: "none",
            1: "repeat(1, minmax(0, 1fr))",
            2: "repeat(2, minmax(0, 1fr))",
            3: "repeat(3, minmax(0, 1fr))",
            4: "repeat(4, minmax(0, 1fr))",
            5: "repeat(5, minmax(0, 1fr))",
            6: "repeat(6, minmax(0, 1fr))",
            7: "repeat(7, minmax(0, 1fr))",
            8: "repeat(8, minmax(0, 1fr))",
            9: "repeat(9, minmax(0, 1fr))",
            10: "repeat(10, minmax(0, 1fr))",
            11: "repeat(11, minmax(0, 1fr))",
            12: "repeat(12, minmax(0, 1fr))"
          },
          gridTemplateRows: {
            none: "none",
            1: "repeat(1, minmax(0, 1fr))",
            2: "repeat(2, minmax(0, 1fr))",
            3: "repeat(3, minmax(0, 1fr))",
            4: "repeat(4, minmax(0, 1fr))",
            5: "repeat(5, minmax(0, 1fr))",
            6: "repeat(6, minmax(0, 1fr))"
          },
          height: ({ theme }) => ({
            auto: "auto",
            ...theme("spacing"),
            "1/2": "50%",
            "1/3": "33.333333%",
            "2/3": "66.666667%",
            "1/4": "25%",
            "2/4": "50%",
            "3/4": "75%",
            "1/5": "20%",
            "2/5": "40%",
            "3/5": "60%",
            "4/5": "80%",
            "1/6": "16.666667%",
            "2/6": "33.333333%",
            "3/6": "50%",
            "4/6": "66.666667%",
            "5/6": "83.333333%",
            full: "100%",
            screen: "100vh",
            min: "min-content",
            max: "max-content",
            fit: "fit-content"
          }),
          inset: ({ theme }) => ({
            auto: "auto",
            ...theme("spacing"),
            "1/2": "50%",
            "1/3": "33.333333%",
            "2/3": "66.666667%",
            "1/4": "25%",
            "2/4": "50%",
            "3/4": "75%",
            full: "100%"
          }),
          keyframes: {
            spin: {
              to: {
                transform: "rotate(360deg)"
              }
            },
            ping: {
              "75%, 100%": {
                transform: "scale(2)",
                opacity: "0"
              }
            },
            pulse: {
              "50%": {
                opacity: ".5"
              }
            },
            bounce: {
              "0%, 100%": {
                transform: "translateY(-25%)",
                animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
              },
              "50%": {
                transform: "none",
                animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
              }
            }
          },
          letterSpacing: {
            tighter: "-0.05em",
            tight: "-0.025em",
            normal: "0em",
            wide: "0.025em",
            wider: "0.05em",
            widest: "0.1em"
          },
          lineHeight: {
            none: "1",
            tight: "1.25",
            snug: "1.375",
            normal: "1.5",
            relaxed: "1.625",
            loose: "2",
            3: ".75rem",
            4: "1rem",
            5: "1.25rem",
            6: "1.5rem",
            7: "1.75rem",
            8: "2rem",
            9: "2.25rem",
            10: "2.5rem"
          },
          listStyleType: {
            none: "none",
            disc: "disc",
            decimal: "decimal"
          },
          margin: ({ theme }) => ({
            auto: "auto",
            ...theme("spacing")
          }),
          maxHeight: ({ theme }) => ({
            ...theme("spacing"),
            full: "100%",
            screen: "100vh",
            min: "min-content",
            max: "max-content",
            fit: "fit-content"
          }),
          maxWidth: ({ theme, breakpoints }) => ({
            none: "none",
            0: "0rem",
            xs: "20rem",
            sm: "24rem",
            md: "28rem",
            lg: "32rem",
            xl: "36rem",
            "2xl": "42rem",
            "3xl": "48rem",
            "4xl": "56rem",
            "5xl": "64rem",
            "6xl": "72rem",
            "7xl": "80rem",
            full: "100%",
            min: "min-content",
            max: "max-content",
            fit: "fit-content",
            prose: "65ch",
            ...breakpoints(theme("screens"))
          }),
          minHeight: {
            0: "0px",
            full: "100%",
            screen: "100vh",
            min: "min-content",
            max: "max-content",
            fit: "fit-content"
          },
          minWidth: {
            0: "0px",
            full: "100%",
            min: "min-content",
            max: "max-content",
            fit: "fit-content"
          },
          objectPosition: {
            bottom: "bottom",
            center: "center",
            left: "left",
            "left-bottom": "left bottom",
            "left-top": "left top",
            right: "right",
            "right-bottom": "right bottom",
            "right-top": "right top",
            top: "top"
          },
          opacity: {
            0: "0",
            5: "0.05",
            10: "0.1",
            20: "0.2",
            25: "0.25",
            30: "0.3",
            40: "0.4",
            50: "0.5",
            60: "0.6",
            70: "0.7",
            75: "0.75",
            80: "0.8",
            90: "0.9",
            95: "0.95",
            100: "1"
          },
          order: {
            first: "-9999",
            last: "9999",
            none: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            10: "10",
            11: "11",
            12: "12"
          },
          padding: ({ theme }) => theme("spacing"),
          placeholderColor: ({ theme }) => theme("colors"),
          placeholderOpacity: ({ theme }) => theme("opacity"),
          outlineColor: ({ theme }) => theme("colors"),
          outlineOffset: {
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          outlineWidth: {
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          ringColor: ({ theme }) => ({
            DEFAULT: theme("colors.blue.500", "#3b82f6"),
            ...theme("colors")
          }),
          ringOffsetColor: ({ theme }) => theme("colors"),
          ringOffsetWidth: {
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          ringOpacity: ({ theme }) => ({
            DEFAULT: "0.5",
            ...theme("opacity")
          }),
          ringWidth: {
            DEFAULT: "3px",
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          rotate: {
            0: "0deg",
            1: "1deg",
            2: "2deg",
            3: "3deg",
            6: "6deg",
            12: "12deg",
            45: "45deg",
            90: "90deg",
            180: "180deg"
          },
          saturate: {
            0: "0",
            50: ".5",
            100: "1",
            150: "1.5",
            200: "2"
          },
          scale: {
            0: "0",
            50: ".5",
            75: ".75",
            90: ".9",
            95: ".95",
            100: "1",
            105: "1.05",
            110: "1.1",
            125: "1.25",
            150: "1.5"
          },
          scrollMargin: ({ theme }) => ({
            ...theme("spacing")
          }),
          scrollPadding: ({ theme }) => theme("spacing"),
          sepia: {
            0: "0",
            DEFAULT: "100%"
          },
          skew: {
            0: "0deg",
            1: "1deg",
            2: "2deg",
            3: "3deg",
            6: "6deg",
            12: "12deg"
          },
          space: ({ theme }) => ({
            ...theme("spacing")
          }),
          stroke: ({ theme }) => theme("colors"),
          strokeWidth: {
            0: "0",
            1: "1",
            2: "2"
          },
          textColor: ({ theme }) => theme("colors"),
          textDecorationColor: ({ theme }) => theme("colors"),
          textDecorationThickness: {
            auto: "auto",
            "from-font": "from-font",
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          textUnderlineOffset: {
            auto: "auto",
            0: "0px",
            1: "1px",
            2: "2px",
            4: "4px",
            8: "8px"
          },
          textIndent: ({ theme }) => ({
            ...theme("spacing")
          }),
          textOpacity: ({ theme }) => theme("opacity"),
          transformOrigin: {
            center: "center",
            top: "top",
            "top-right": "top right",
            right: "right",
            "bottom-right": "bottom right",
            bottom: "bottom",
            "bottom-left": "bottom left",
            left: "left",
            "top-left": "top left"
          },
          transitionDelay: {
            75: "75ms",
            100: "100ms",
            150: "150ms",
            200: "200ms",
            300: "300ms",
            500: "500ms",
            700: "700ms",
            1e3: "1000ms"
          },
          transitionDuration: {
            DEFAULT: "150ms",
            75: "75ms",
            100: "100ms",
            150: "150ms",
            200: "200ms",
            300: "300ms",
            500: "500ms",
            700: "700ms",
            1e3: "1000ms"
          },
          transitionProperty: {
            none: "none",
            all: "all",
            DEFAULT: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
            colors: "background-color, border-color, color, fill, stroke",
            opacity: "opacity",
            shadow: "box-shadow",
            transform: "transform"
          },
          transitionTimingFunction: {
            DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
            linear: "linear",
            in: "cubic-bezier(0.4, 0, 1, 1)",
            out: "cubic-bezier(0, 0, 0.2, 1)",
            "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
          },
          translate: ({ theme }) => ({
            ...theme("spacing"),
            "1/2": "50%",
            "1/3": "33.333333%",
            "2/3": "66.666667%",
            "1/4": "25%",
            "2/4": "50%",
            "3/4": "75%",
            full: "100%"
          }),
          width: ({ theme }) => ({
            auto: "auto",
            ...theme("spacing"),
            "1/2": "50%",
            "1/3": "33.333333%",
            "2/3": "66.666667%",
            "1/4": "25%",
            "2/4": "50%",
            "3/4": "75%",
            "1/5": "20%",
            "2/5": "40%",
            "3/5": "60%",
            "4/5": "80%",
            "1/6": "16.666667%",
            "2/6": "33.333333%",
            "3/6": "50%",
            "4/6": "66.666667%",
            "5/6": "83.333333%",
            "1/12": "8.333333%",
            "2/12": "16.666667%",
            "3/12": "25%",
            "4/12": "33.333333%",
            "5/12": "41.666667%",
            "6/12": "50%",
            "7/12": "58.333333%",
            "8/12": "66.666667%",
            "9/12": "75%",
            "10/12": "83.333333%",
            "11/12": "91.666667%",
            full: "100%",
            screen: "100vw",
            min: "min-content",
            max: "max-content",
            fit: "fit-content"
          }),
          willChange: {
            auto: "auto",
            scroll: "scroll-position",
            contents: "contents",
            transform: "transform"
          },
          zIndex: {
            auto: "auto",
            0: "0",
            10: "10",
            20: "20",
            30: "30",
            40: "40",
            50: "50"
          }
        },
        variantOrder: [
          "first",
          "last",
          "odd",
          "even",
          "visited",
          "checked",
          "empty",
          "read-only",
          "group-hover",
          "group-focus",
          "focus-within",
          "hover",
          "focus",
          "focus-visible",
          "active",
          "disabled"
        ],
        plugins: []
      };
    }
  });

  // node_modules/tailwindcss/lib/public/default-theme.js
  var require_default_theme = __commonJS({
    "node_modules/tailwindcss/lib/public/default-theme.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _cloneDeep = require_cloneDeep();
      var _defaultConfigStub = _interopRequireDefault(require_defaultConfig_stub());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      var _default = (0, _cloneDeep).cloneDeep(_defaultConfigStub.default.theme);
      exports.default = _default;
    }
  });

  // node_modules/tailwindcss/defaultTheme.js
  var require_defaultTheme = __commonJS({
    "node_modules/tailwindcss/defaultTheme.js"(exports, module) {
      var defaultTheme = require_default_theme();
      module.exports = (defaultTheme.__esModule ? defaultTheme : { default: defaultTheme }).default;
    }
  });

  // node_modules/color-name/index.js
  var require_color_name = __commonJS({
    "node_modules/color-name/index.js"(exports, module) {
      "use strict";
      module.exports = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 219],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [219, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "rebeccapurple": [102, 51, 153],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50]
      };
    }
  });

  // node_modules/color-convert/conversions.js
  var require_conversions = __commonJS({
    "node_modules/color-convert/conversions.js"(exports, module) {
      var cssKeywords = require_color_name();
      var reverseKeywords = {};
      for (const key of Object.keys(cssKeywords)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
      var convert = {
        rgb: { channels: 3, labels: "rgb" },
        hsl: { channels: 3, labels: "hsl" },
        hsv: { channels: 3, labels: "hsv" },
        hwb: { channels: 3, labels: "hwb" },
        cmyk: { channels: 4, labels: "cmyk" },
        xyz: { channels: 3, labels: "xyz" },
        lab: { channels: 3, labels: "lab" },
        lch: { channels: 3, labels: "lch" },
        hex: { channels: 1, labels: ["hex"] },
        keyword: { channels: 1, labels: ["keyword"] },
        ansi16: { channels: 1, labels: ["ansi16"] },
        ansi256: { channels: 1, labels: ["ansi256"] },
        hcg: { channels: 3, labels: ["h", "c", "g"] },
        apple: { channels: 3, labels: ["r16", "g16", "b16"] },
        gray: { channels: 1, labels: ["gray"] }
      };
      module.exports = convert;
      for (const model of Object.keys(convert)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        const { channels, labels } = convert[model];
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", { value: channels });
        Object.defineProperty(convert[model], "labels", { value: labels });
      }
      convert.rgb.hsl = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h;
        let s;
        if (max === min) {
          h = 0;
        } else if (r === max) {
          h = (g - b) / delta;
        } else if (g === max) {
          h = 2 + (b - r) / delta;
        } else if (b === max) {
          h = 4 + (r - g) / delta;
        }
        h = Math.min(h * 60, 360);
        if (h < 0) {
          h += 360;
        }
        const l = (min + max) / 2;
        if (max === min) {
          s = 0;
        } else if (l <= 0.5) {
          s = delta / (max + min);
        } else {
          s = delta / (2 - max - min);
        }
        return [h, s * 100, l * 100];
      };
      convert.rgb.hsv = function(rgb) {
        let rdif;
        let gdif;
        let bdif;
        let h;
        let s;
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = function(c) {
          return (v - c) / 6 / diff + 1 / 2;
        };
        if (diff === 0) {
          h = 0;
          s = 0;
        } else {
          s = diff / v;
          rdif = diffc(r);
          gdif = diffc(g);
          bdif = diffc(b);
          if (r === v) {
            h = bdif - gdif;
          } else if (g === v) {
            h = 1 / 3 + rdif - bdif;
          } else if (b === v) {
            h = 2 / 3 + gdif - rdif;
          }
          if (h < 0) {
            h += 1;
          } else if (h > 1) {
            h -= 1;
          }
        }
        return [
          h * 360,
          s * 100,
          v * 100
        ];
      };
      convert.rgb.hwb = function(rgb) {
        const r = rgb[0];
        const g = rgb[1];
        let b = rgb[2];
        const h = convert.rgb.hsl(rgb)[0];
        const w = 1 / 255 * Math.min(r, Math.min(g, b));
        b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
        return [h, w * 100, b * 100];
      };
      convert.rgb.cmyk = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const k = Math.min(1 - r, 1 - g, 1 - b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        return [c * 100, m * 100, y * 100, k * 100];
      };
      function comparativeDistance(x, y) {
        return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
      }
      convert.rgb.keyword = function(rgb) {
        const reversed = reverseKeywords[rgb];
        if (reversed) {
          return reversed;
        }
        let currentClosestDistance = Infinity;
        let currentClosestKeyword;
        for (const keyword of Object.keys(cssKeywords)) {
          const value = cssKeywords[keyword];
          const distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
        return currentClosestKeyword;
      };
      convert.keyword.rgb = function(keyword) {
        return cssKeywords[keyword];
      };
      convert.rgb.xyz = function(rgb) {
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;
        r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
        g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
        b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
        const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
        return [x * 100, y * 100, z * 100];
      };
      convert.rgb.lab = function(rgb) {
        const xyz = convert.rgb.xyz(rgb);
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.hsl.rgb = function(hsl) {
        const h = hsl[0] / 360;
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        let t2;
        let t3;
        let val;
        if (s === 0) {
          val = l * 255;
          return [val, val, val];
        }
        if (l < 0.5) {
          t2 = l * (1 + s);
        } else {
          t2 = l + s - l * s;
        }
        const t1 = 2 * l - t2;
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          t3 = h + 1 / 3 * -(i - 1);
          if (t3 < 0) {
            t3++;
          }
          if (t3 > 1) {
            t3--;
          }
          if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
          } else if (2 * t3 < 1) {
            val = t2;
          } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
          } else {
            val = t1;
          }
          rgb[i] = val * 255;
        }
        return rgb;
      };
      convert.hsl.hsv = function(hsl) {
        const h = hsl[0];
        let s = hsl[1] / 100;
        let l = hsl[2] / 100;
        let smin = s;
        const lmin = Math.max(l, 0.01);
        l *= 2;
        s *= l <= 1 ? l : 2 - l;
        smin *= lmin <= 1 ? lmin : 2 - lmin;
        const v = (l + s) / 2;
        const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
        return [h, sv * 100, v * 100];
      };
      convert.hsv.rgb = function(hsv) {
        const h = hsv[0] / 60;
        const s = hsv[1] / 100;
        let v = hsv[2] / 100;
        const hi = Math.floor(h) % 6;
        const f = h - Math.floor(h);
        const p = 255 * v * (1 - s);
        const q = 255 * v * (1 - s * f);
        const t = 255 * v * (1 - s * (1 - f));
        v *= 255;
        switch (hi) {
          case 0:
            return [v, t, p];
          case 1:
            return [q, v, p];
          case 2:
            return [p, v, t];
          case 3:
            return [p, q, v];
          case 4:
            return [t, p, v];
          case 5:
            return [v, p, q];
        }
      };
      convert.hsv.hsl = function(hsv) {
        const h = hsv[0];
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const vmin = Math.max(v, 0.01);
        let sl;
        let l;
        l = (2 - s) * v;
        const lmin = (2 - s) * vmin;
        sl = s * vmin;
        sl /= lmin <= 1 ? lmin : 2 - lmin;
        sl = sl || 0;
        l /= 2;
        return [h, sl * 100, l * 100];
      };
      convert.hwb.rgb = function(hwb) {
        const h = hwb[0] / 360;
        let wh = hwb[1] / 100;
        let bl = hwb[2] / 100;
        const ratio = wh + bl;
        let f;
        if (ratio > 1) {
          wh /= ratio;
          bl /= ratio;
        }
        const i = Math.floor(6 * h);
        const v = 1 - bl;
        f = 6 * h - i;
        if ((i & 1) !== 0) {
          f = 1 - f;
        }
        const n = wh + f * (v - wh);
        let r;
        let g;
        let b;
        switch (i) {
          default:
          case 6:
          case 0:
            r = v;
            g = n;
            b = wh;
            break;
          case 1:
            r = n;
            g = v;
            b = wh;
            break;
          case 2:
            r = wh;
            g = v;
            b = n;
            break;
          case 3:
            r = wh;
            g = n;
            b = v;
            break;
          case 4:
            r = n;
            g = wh;
            b = v;
            break;
          case 5:
            r = v;
            g = wh;
            b = n;
            break;
        }
        return [r * 255, g * 255, b * 255];
      };
      convert.cmyk.rgb = function(cmyk) {
        const c = cmyk[0] / 100;
        const m = cmyk[1] / 100;
        const y = cmyk[2] / 100;
        const k = cmyk[3] / 100;
        const r = 1 - Math.min(1, c * (1 - k) + k);
        const g = 1 - Math.min(1, m * (1 - k) + k);
        const b = 1 - Math.min(1, y * (1 - k) + k);
        return [r * 255, g * 255, b * 255];
      };
      convert.xyz.rgb = function(xyz) {
        const x = xyz[0] / 100;
        const y = xyz[1] / 100;
        const z = xyz[2] / 100;
        let r;
        let g;
        let b;
        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.204 + z * 1.057;
        r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
        g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
        b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);
        return [r * 255, g * 255, b * 255];
      };
      convert.xyz.lab = function(xyz) {
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.lab.xyz = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let x;
        let y;
        let z;
        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;
        const y2 = y ** 3;
        const x2 = x ** 3;
        const z2 = z ** 3;
        y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
        x *= 95.047;
        y *= 100;
        z *= 108.883;
        return [x, y, z];
      };
      convert.lab.lch = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let h;
        const hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;
        if (h < 0) {
          h += 360;
        }
        const c = Math.sqrt(a * a + b * b);
        return [l, c, h];
      };
      convert.lch.lab = function(lch) {
        const l = lch[0];
        const c = lch[1];
        const h = lch[2];
        const hr = h / 360 * 2 * Math.PI;
        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);
        return [l, a, b];
      };
      convert.rgb.ansi16 = function(args, saturation = null) {
        const [r, g, b] = args;
        let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
        value = Math.round(value / 50);
        if (value === 0) {
          return 30;
        }
        let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
        if (value === 2) {
          ansi += 60;
        }
        return ansi;
      };
      convert.hsv.ansi16 = function(args) {
        return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
      };
      convert.rgb.ansi256 = function(args) {
        const r = args[0];
        const g = args[1];
        const b = args[2];
        if (r === g && g === b) {
          if (r < 8) {
            return 16;
          }
          if (r > 248) {
            return 231;
          }
          return Math.round((r - 8) / 247 * 24) + 232;
        }
        const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
        return ansi;
      };
      convert.ansi16.rgb = function(args) {
        let color = args % 10;
        if (color === 0 || color === 7) {
          if (args > 50) {
            color += 3.5;
          }
          color = color / 10.5 * 255;
          return [color, color, color];
        }
        const mult = (~~(args > 50) + 1) * 0.5;
        const r = (color & 1) * mult * 255;
        const g = (color >> 1 & 1) * mult * 255;
        const b = (color >> 2 & 1) * mult * 255;
        return [r, g, b];
      };
      convert.ansi256.rgb = function(args) {
        if (args >= 232) {
          const c = (args - 232) * 10 + 8;
          return [c, c, c];
        }
        args -= 16;
        let rem;
        const r = Math.floor(args / 36) / 5 * 255;
        const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
        const b = rem % 6 / 5 * 255;
        return [r, g, b];
      };
      convert.rgb.hex = function(args) {
        const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.hex.rgb = function(args) {
        const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!match) {
          return [0, 0, 0];
        }
        let colorString = match[0];
        if (match[0].length === 3) {
          colorString = colorString.split("").map((char) => {
            return char + char;
          }).join("");
        }
        const integer = parseInt(colorString, 16);
        const r = integer >> 16 & 255;
        const g = integer >> 8 & 255;
        const b = integer & 255;
        return [r, g, b];
      };
      convert.rgb.hcg = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const max = Math.max(Math.max(r, g), b);
        const min = Math.min(Math.min(r, g), b);
        const chroma = max - min;
        let grayscale;
        let hue;
        if (chroma < 1) {
          grayscale = min / (1 - chroma);
        } else {
          grayscale = 0;
        }
        if (chroma <= 0) {
          hue = 0;
        } else if (max === r) {
          hue = (g - b) / chroma % 6;
        } else if (max === g) {
          hue = 2 + (b - r) / chroma;
        } else {
          hue = 4 + (r - g) / chroma;
        }
        hue /= 6;
        hue %= 1;
        return [hue * 360, chroma * 100, grayscale * 100];
      };
      convert.hsl.hcg = function(hsl) {
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
        let f = 0;
        if (c < 1) {
          f = (l - 0.5 * c) / (1 - c);
        }
        return [hsl[0], c * 100, f * 100];
      };
      convert.hsv.hcg = function(hsv) {
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const c = s * v;
        let f = 0;
        if (c < 1) {
          f = (v - c) / (1 - c);
        }
        return [hsv[0], c * 100, f * 100];
      };
      convert.hcg.rgb = function(hcg) {
        const h = hcg[0] / 360;
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        if (c === 0) {
          return [g * 255, g * 255, g * 255];
        }
        const pure = [0, 0, 0];
        const hi = h % 1 * 6;
        const v = hi % 1;
        const w = 1 - v;
        let mg = 0;
        switch (Math.floor(hi)) {
          case 0:
            pure[0] = 1;
            pure[1] = v;
            pure[2] = 0;
            break;
          case 1:
            pure[0] = w;
            pure[1] = 1;
            pure[2] = 0;
            break;
          case 2:
            pure[0] = 0;
            pure[1] = 1;
            pure[2] = v;
            break;
          case 3:
            pure[0] = 0;
            pure[1] = w;
            pure[2] = 1;
            break;
          case 4:
            pure[0] = v;
            pure[1] = 0;
            pure[2] = 1;
            break;
          default:
            pure[0] = 1;
            pure[1] = 0;
            pure[2] = w;
        }
        mg = (1 - c) * g;
        return [
          (c * pure[0] + mg) * 255,
          (c * pure[1] + mg) * 255,
          (c * pure[2] + mg) * 255
        ];
      };
      convert.hcg.hsv = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const v = c + g * (1 - c);
        let f = 0;
        if (v > 0) {
          f = c / v;
        }
        return [hcg[0], f * 100, v * 100];
      };
      convert.hcg.hsl = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const l = g * (1 - c) + 0.5 * c;
        let s = 0;
        if (l > 0 && l < 0.5) {
          s = c / (2 * l);
        } else if (l >= 0.5 && l < 1) {
          s = c / (2 * (1 - l));
        }
        return [hcg[0], s * 100, l * 100];
      };
      convert.hcg.hwb = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const v = c + g * (1 - c);
        return [hcg[0], (v - c) * 100, (1 - v) * 100];
      };
      convert.hwb.hcg = function(hwb) {
        const w = hwb[1] / 100;
        const b = hwb[2] / 100;
        const v = 1 - b;
        const c = v - w;
        let g = 0;
        if (c < 1) {
          g = (v - c) / (1 - c);
        }
        return [hwb[0], c * 100, g * 100];
      };
      convert.apple.rgb = function(apple) {
        return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
      };
      convert.rgb.apple = function(rgb) {
        return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
      };
      convert.gray.rgb = function(args) {
        return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
      };
      convert.gray.hsl = function(args) {
        return [0, 0, args[0]];
      };
      convert.gray.hsv = convert.gray.hsl;
      convert.gray.hwb = function(gray) {
        return [0, 100, gray[0]];
      };
      convert.gray.cmyk = function(gray) {
        return [0, 0, 0, gray[0]];
      };
      convert.gray.lab = function(gray) {
        return [gray[0], 0, 0];
      };
      convert.gray.hex = function(gray) {
        const val = Math.round(gray[0] / 100 * 255) & 255;
        const integer = (val << 16) + (val << 8) + val;
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.rgb.gray = function(rgb) {
        const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return [val / 255 * 100];
      };
    }
  });

  // node_modules/color-convert/route.js
  var require_route = __commonJS({
    "node_modules/color-convert/route.js"(exports, module) {
      var conversions = require_conversions();
      function buildGraph() {
        const graph = {};
        const models = Object.keys(conversions);
        for (let len = models.length, i = 0; i < len; i++) {
          graph[models[i]] = {
            distance: -1,
            parent: null
          };
        }
        return graph;
      }
      function deriveBFS(fromModel) {
        const graph = buildGraph();
        const queue = [fromModel];
        graph[fromModel].distance = 0;
        while (queue.length) {
          const current = queue.pop();
          const adjacents = Object.keys(conversions[current]);
          for (let len = adjacents.length, i = 0; i < len; i++) {
            const adjacent = adjacents[i];
            const node = graph[adjacent];
            if (node.distance === -1) {
              node.distance = graph[current].distance + 1;
              node.parent = current;
              queue.unshift(adjacent);
            }
          }
        }
        return graph;
      }
      function link(from, to) {
        return function(args) {
          return to(from(args));
        };
      }
      function wrapConversion(toModel, graph) {
        const path = [graph[toModel].parent, toModel];
        let fn = conversions[graph[toModel].parent][toModel];
        let cur = graph[toModel].parent;
        while (graph[cur].parent) {
          path.unshift(graph[cur].parent);
          fn = link(conversions[graph[cur].parent][cur], fn);
          cur = graph[cur].parent;
        }
        fn.conversion = path;
        return fn;
      }
      module.exports = function(fromModel) {
        const graph = deriveBFS(fromModel);
        const conversion = {};
        const models = Object.keys(graph);
        for (let len = models.length, i = 0; i < len; i++) {
          const toModel = models[i];
          const node = graph[toModel];
          if (node.parent === null) {
            continue;
          }
          conversion[toModel] = wrapConversion(toModel, graph);
        }
        return conversion;
      };
    }
  });

  // node_modules/color-convert/index.js
  var require_color_convert = __commonJS({
    "node_modules/color-convert/index.js"(exports, module) {
      var conversions = require_conversions();
      var route = require_route();
      var convert = {};
      var models = Object.keys(conversions);
      function wrapRaw(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          return fn(args);
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      function wrapRounded(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          const result = fn(args);
          if (typeof result === "object") {
            for (let len = result.length, i = 0; i < len; i++) {
              result[i] = Math.round(result[i]);
            }
          }
          return result;
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      models.forEach((fromModel) => {
        convert[fromModel] = {};
        Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
        Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
        const routes = route(fromModel);
        const routeModels = Object.keys(routes);
        routeModels.forEach((toModel) => {
          const fn = routes[toModel];
          convert[fromModel][toModel] = wrapRounded(fn);
          convert[fromModel][toModel].raw = wrapRaw(fn);
        });
      });
      module.exports = convert;
    }
  });

  // node_modules/ansi-styles/index.js
  var require_ansi_styles = __commonJS({
    "node_modules/ansi-styles/index.js"(exports, module) {
      "use strict";
      var wrapAnsi16 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `[${code + offset}m`;
      };
      var wrapAnsi256 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `[${38 + offset};5;${code}m`;
      };
      var wrapAnsi16m = (fn, offset) => (...args) => {
        const rgb = fn(...args);
        return `[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
      };
      var ansi2ansi = (n) => n;
      var rgb2rgb = (r, g, b) => [r, g, b];
      var setLazyProperty = (object, property, get) => {
        Object.defineProperty(object, property, {
          get: () => {
            const value = get();
            Object.defineProperty(object, property, {
              value,
              enumerable: true,
              configurable: true
            });
            return value;
          },
          enumerable: true,
          configurable: true
        });
      };
      var colorConvert;
      var makeDynamicStyles = (wrap2, targetSpace, identity, isBackground) => {
        if (colorConvert === void 0) {
          colorConvert = require_color_convert();
        }
        const offset = isBackground ? 10 : 0;
        const styles = {};
        for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
          const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
          if (sourceSpace === targetSpace) {
            styles[name] = wrap2(identity, offset);
          } else if (typeof suite === "object") {
            styles[name] = wrap2(suite[targetSpace], offset);
          }
        }
        return styles;
      };
      function assembleStyles() {
        const codes = /* @__PURE__ */ new Map();
        const styles = {
          modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
          },
          color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
          },
          bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
          }
        };
        styles.color.gray = styles.color.blackBright;
        styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
        styles.color.grey = styles.color.blackBright;
        styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
        for (const [groupName, group] of Object.entries(styles)) {
          for (const [styleName, style] of Object.entries(group)) {
            styles[styleName] = {
              open: `[${style[0]}m`,
              close: `[${style[1]}m`
            };
            group[styleName] = styles[styleName];
            codes.set(style[0], style[1]);
          }
          Object.defineProperty(styles, groupName, {
            value: group,
            enumerable: false
          });
        }
        Object.defineProperty(styles, "codes", {
          value: codes,
          enumerable: false
        });
        styles.color.close = "[39m";
        styles.bgColor.close = "[49m";
        setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
        setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
        setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
        setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
        setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
        setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
        return styles;
      }
      Object.defineProperty(module, "exports", {
        enumerable: true,
        get: assembleStyles
      });
    }
  });

  // node_modules/supports-color/browser.js
  var require_browser = __commonJS({
    "node_modules/supports-color/browser.js"(exports, module) {
      "use strict";
      module.exports = {
        stdout: false,
        stderr: false
      };
    }
  });

  // node_modules/chalk/source/util.js
  var require_util = __commonJS({
    "node_modules/chalk/source/util.js"(exports, module) {
      "use strict";
      var stringReplaceAll = (string, substring, replacer) => {
        let index = string.indexOf(substring);
        if (index === -1) {
          return string;
        }
        const substringLength = substring.length;
        let endIndex = 0;
        let returnValue = "";
        do {
          returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
          endIndex = index + substringLength;
          index = string.indexOf(substring, endIndex);
        } while (index !== -1);
        returnValue += string.substr(endIndex);
        return returnValue;
      };
      var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
        let endIndex = 0;
        let returnValue = "";
        do {
          const gotCR = string[index - 1] === "\r";
          returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
          endIndex = index + 1;
          index = string.indexOf("\n", endIndex);
        } while (index !== -1);
        returnValue += string.substr(endIndex);
        return returnValue;
      };
      module.exports = {
        stringReplaceAll,
        stringEncaseCRLFWithFirstIndex
      };
    }
  });

  // node_modules/chalk/source/templates.js
  var require_templates = __commonJS({
    "node_modules/chalk/source/templates.js"(exports, module) {
      "use strict";
      var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
      var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
      var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
      var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
      var ESCAPES = /* @__PURE__ */ new Map([
        ["n", "\n"],
        ["r", "\r"],
        ["t", "	"],
        ["b", "\b"],
        ["f", "\f"],
        ["v", "\v"],
        ["0", "\0"],
        ["\\", "\\"],
        ["e", ""],
        ["a", "\x07"]
      ]);
      function unescape2(c) {
        const u = c[0] === "u";
        const bracket = c[1] === "{";
        if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
          return String.fromCharCode(parseInt(c.slice(1), 16));
        }
        if (u && bracket) {
          return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
        }
        return ESCAPES.get(c) || c;
      }
      function parseArguments(name, arguments_) {
        const results = [];
        const chunks = arguments_.trim().split(/\s*,\s*/g);
        let matches;
        for (const chunk of chunks) {
          const number = Number(chunk);
          if (!Number.isNaN(number)) {
            results.push(number);
          } else if (matches = chunk.match(STRING_REGEX)) {
            results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape2(escape) : character));
          } else {
            throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
          }
        }
        return results;
      }
      function parseStyle(style) {
        STYLE_REGEX.lastIndex = 0;
        const results = [];
        let matches;
        while ((matches = STYLE_REGEX.exec(style)) !== null) {
          const name = matches[1];
          if (matches[2]) {
            const args = parseArguments(name, matches[2]);
            results.push([name].concat(args));
          } else {
            results.push([name]);
          }
        }
        return results;
      }
      function buildStyle(chalk, styles) {
        const enabled = {};
        for (const layer of styles) {
          for (const style of layer.styles) {
            enabled[style[0]] = layer.inverse ? null : style.slice(1);
          }
        }
        let current = chalk;
        for (const [styleName, styles2] of Object.entries(enabled)) {
          if (!Array.isArray(styles2)) {
            continue;
          }
          if (!(styleName in current)) {
            throw new Error(`Unknown Chalk style: ${styleName}`);
          }
          current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
        }
        return current;
      }
      module.exports = (chalk, temporary) => {
        const styles = [];
        const chunks = [];
        let chunk = [];
        temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
          if (escapeCharacter) {
            chunk.push(unescape2(escapeCharacter));
          } else if (style) {
            const string = chunk.join("");
            chunk = [];
            chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
            styles.push({ inverse, styles: parseStyle(style) });
          } else if (close) {
            if (styles.length === 0) {
              throw new Error("Found extraneous } in Chalk template literal");
            }
            chunks.push(buildStyle(chalk, styles)(chunk.join("")));
            chunk = [];
            styles.pop();
          } else {
            chunk.push(character);
          }
        });
        chunks.push(chunk.join(""));
        if (styles.length > 0) {
          const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
          throw new Error(errMessage);
        }
        return chunks.join("");
      };
    }
  });

  // node_modules/chalk/source/index.js
  var require_source = __commonJS({
    "node_modules/chalk/source/index.js"(exports, module) {
      "use strict";
      var ansiStyles = require_ansi_styles();
      var { stdout: stdoutColor, stderr: stderrColor } = require_browser();
      var {
        stringReplaceAll,
        stringEncaseCRLFWithFirstIndex
      } = require_util();
      var { isArray } = Array;
      var levelMapping = [
        "ansi",
        "ansi",
        "ansi256",
        "ansi16m"
      ];
      var styles = Object.create(null);
      var applyOptions = (object, options = {}) => {
        if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
          throw new Error("The `level` option should be an integer from 0 to 3");
        }
        const colorLevel = stdoutColor ? stdoutColor.level : 0;
        object.level = options.level === void 0 ? colorLevel : options.level;
      };
      var ChalkClass = class {
        constructor(options) {
          return chalkFactory(options);
        }
      };
      var chalkFactory = (options) => {
        const chalk2 = {};
        applyOptions(chalk2, options);
        chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
        Object.setPrototypeOf(chalk2, Chalk.prototype);
        Object.setPrototypeOf(chalk2.template, chalk2);
        chalk2.template.constructor = () => {
          throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
        };
        chalk2.template.Instance = ChalkClass;
        return chalk2.template;
      };
      function Chalk(options) {
        return chalkFactory(options);
      }
      for (const [styleName, style] of Object.entries(ansiStyles)) {
        styles[styleName] = {
          get() {
            const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
            Object.defineProperty(this, styleName, { value: builder });
            return builder;
          }
        };
      }
      styles.visible = {
        get() {
          const builder = createBuilder(this, this._styler, true);
          Object.defineProperty(this, "visible", { value: builder });
          return builder;
        }
      };
      var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
      for (const model of usedModels) {
        styles[model] = {
          get() {
            const { level } = this;
            return function(...arguments_) {
              const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
              return createBuilder(this, styler, this._isEmpty);
            };
          }
        };
      }
      for (const model of usedModels) {
        const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
        styles[bgModel] = {
          get() {
            const { level } = this;
            return function(...arguments_) {
              const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
              return createBuilder(this, styler, this._isEmpty);
            };
          }
        };
      }
      var proto = Object.defineProperties(() => {
      }, {
        ...styles,
        level: {
          enumerable: true,
          get() {
            return this._generator.level;
          },
          set(level) {
            this._generator.level = level;
          }
        }
      });
      var createStyler = (open, close, parent) => {
        let openAll;
        let closeAll;
        if (parent === void 0) {
          openAll = open;
          closeAll = close;
        } else {
          openAll = parent.openAll + open;
          closeAll = close + parent.closeAll;
        }
        return {
          open,
          close,
          openAll,
          closeAll,
          parent
        };
      };
      var createBuilder = (self2, _styler, _isEmpty) => {
        const builder = (...arguments_) => {
          if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
            return applyStyle(builder, chalkTag(builder, ...arguments_));
          }
          return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
        };
        Object.setPrototypeOf(builder, proto);
        builder._generator = self2;
        builder._styler = _styler;
        builder._isEmpty = _isEmpty;
        return builder;
      };
      var applyStyle = (self2, string) => {
        if (self2.level <= 0 || !string) {
          return self2._isEmpty ? "" : string;
        }
        let styler = self2._styler;
        if (styler === void 0) {
          return string;
        }
        const { openAll, closeAll } = styler;
        if (string.indexOf("") !== -1) {
          while (styler !== void 0) {
            string = stringReplaceAll(string, styler.close, styler.open);
            styler = styler.parent;
          }
        }
        const lfIndex = string.indexOf("\n");
        if (lfIndex !== -1) {
          string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
        }
        return openAll + string + closeAll;
      };
      var template2;
      var chalkTag = (chalk2, ...strings) => {
        const [firstString] = strings;
        if (!isArray(firstString) || !isArray(firstString.raw)) {
          return strings.join(" ");
        }
        const arguments_ = strings.slice(1);
        const parts = [firstString.raw[0]];
        for (let i = 1; i < firstString.length; i++) {
          parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"), String(firstString.raw[i]));
        }
        if (template2 === void 0) {
          template2 = require_templates();
        }
        return template2(chalk2, parts.join(""));
      };
      Object.defineProperties(Chalk.prototype, styles);
      var chalk = Chalk();
      chalk.supportsColor = stdoutColor;
      chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
      chalk.stderr.supportsColor = stderrColor;
      module.exports = chalk;
    }
  });

  // node_modules/tailwindcss/lib/util/log.js
  var require_log = __commonJS({
    "node_modules/tailwindcss/lib/util/log.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _chalk = _interopRequireDefault(require_source());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      var alreadyShown = /* @__PURE__ */ new Set();
      function log(chalk, messages, key) {
        if (process.env.JEST_WORKER_ID !== void 0)
          return;
        if (key && alreadyShown.has(key))
          return;
        if (key)
          alreadyShown.add(key);
        console.warn("");
        messages.forEach((message) => console.warn(chalk, "-", message));
      }
      var _default = {
        info(key, messages) {
          log(_chalk.default.bold.cyan("info"), ...Array.isArray(key) ? [
            key
          ] : [
            messages,
            key
          ]);
        },
        warn(key, messages) {
          log(_chalk.default.bold.yellow("warn"), ...Array.isArray(key) ? [
            key
          ] : [
            messages,
            key
          ]);
        },
        risk(key, messages) {
          log(_chalk.default.bold.magenta("risk"), ...Array.isArray(key) ? [
            key
          ] : [
            messages,
            key
          ]);
        }
      };
      exports.default = _default;
    }
  });

  // node_modules/tailwindcss/lib/public/colors.js
  var require_colors = __commonJS({
    "node_modules/tailwindcss/lib/public/colors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _log = _interopRequireDefault(require_log());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function warn({ version: version2, from, to }) {
        _log.default.warn(`${from}-color-renamed`, [
          `As of Tailwind CSS ${version2}, \`${from}\` has been renamed to \`${to}\`.`,
          "Update your configuration file to silence this warning."
        ]);
      }
      var _default = {
        inherit: "inherit",
        current: "currentColor",
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827"
        },
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b"
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717"
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917"
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d"
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        },
        yellow: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12"
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314"
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a"
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63"
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e"
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95"
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87"
        },
        fuchsia: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75"
        },
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843"
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337"
        },
        get lightBlue() {
          warn({
            version: "v2.2",
            from: "lightBlue",
            to: "sky"
          });
          return this.sky;
        },
        get warmGray() {
          warn({
            version: "v3.0",
            from: "warmGray",
            to: "stone"
          });
          return this.stone;
        },
        get trueGray() {
          warn({
            version: "v3.0",
            from: "trueGray",
            to: "neutral"
          });
          return this.neutral;
        },
        get coolGray() {
          warn({
            version: "v3.0",
            from: "coolGray",
            to: "gray"
          });
          return this.gray;
        },
        get blueGray() {
          warn({
            version: "v3.0",
            from: "blueGray",
            to: "slate"
          });
          return this.slate;
        }
      };
      exports.default = _default;
    }
  });

  // node_modules/tailwindcss/colors.js
  var require_colors2 = __commonJS({
    "node_modules/tailwindcss/colors.js"(exports, module) {
      var colors = require_colors();
      module.exports = (colors.__esModule ? colors : { default: colors }).default;
    }
  });

  // node_modules/@tailwindcss/forms/src/index.js
  var require_src2 = __commonJS({
    "node_modules/@tailwindcss/forms/src/index.js"(exports, module) {
      var svgToDataUri = require_mini_svg_data_uri();
      var plugin = require_plugin();
      var defaultTheme = require_defaultTheme();
      var colors = require_colors2();
      var [baseFontSize, { lineHeight: baseLineHeight }] = defaultTheme.fontSize.base;
      var { spacing, borderWidth, borderRadius } = defaultTheme;
      var forms = plugin.withOptions(function(options = { strategy: "base" }) {
        return function({ addBase, theme }) {
          const strategy = options.strategy;
          const rules = [
            {
              base: [
                "[type='text']",
                "[type='email']",
                "[type='url']",
                "[type='password']",
                "[type='number']",
                "[type='date']",
                "[type='datetime-local']",
                "[type='month']",
                "[type='search']",
                "[type='tel']",
                "[type='time']",
                "[type='week']",
                "[multiple]",
                "textarea",
                "select"
              ],
              class: [".form-input", ".form-textarea", ".form-select", ".form-multiselect"],
              styles: {
                appearance: "none",
                "background-color": "#fff",
                "border-color": theme("colors.gray.500", colors.gray[500]),
                "border-width": borderWidth["DEFAULT"],
                "border-radius": borderRadius.none,
                "padding-top": spacing[2],
                "padding-right": spacing[3],
                "padding-bottom": spacing[2],
                "padding-left": spacing[3],
                "font-size": baseFontSize,
                "line-height": baseLineHeight,
                "--tw-shadow": "0 0 #0000",
                "&:focus": {
                  outline: "2px solid transparent",
                  "outline-offset": "2px",
                  "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-ring-offset-width": "0px",
                  "--tw-ring-offset-color": "#fff",
                  "--tw-ring-color": theme("colors.blue.600", colors.blue[600]),
                  "--tw-ring-offset-shadow": `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
                  "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                  "box-shadow": `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`,
                  "border-color": theme("colors.blue.600", colors.blue[600])
                }
              }
            },
            {
              base: ["input::placeholder", "textarea::placeholder"],
              class: [".form-input::placeholder", ".form-textarea::placeholder"],
              styles: {
                color: theme("colors.gray.500", colors.gray[500]),
                opacity: "1"
              }
            },
            {
              base: ["::-webkit-datetime-edit-fields-wrapper"],
              class: [".form-input::-webkit-datetime-edit-fields-wrapper"],
              styles: {
                padding: "0"
              }
            },
            {
              base: ["::-webkit-date-and-time-value"],
              class: [".form-input::-webkit-date-and-time-value"],
              styles: {
                "min-height": "1.5em"
              }
            },
            {
              base: ["select"],
              class: [".form-select"],
              styles: {
                "background-image": `url("${svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${theme("colors.gray.500", colors.gray[500])}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`)}")`,
                "background-position": `right ${spacing[2]} center`,
                "background-repeat": `no-repeat`,
                "background-size": `1.5em 1.5em`,
                "padding-right": spacing[10],
                "color-adjust": `exact`
              }
            },
            {
              base: ["[multiple]"],
              class: null,
              styles: {
                "background-image": "initial",
                "background-position": "initial",
                "background-repeat": "unset",
                "background-size": "initial",
                "padding-right": spacing[3],
                "color-adjust": "unset"
              }
            },
            {
              base: [`[type='checkbox']`, `[type='radio']`],
              class: [".form-checkbox", ".form-radio"],
              styles: {
                appearance: "none",
                padding: "0",
                "color-adjust": "exact",
                display: "inline-block",
                "vertical-align": "middle",
                "background-origin": "border-box",
                "user-select": "none",
                "flex-shrink": "0",
                height: spacing[4],
                width: spacing[4],
                color: theme("colors.blue.600", colors.blue[600]),
                "background-color": "#fff",
                "border-color": theme("colors.gray.500", colors.gray[500]),
                "border-width": borderWidth["DEFAULT"],
                "--tw-shadow": "0 0 #0000"
              }
            },
            {
              base: [`[type='checkbox']`],
              class: [".form-checkbox"],
              styles: {
                "border-radius": borderRadius["none"]
              }
            },
            {
              base: [`[type='radio']`],
              class: [".form-radio"],
              styles: {
                "border-radius": "100%"
              }
            },
            {
              base: [`[type='checkbox']:focus`, `[type='radio']:focus`],
              class: [".form-checkbox:focus", ".form-radio:focus"],
              styles: {
                outline: "2px solid transparent",
                "outline-offset": "2px",
                "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-ring-offset-width": "2px",
                "--tw-ring-offset-color": "#fff",
                "--tw-ring-color": theme("colors.blue.600", colors.blue[600]),
                "--tw-ring-offset-shadow": `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
                "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                "box-shadow": `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`
              }
            },
            {
              base: [`[type='checkbox']:checked`, `[type='radio']:checked`],
              class: [".form-checkbox:checked", ".form-radio:checked"],
              styles: {
                "border-color": `transparent`,
                "background-color": `currentColor`,
                "background-size": `100% 100%`,
                "background-position": `center`,
                "background-repeat": `no-repeat`
              }
            },
            {
              base: [`[type='checkbox']:checked`],
              class: [".form-checkbox:checked"],
              styles: {
                "background-image": `url("${svgToDataUri(`<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>`)}")`
              }
            },
            {
              base: [`[type='radio']:checked`],
              class: [".form-radio:checked"],
              styles: {
                "background-image": `url("${svgToDataUri(`<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`)}")`
              }
            },
            {
              base: [
                `[type='checkbox']:checked:hover`,
                `[type='checkbox']:checked:focus`,
                `[type='radio']:checked:hover`,
                `[type='radio']:checked:focus`
              ],
              class: [
                ".form-checkbox:checked:hover",
                ".form-checkbox:checked:focus",
                ".form-radio:checked:hover",
                ".form-radio:checked:focus"
              ],
              styles: {
                "border-color": "transparent",
                "background-color": "currentColor"
              }
            },
            {
              base: [`[type='checkbox']:indeterminate`],
              class: [".form-checkbox:indeterminate"],
              styles: {
                "background-image": `url("${svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h8"/></svg>`)}")`,
                "border-color": `transparent`,
                "background-color": `currentColor`,
                "background-size": `100% 100%`,
                "background-position": `center`,
                "background-repeat": `no-repeat`
              }
            },
            {
              base: [`[type='checkbox']:indeterminate:hover`, `[type='checkbox']:indeterminate:focus`],
              class: [".form-checkbox:indeterminate:hover", ".form-checkbox:indeterminate:focus"],
              styles: {
                "border-color": "transparent",
                "background-color": "currentColor"
              }
            },
            {
              base: [`[type='file']`],
              class: null,
              styles: {
                background: "unset",
                "border-color": "inherit",
                "border-width": "0",
                "border-radius": "0",
                padding: "0",
                "font-size": "unset",
                "line-height": "inherit"
              }
            },
            {
              base: [`[type='file']:focus`],
              class: null,
              styles: {
                outline: `1px solid ButtonText`,
                outline: `1px auto -webkit-focus-ring-color`
              }
            }
          ];
          addBase(rules.map((rule) => {
            if (rule[strategy] === null) {
              return null;
            }
            return { [rule[strategy]]: rule.styles };
          }).filter(Boolean));
        };
      });
      module.exports = forms;
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      "HTMLElement": function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function")
      return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    } else {
      prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class extends HTMLElement {
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      const { src } = this;
      this.src = null;
      this.src = src;
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url2) {
    let anchorMatch;
    if (url2.hash) {
      return url2.hash.slice(1);
    } else if (anchorMatch = url2.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url2) {
    return (getLastPathComponent(url2).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url2) {
    return !!getExtension(url2).match(/^(?:|\.(?:htm|html|xhtml))$/);
  }
  function isPrefixedBy(baseURL, url2) {
    const prefix = getPrefix(url2);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url2) {
    const anchor = getAnchor(url2);
    return anchor != null ? url2.href.slice(0, -(anchor.length + 1)) : url2.href;
  }
  function toCacheKey(url2) {
    return getRequestURL(url2);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url2) {
    return url2.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url2) {
    return getPathComponents(url2).slice(-1)[0];
  }
  function getPrefix(url2) {
    return addTrailingSlash(url2.origin + url2.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, { cancelable, bubbles: true, detail });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.apply(null, { length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      this.body = body;
      this.url = location2;
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      var _a, _b;
      const { fetchOptions } = this;
      (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error4) {
        if (error4.name !== "AbortError") {
          this.delegate.requestErrored(this, error4);
          throw error4;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", { cancelable: true, detail: { fetchResponse }, target: this.target });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.isIdempotent ? null : this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        "Accept": "text/html, application/xhtml+xml"
      };
    }
    get isIdempotent() {
      return this.method == FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
  };
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    constructor(html) {
      this.templateElement = document.createElement("template");
      this.templateElement.innerHTML = html;
    }
    static wrap(message) {
      if (typeof message == "string") {
        return new this(message);
      } else {
        return message;
      }
    }
    get fragment() {
      const fragment = document.createDocumentFragment();
      for (const element of this.foreignElements) {
        fragment.appendChild(document.importNode(element, true));
      }
      return fragment;
    }
    get foreignElements() {
      return this.templateChildren.reduce((streamElements, child) => {
        if (child.tagName.toLowerCase() == "turbo-stream") {
          return [...streamElements, child];
        } else {
          return streamElements;
        }
      }, []);
    }
    get templateChildren() {
      return Array.from(this.templateElement.content.children);
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.location = expandURL(this.action);
      if (this.method == FetchMethod.get) {
        mergeFormDataEntries(this.location, [...this.body.entries()]);
      }
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    static confirmMethod(message, element) {
      return confirm(message);
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      return ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formaction")) || this.formElement.getAttribute("action") || formElementAction || "";
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
      return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    get confirmationMessage() {
      return this.formElement.getAttribute("data-turbo-confirm");
    }
    get needsConfirmation() {
      return this.confirmationMessage !== null;
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      if (this.needsConfirmation) {
        const answer = FormSubmission.confirmMethod(this.confirmationMessage, this.formElement);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareHeadersForRequest(headers, request2) {
      if (!request2.isIdempotent) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          headers["X-CSRF-Token"] = token;
        }
        headers["Accept"] = [StreamMessage.contentType, headers["Accept"]].join(", ");
      }
    }
    requestStarted(request2) {
      var _a;
      this.state = FormSubmissionState.waiting;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
      dispatch("turbo:submit-start", { target: this.formElement, detail: { formSubmission: this } });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request2, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request2, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request2) && responseSucceededWithoutRedirect(response)) {
        const error4 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error4);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request2, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request2, error4) {
      this.result = { success: false, error: error4 };
      this.delegate.formSubmissionErrored(this, error4);
    }
    requestFinished(request2) {
      var _a;
      this.state = FormSubmissionState.stopped;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
      dispatch("turbo:submit-end", { target: this.formElement, detail: Object.assign({ formSubmission: this }, this.result) });
      this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request2) {
      return !request2.isIdempotent && this.mustRedirect;
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name && value != null && formData.get(name) != value) {
      formData.append(name, value);
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function getMetaContent(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element && element.content;
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function mergeFormDataEntries(url2, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      searchParams.append(name, value);
    }
    url2.search = searchParams.toString();
    return url2;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return this.element.querySelector("[autofocus]");
    }
    get permanentElements() {
      return [...this.element.querySelectorAll("[id][data-turbo-permanent]")];
    }
    getPermanentElementById(id2) {
      return this.element.querySelector(`#${id2}[data-turbo-permanent]`);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id: id2 } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id2);
        if (newPermanentElement) {
          permanentElementMap[id2] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  var FormInterceptor = class {
    constructor(delegate, element) {
      this.submitBubbled = (event) => {
        const form = event.target;
        if (!event.defaultPrevented && form instanceof HTMLFormElement && form.closest("turbo-frame, html") == this.element) {
          const submitter = event.submitter || void 0;
          const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.method;
          if (method != "dialog" && this.delegate.shouldInterceptFormSubmission(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmissionIntercepted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("submit", this.submitBubbled);
    }
    stop() {
      this.element.removeEventListener("submit", this.submitBubbled);
    }
  };
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (value) => {
      };
      this.resolveInterceptionPromise = (value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.resolveRenderPromise = resolve);
          this.renderer = renderer;
          this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.resolveInterceptionPromise = resolve);
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, this.resolveInterceptionPromise);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate();
      }
    }
    invalidate() {
      this.delegate.viewInvalidated();
    }
    prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    invalidate() {
      this.element.innerHTML = "";
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = () => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var Bardo = class {
    constructor(permanentElementMap) {
      this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(permanentElementMap, callback) {
      const bardo = new this(permanentElementMap);
      bardo.enter();
      callback();
      bardo.leave();
    }
    enter() {
      for (const id2 in this.permanentElementMap) {
        const [, newPermanentElement] = this.permanentElementMap[id2];
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id2 in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id2];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id2) {
      return this.placeholders.find((element) => element.content == id2);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    createScriptElement(element) {
      if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
      } else {
        const createdScriptElement = document.createElement("script");
        if (this.cspNonce) {
          createdScriptElement.nonce = this.cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
      }
    }
    preservingPermanentElements(callback) {
      Bardo.preservingPermanentElements(this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get cspNonce() {
      var _a;
      return (_a = document.head.querySelector('meta[name="csp-nonce"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
    }
  };
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of [...sourceElement.attributes]) {
      destinationElement.setAttribute(name, value);
    }
  }
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(this.currentElement);
      destinationRange.deleteContents();
      const frameElement = this.newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        this.currentElement.appendChild(sourceRange.extractContents());
      }
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        if (element) {
          element.scrollIntoView({ block });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class {
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 9999;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result ? result[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class extends Snapshot {
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    clone() {
      return new PageSnapshot(this.element.cloneNode(true), this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshotHTML, response, visitCachedSnapshot, willRender } = Object.assign(Object.assign({}, defaultOptions), options);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.scrolled = !willRender;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.adapter.visitCompleted(this);
        this.delegate.visitCompleted(this);
        this.followRedirect();
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = this.getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML));
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview, this.willRender);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      var _a;
      if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.adapter.visitRendered(this);
        });
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(request2, response) {
    }
    async requestSucceededWithResponse(request2, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request2, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(request2, error4) {
      this.recordResponse({ statusCode: SystemStatusCode.networkFailure, redirected: false });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot().then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
      this.performScroll();
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      this.navigator.startVisit(location2, uuid(), options);
    }
    visitStarted(visit2) {
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.changeHistory();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload();
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(visit2) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(visit2) {
    }
    pageInvalidated() {
      this.reload();
    }
    visitFailed(visit2) {
    }
    visitRendered(visit2) {
    }
    formSubmissionStarted(formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload() {
      window.location.reload();
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    removeStaleElements() {
      const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
      for (const element of staleElements) {
        element.remove();
      }
    }
  };
  var FormSubmitObserver = class {
    constructor(delegate) {
      this.started = false;
      this.submitCaptured = () => {
        removeEventListener("submit", this.submitBubbled, false);
        addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form) {
            const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
            if (method != "dialog" && this.delegate.willSubmitForm(form, submitter)) {
              event.preventDefault();
              this.delegate.formSubmitted(form, submitter);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  var FrameRedirector = class {
    constructor(element) {
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formInterceptor = new FormInterceptor(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formInterceptor.stop();
    }
    shouldInterceptLinkClick(element, url2) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url2) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url2);
      }
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldSubmit(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.removeAttribute("reloadable");
        frame.delegate.formSubmissionIntercepted(element, submitter);
      }
    }
    shouldSubmit(form, submitter) {
      var _a;
      const action = getAction(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
      return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      return frame ? frame != element.closest("turbo-frame") : false;
    }
    findFrameElement(element, submitter) {
      const id2 = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id2 && id2 != "_top") {
        const frame = this.element.querySelector(`#${id2}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkClickObserver = class {
    constructor(delegate) {
      this.started = false;
      this.clickCaptured = () => {
        removeEventListener("click", this.clickBubbled, false);
        addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      if (target instanceof Element) {
        return target.closest("a[href]:not([target^=_]):not([download])");
      }
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        if (locationIsVisitable(location2, this.view.snapshot.rootLocation)) {
          this.delegate.visitProposedToLocation(location2, options);
        } else {
          window.location.href = location2.toString();
        }
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          if (formSubmission.method != FetchMethod.get) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.getActionForFormSubmission(formSubmission);
          const visitOptions = { action, response: { statusCode, responseHTML, redirected } };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot);
        } else {
          await this.view.renderPage(snapshot);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error4) {
      console.error(error4);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
      const { formElement, submitter } = formSubmission;
      const action = getAttribute("data-turbo-action", submitter, formElement);
      return isAction(action) ? action : "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = /* @__PURE__ */ new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(new StreamMessage(html));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head, body } = document;
      documentElement.replaceChild(this.newHead, head);
      documentElement.replaceChild(this.newElement, body);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = this.createScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return [...document.documentElement.querySelectorAll("script")];
    }
  };
  var PageRenderer = class extends Renderer {
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    prepareToRender() {
      this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    mergeHead() {
      this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
    }
    replaceBody() {
      this.preservingPermanentElements(() => {
        this.activateNewBody();
        this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    copyNewHeadStylesheetElements() {
      for (const element of this.newHeadStylesheetElements) {
        document.head.appendChild(element);
      }
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(this.createScriptElement(element));
      }
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    assignNewBody() {
      if (document.body && this.newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(this.newElement);
      } else {
        document.documentElement.appendChild(this.newElement);
      }
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1)
        this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
    }
    renderPage(snapshot, isPreview = false, willRender = true) {
      const renderer = new PageRenderer(this.snapshot, snapshot, isPreview, willRender);
      return this.render(renderer);
    }
    renderError(snapshot) {
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot() {
      if (this.shouldCacheSnapshot) {
        this.delegate.viewWillCacheSnapshot();
        const { snapshot, lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
    get shouldCacheSnapshot() {
      return this.snapshot.isCacheable;
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this);
      this.formSubmitObserver = new FormSubmitObserver(this);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.frameRedirector = new FrameRedirector(document.documentElement);
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      this.navigator.proposeVisit(expandURL(location2), options);
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      document.documentElement.appendChild(StreamMessage.wrap(message).fragment);
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, { action: "restore", historyChanged: true });
      } else {
        this.adapter.pageInvalidated();
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willFollowLinkToLocation(link, location2) {
      return this.elementDriveEnabled(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      this.convertLinkWithMethodClickToFormSubmission(link) || this.visit(location2.href, { action });
    }
    convertLinkWithMethodClickToFormSubmission(link) {
      const linkMethod = link.getAttribute("data-turbo-method");
      if (linkMethod) {
        const form = document.createElement("form");
        form.method = linkMethod;
        form.action = link.getAttribute("href") || "undefined";
        form.hidden = true;
        if (link.hasAttribute("data-turbo-confirm")) {
          form.setAttribute("data-turbo-confirm", link.getAttribute("data-turbo-confirm"));
        }
        const frame = this.getTargetFrameForLink(link);
        if (frame) {
          form.setAttribute("data-turbo-frame", frame);
          form.addEventListener("turbo:submit-start", () => form.remove());
        } else {
          form.addEventListener("submit", () => form.remove());
        }
        document.body.appendChild(form);
        return dispatch("submit", { cancelable: true, target: form });
      } else {
        return false;
      }
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    visitStarted(visit2) {
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      const action = getAction(form, submitter);
      return this.elementDriveEnabled(form) && (!submitter || this.elementDriveEnabled(submitter)) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, resume) {
      const event = this.notifyApplicationBeforeRender(element, resume);
      return !event.defaultPrevented;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    viewInvalidated() {
      this.adapter.pageInvalidated();
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2) {
      return dispatch("turbo:click", { target: link, detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", { detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      markAsBusy(document.documentElement);
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, resume) {
      return dispatch("turbo:before-render", { detail: { newBody, resume }, cancelable: true });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      clearBusyState(document.documentElement);
      return dispatch("turbo:load", { detail: { url: this.location.href, timing } });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", { oldURL: oldURL.toString(), newURL: newURL.toString() }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", { detail: { fetchResponse }, target: frame, cancelable: true });
    }
    elementDriveEnabled(element) {
      const container = element === null || element === void 0 ? void 0 : element.closest("[data-turbo]");
      if (this.drive) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      const action = link.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
    getTargetFrameForLink(link) {
      const frame = link.getAttribute("data-turbo-frame");
      if (frame) {
        return frame;
      } else {
        const container = link.closest("turbo-frame");
        if (container) {
          return container.id;
        }
      }
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url2) {
    Object.defineProperties(url2, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session();
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    PageRenderer,
    PageSnapshot,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod
  });
  var FrameController = class {
    constructor(element) {
      this.fetchResponseLoaded = (fetchResponse) => {
      };
      this.currentFetchRequest = null;
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.settingSourceURL = false;
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.formInterceptor = new FormInterceptor(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        this.reloadable = false;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        }
        this.linkInterceptor.start();
        this.formInterceptor.start();
        this.sourceURLChanged();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.linkInterceptor.stop();
        this.formInterceptor.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (!this.settingSourceURL && this.enabled && this.isActive && (this.reloadable || this.sourceURL != this.currentURL)) {
        const previousURL = this.currentURL;
        this.currentURL = this.sourceURL;
        if (this.sourceURL) {
          try {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
          } catch (error4) {
            this.currentURL = previousURL;
            throw error4;
          }
        }
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const { body } = parseHTMLDocument(html);
          const snapshot = new Snapshot(await this.extractForeignFrameElement(body));
          const renderer = new FrameRenderer(this.view.snapshot, snapshot, false, false);
          if (this.view.renderPromise)
            await this.view.renderPromise;
          await this.view.render(renderer);
          session.frameRendered(fetchResponse, this.element);
          session.frameLoaded(this.element);
          this.fetchResponseLoaded(fetchResponse);
        }
      } catch (error4) {
        console.error(error4);
        this.view.invalidate();
      } finally {
        this.fetchResponseLoaded = () => {
        };
      }
    }
    elementAppearedInViewport(element) {
      this.loadSourceURL();
    }
    shouldInterceptLinkClick(element, url2) {
      if (element.hasAttribute("data-turbo-method")) {
        return false;
      } else {
        return this.shouldInterceptNavigation(element);
      }
    }
    linkClickIntercepted(element, url2) {
      this.reloadable = true;
      this.navigateFrame(element, url2);
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldInterceptNavigation(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.reloadable = false;
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
      this.formSubmission.start();
    }
    prepareHeadersForRequest(headers, request2) {
      headers["Turbo-Frame"] = this.id;
    }
    requestStarted(request2) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(request2, response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request2, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestFailedWithResponse(request2, response) {
      console.error(response);
      this.resolveVisitPromise();
    }
    requestErrored(request2, error4) {
      console.error(error4);
      this.resolveVisitPromise();
    }
    requestFinished(request2) {
      clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      this.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error4) {
      console.error(error4);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender(snapshot, resume) {
      return true;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
    }
    viewInvalidated() {
    }
    async visit(url2) {
      var _a;
      const request2 = new FetchRequest(this, FetchMethod.get, url2, new URLSearchParams(), this.element);
      (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
      this.currentFetchRequest = request2;
      return new Promise((resolve) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          this.currentFetchRequest = null;
          resolve();
        };
        request2.perform();
      });
    }
    navigateFrame(element, url2, submitter) {
      const frame = this.findFrameElement(element, submitter);
      this.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      frame.setAttribute("reloadable", "");
      frame.src = url2;
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      const action = getAttribute("data-turbo-action", submitter, element, frame);
      if (isAction(action)) {
        const { visitCachedSnapshot } = new SnapshotSubstitution(frame);
        frame.delegate.fetchResponseLoaded = (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = frame.ownerDocument.documentElement.outerHTML;
            const response = { statusCode, redirected, responseHTML };
            session.visit(frame.src, { action, response, visitCachedSnapshot, willRender: false });
          }
        };
      }
    }
    findFrameElement(element, submitter) {
      var _a;
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return (_a = getFrameElementById(id2)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id2 = CSS.escape(this.id);
      try {
        if (element = activateElement(container.querySelector(`turbo-frame#${id2}`), this.currentURL)) {
          return element;
        }
        if (element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id2}]`), this.currentURL)) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
        console.error(`Response has no matching <turbo-frame id="${id2}"> element`);
      } catch (error4) {
        console.error(error4);
      }
      return new FrameElement();
    }
    formActionIsVisitable(form, submitter) {
      const action = getAction(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id2 == "_top") {
        return false;
      }
      if (id2) {
        const frameElement = getFrameElementById(id2);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementDriveEnabled(element)) {
        return false;
      }
      if (submitter && !session.elementDriveEnabled(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    get reloadable() {
      const frame = this.findFrameElement(this.element);
      return frame.hasAttribute("reloadable");
    }
    set reloadable(value) {
      const frame = this.findFrameElement(this.element);
      if (value) {
        frame.setAttribute("reloadable", "");
      } else {
        frame.removeAttribute("reloadable");
      }
    }
    set sourceURL(sourceURL) {
      this.settingSourceURL = true;
      this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      this.currentURL = this.element.src;
      this.settingSourceURL = false;
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
    get rootLocation() {
      var _a;
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
  };
  var SnapshotSubstitution = class {
    constructor(element) {
      this.visitCachedSnapshot = ({ element: element2 }) => {
        var _a;
        const { id: id2, clone } = this;
        (_a = element2.querySelector("#" + id2)) === null || _a === void 0 ? void 0 : _a.replaceWith(clone);
      };
      this.clone = element.cloneNode(true);
      this.id = element.id;
    }
  };
  function getFrameElementById(id2) {
    if (id2 != null) {
      const element = document.getElementById(id2);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((e) => {
        e.innerHTML = "";
        e.append(this.templateContent);
      });
    }
  };
  var StreamElement = class extends HTMLElement {
    async connectedCallback() {
      try {
        await this.render();
      } catch (error4) {
        console.error(error4);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        if (this.dispatchEvent(this.beforeRenderEvent)) {
          await nextAnimationFrame();
          this.performAction();
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...(_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", { bubbles: true, cancelable: true });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  FrameElement.delegateConstructor = FrameController;
  customElements.define("turbo-frame", FrameElement);
  customElements.define("turbo-stream", StreamElement);
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    while (element = element.parentElement) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
    }
  })();
  window.Turbo = Turbo;
  start();

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error4, message, detail = {}) {
      this.application.handleError(error4, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName: matches[2],
      eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
      identifier: matches[5],
      methodName: matches[7]
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  var Action = class {
    constructor(element, index, descriptor) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
      const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
      if (this.eventTarget instanceof Element) {
        return this.getParamsFromEventTargetAttributes(this.eventTarget);
      } else {
        return {};
      }
    }
    getParamsFromEventTargetAttributes(eventTarget) {
      const params2 = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
      const attributes = Array.from(eventTarget.attributes);
      attributes.forEach(({ name, value }) => {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          Object.assign(params2, { [camelize(key)]: typecast(value) });
        }
      });
      return params2;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
  };
  var defaultEventNames = {
    "a": (e) => "click",
    "button": (e) => "click",
    "form": (e) => "submit",
    "details": (e) => "toggle",
    "input": (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    "select": (e) => "change",
    "textarea": (e) => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      if (this.willBeInvokedByEvent(event)) {
        this.invokeWithEvent(event);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        const { params: params2 } = this.action;
        const actionEvent = Object.assign(event, { params: params2 });
        this.method.call(this.controller, actionEvent);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error4) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error4, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(node, attributeName) {
      const element = node;
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([key, values]) => values.has(value)).map(([key, values]) => key);
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error4) {
        return { error: error4 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
      this.invokeChangedCallbacksForDefaultValues();
    }
    start() {
      this.stringMapObserver.start();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        const value = descriptor.reader(rawValue);
        let oldValue = rawOldValue;
        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue);
        }
        changedMethod.call(this.receiver, value, oldValue);
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error4) {
        this.handleError(error4, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error4) {
        this.handleError(error4, "connecting controller");
      }
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error4) {
        this.handleError(error4, "disconnecting controller");
      }
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error4, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error4, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error4) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var Scope = class {
    constructor(schema2, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema2;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema2, delegate) {
      this.element = element;
      this.schema = schema2;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    handleError(error4, message, detail) {
      this.application.handleError(error4, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`
  };
  var Application = class {
    constructor(element = document.documentElement, schema2 = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema2;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
    }
    static start(element, schema2) {
      const application2 = new Application(element, schema2);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      if (controllerConstructor.shouldLoad) {
        this.load({ identifier, controllerConstructor });
      }
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => this.router.loadDefinition(definition));
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error4, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error4, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error4);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError("Expected object");
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
  Controller.targets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  // node_modules/stimulus_reflex/javascript/utils.js
  var uuidv4 = () => {
    const crypto = window.crypto || window.msCrypto;
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  };
  var serializeForm = (form, options = {}) => {
    if (!form)
      return "";
    const w = options.w || window;
    const { element } = options;
    const formData = new w.FormData(form);
    const data = Array.from(formData, (e) => e.map(encodeURIComponent).join("="));
    const submitButton = form.querySelector("input[type=submit]");
    if (element && element.name && element.nodeName === "INPUT" && element.type === "submit") {
      data.push(`${encodeURIComponent(element.name)}=${encodeURIComponent(element.value)}`);
    } else if (submitButton && submitButton.name) {
      data.push(`${encodeURIComponent(submitButton.name)}=${encodeURIComponent(submitButton.value)}`);
    }
    return Array.from(data).join("&");
  };
  var camelize2 = (value, uppercaseFirstLetter = true) => {
    if (typeof value !== "string")
      return "";
    value = value.replace(/[\s_](.)/g, ($1) => $1.toUpperCase()).replace(/[\s_]/g, "").replace(/^(.)/, ($1) => $1.toLowerCase());
    if (uppercaseFirstLetter)
      value = value.substr(0, 1).toUpperCase() + value.substr(1);
    return value;
  };
  var debounce = (callback, delay = 250) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        callback(...args);
      }, delay);
    };
  };
  var extractReflexName = (reflexString) => {
    const match = reflexString.match(/(?:.*->)?(.*?)(?:Reflex)?#/);
    return match ? match[1] : "";
  };
  var emitEvent = (event, detail) => {
    document.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      cancelable: false,
      detail
    }));
    if (window.jQuery)
      window.jQuery(document).trigger(event, detail);
  };
  var elementToXPath = (element) => {
    if (element.id !== "")
      return "//*[@id='" + element.id + "']";
    if (element === document.body)
      return "/html/body";
    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        const computedPath = elementToXPath(element.parentNode);
        const tagName = element.tagName.toLowerCase();
        const ixInc = ix + 1;
        return `${computedPath}/${tagName}[${ixInc}]`;
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  };
  var XPathToElement = (xpath) => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };
  var XPathToArray = (xpath, reverse = false) => {
    const snapshotList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const snapshots = [];
    for (let i = 0; i < snapshotList.snapshotLength; i++) {
      snapshots.push(snapshotList.snapshotItem(i));
    }
    return reverse ? snapshots.reverse() : snapshots;
  };

  // node_modules/stimulus_reflex/javascript/debug.js
  var debugging = false;
  var debug_default = {
    get enabled() {
      return debugging;
    },
    get disabled() {
      return !debugging;
    },
    get value() {
      return debugging;
    },
    set(value) {
      debugging = !!value;
    },
    set debug(value) {
      debugging = !!value;
    }
  };

  // node_modules/cable_ready/package.json
  var version = "5.0.0-pre8";

  // node_modules/cable_ready/javascript/enums.js
  var inputTags = {
    INPUT: true,
    TEXTAREA: true,
    SELECT: true
  };
  var mutableTags = {
    INPUT: true,
    TEXTAREA: true,
    OPTION: true
  };
  var textInputTypes = {
    "datetime-local": true,
    "select-multiple": true,
    "select-one": true,
    color: true,
    date: true,
    datetime: true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    textarea: true,
    time: true,
    url: true,
    week: true
  };

  // node_modules/cable_ready/javascript/active_element.js
  var activeElement;
  var active_element_default = {
    get element() {
      return activeElement;
    },
    set(element) {
      activeElement = element;
    }
  };

  // node_modules/cable_ready/javascript/utils.js
  var isTextInput = (element) => {
    return inputTags[element.tagName] && textInputTypes[element.type];
  };
  var assignFocus = (selector) => {
    const element = selector && selector.nodeType === Node.ELEMENT_NODE ? selector : document.querySelector(selector);
    const focusElement = element || active_element_default.element;
    if (focusElement && focusElement.focus)
      focusElement.focus();
  };
  var dispatch2 = (element, name, detail = {}) => {
    const init = { bubbles: true, cancelable: true, detail };
    const evt = new CustomEvent(name, init);
    element.dispatchEvent(evt);
    if (window.jQuery)
      window.jQuery(element).trigger(name, detail);
  };
  var xpathToElement = (xpath) => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };
  var getClassNames = (names) => Array(names).flat();
  var processElements = (operation, callback) => {
    Array.from(operation.selectAll ? operation.element : [operation.element]).forEach(callback);
  };
  var kebabize = (str) => {
    return str.split("").map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}` : letter;
    }).join("");
  };
  var operate = (operation, callback) => {
    if (!operation.cancel) {
      operation.delay ? setTimeout(callback, operation.delay) : callback();
      return true;
    }
    return false;
  };
  var before = (target, operation) => dispatch2(target, `cable-ready:before-${kebabize(operation.operation)}`, operation);
  var after = (target, operation) => dispatch2(target, `cable-ready:after-${kebabize(operation.operation)}`, operation);
  function debounce2(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), timeout);
    };
  }
  function handleErrors(response) {
    if (!response.ok)
      throw Error(response.statusText);
    return response;
  }
  async function graciouslyFetch(url2, additionalHeaders) {
    try {
      const response = await fetch(url2, {
        headers: {
          "X-REQUESTED-WITH": "XmlHttpRequest",
          ...additionalHeaders
        }
      });
      if (response == void 0)
        return;
      handleErrors(response);
      return response;
    } catch (e) {
      console.error(`Could not fetch ${url2}`);
    }
  }

  // node_modules/cable_ready/javascript/morph_callbacks.js
  var shouldMorph = (operation) => (fromEl, toEl) => {
    return !shouldMorphCallbacks.map((callback) => {
      return typeof callback === "function" ? callback(operation, fromEl, toEl) : true;
    }).includes(false);
  };
  var didMorph = (operation) => (el) => {
    didMorphCallbacks.forEach((callback) => {
      if (typeof callback === "function")
        callback(operation, el);
    });
  };
  var verifyNotMutable = (detail, fromEl, toEl) => {
    if (!mutableTags[fromEl.tagName] && fromEl.isEqualNode(toEl))
      return false;
    return true;
  };
  var verifyNotContentEditable = (detail, fromEl, toEl) => {
    if (fromEl === active_element_default.element && fromEl.isContentEditable)
      return false;
    return true;
  };
  var verifyNotPermanent = (detail, fromEl, toEl) => {
    const { permanentAttributeName } = detail;
    if (!permanentAttributeName)
      return true;
    const permanent = fromEl.closest(`[${permanentAttributeName}]`);
    if (!permanent && fromEl === active_element_default.element && isTextInput(fromEl)) {
      const ignore = { value: true };
      Array.from(toEl.attributes).forEach((attribute) => {
        if (!ignore[attribute.name])
          fromEl.setAttribute(attribute.name, attribute.value);
      });
      return false;
    }
    return !permanent;
  };
  var shouldMorphCallbacks = [
    verifyNotMutable,
    verifyNotPermanent,
    verifyNotContentEditable
  ];
  var didMorphCallbacks = [];

  // node_modules/morphdom/dist/morphdom-esm.js
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template2 = doc.createElement("template");
    template2.innerHTML = str;
    return template2.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;

  // node_modules/cable_ready/javascript/operations.js
  var operations_default = {
    append: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.insertAdjacentHTML("beforeend", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    graft: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { parent, focusSelector } = operation;
          const parentElement = document.querySelector(parent);
          if (parentElement) {
            parentElement.appendChild(element);
            assignFocus(focusSelector);
          }
        });
        after(element, operation);
      });
    },
    innerHtml: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.innerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    insertAdjacentHtml: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, position, focusSelector } = operation;
          element.insertAdjacentHTML(position || "beforeend", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    insertAdjacentText: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { text, position, focusSelector } = operation;
          element.insertAdjacentText(position || "beforeend", text || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    morph: (operation) => {
      processElements(operation, (element) => {
        const { html } = operation;
        const template2 = document.createElement("template");
        template2.innerHTML = String(html).trim();
        operation.content = template2.content;
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { childrenOnly, focusSelector } = operation;
          morphdom_esm_default(element, childrenOnly ? template2.content : template2.innerHTML, {
            childrenOnly: !!childrenOnly,
            onBeforeElUpdated: shouldMorph(operation),
            onElUpdated: didMorph(operation)
          });
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    outerHtml: (operation) => {
      processElements(operation, (element) => {
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.outerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    prepend: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.insertAdjacentHTML("afterbegin", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    remove: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { focusSelector } = operation;
          element.remove();
          assignFocus(focusSelector);
        });
        after(document, operation);
      });
    },
    replace: (operation) => {
      processElements(operation, (element) => {
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.outerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    textContent: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { text, focusSelector } = operation;
          element.textContent = text || "";
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    addCssClass: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.classList.add(...getClassNames(name || ""));
        });
        after(element, operation);
      });
    },
    removeAttribute: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.removeAttribute(name);
        });
        after(element, operation);
      });
    },
    removeCssClass: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.classList.remove(...getClassNames(name));
        });
        after(element, operation);
      });
    },
    setAttribute: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.setAttribute(name, value || "");
        });
        after(element, operation);
      });
    },
    setDatasetProperty: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.dataset[name] = value || "";
        });
        after(element, operation);
      });
    },
    setProperty: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          if (name in element)
            element[name] = value || "";
        });
        after(element, operation);
      });
    },
    setStyle: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.style[name] = value || "";
        });
        after(element, operation);
      });
    },
    setStyles: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { styles } = operation;
          for (let [name, value] of Object.entries(styles))
            element.style[name] = value || "";
        });
        after(element, operation);
      });
    },
    setValue: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { value } = operation;
          element.value = value || "";
        });
        after(element, operation);
      });
    },
    dispatchEvent: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, detail } = operation;
          dispatch2(element, name, detail);
        });
        after(element, operation);
      });
    },
    setMeta: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { name, content } = operation;
        let meta = document.head.querySelector(`meta[name='${name}']`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      });
      after(document, operation);
    },
    clearStorage: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.clear();
      });
      after(document, operation);
    },
    go: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { delta } = operation;
        history.go(delta);
      });
      after(window, operation);
    },
    pushState: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { state, title, url: url2 } = operation;
        history.pushState(state || {}, title || "", url2);
      });
      after(window, operation);
    },
    redirectTo: (operation) => {
      before(window, operation);
      operate(operation, () => {
        let { url: url2, action } = operation;
        action = action || "advance";
        if (window.Turbo)
          window.Turbo.visit(url2, { action });
        if (window.Turbolinks)
          window.Turbolinks.visit(url2, { action });
        if (!window.Turbo && !window.Turbolinks)
          window.location.href = url2;
      });
      after(window, operation);
    },
    reload: (operation) => {
      before(window, operation);
      operate(operation, () => {
        window.location.reload();
      });
      after(window, operation);
    },
    removeStorageItem: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { key, type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.removeItem(key);
      });
      after(document, operation);
    },
    replaceState: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { state, title, url: url2 } = operation;
        history.replaceState(state || {}, title || "", url2);
      });
      after(window, operation);
    },
    scrollIntoView: (operation) => {
      const { element } = operation;
      before(element, operation);
      operate(operation, () => {
        element.scrollIntoView(operation);
      });
      after(element, operation);
    },
    setCookie: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { cookie } = operation;
        document.cookie = cookie || "";
      });
      after(document, operation);
    },
    setFocus: (operation) => {
      const { element } = operation;
      before(element, operation);
      operate(operation, () => {
        assignFocus(element);
      });
      after(element, operation);
    },
    setStorageItem: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { key, value, type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.setItem(key, value || "");
      });
      after(document, operation);
    },
    consoleLog: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { message, level } = operation;
        level && ["warn", "info", "error"].includes(level) ? console[level](message || "") : console.log(message || "");
      });
      after(document, operation);
    },
    consoleTable: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { data, columns } = operation;
        console.table(data, columns || []);
      });
      after(document, operation);
    },
    notification: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { title, options } = operation;
        Notification.requestPermission().then((result) => {
          operation.permission = result;
          if (result === "granted")
            new Notification(title || "", options);
        });
      });
      after(document, operation);
    }
  };

  // node_modules/cable_ready/javascript/operation_store.js
  var operations = operations_default;
  var add2 = (newOperations) => {
    operations = { ...operations, ...newOperations };
  };
  var addOperations = (operations2) => {
    add2(operations2);
  };
  var addOperation = (name, operation) => {
    const operations2 = {};
    operations2[name] = operation;
    add2(operations2);
  };
  var operation_store_default = {
    get all() {
      return operations;
    }
  };

  // node_modules/cable_ready/javascript/action_cable.js
  var consumer;
  var wait = () => new Promise((resolve) => setTimeout(resolve));
  var retryGetConsumer = async () => {
    if (!consumer) {
      await wait();
      return retryGetConsumer();
    } else {
      return consumer;
    }
  };
  var action_cable_default = {
    setConsumer(value) {
      consumer = value;
    },
    async getConsumer() {
      return new Promise((resolve, reject) => {
        consumer = retryGetConsumer();
        resolve(consumer);
      });
    }
  };

  // node_modules/cable_ready/javascript/elements/subscribing_element.js
  var SubscribingElement = class extends HTMLElement {
    disconnectedCallback() {
      if (this.channel)
        this.channel.unsubscribe();
    }
    createSubscription(consumer4, channel, receivedCallback) {
      this.channel = consumer4.subscriptions.create({
        channel,
        identifier: this.getAttribute("identifier")
      }, {
        received: receivedCallback
      });
    }
    get preview() {
      return document.documentElement.hasAttribute("data-turbolinks-preview") || document.documentElement.hasAttribute("data-turbo-preview");
    }
  };

  // node_modules/cable_ready/javascript/elements/stream_from_element.js
  var StreamFromElement = class extends SubscribingElement {
    async connectedCallback() {
      if (this.preview)
        return;
      const consumer4 = await javascript_default.consumer;
      if (consumer4) {
        this.createSubscription(consumer4, "CableReady::Stream", this.performOperations);
      } else {
        console.error("The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.");
      }
    }
    performOperations(data) {
      if (data.cableReady)
        javascript_default.perform(data.operations);
    }
  };

  // node_modules/cable_ready/javascript/elements/updates_for_element.js
  var template = `
<style>
  :host {
    display: block;
  }
</style>
<slot></slot>
`;
  function url(ele) {
    return ele.hasAttribute("url") ? ele.getAttribute("url") : location.href;
  }
  var UpdatesForElement = class extends SubscribingElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = template;
    }
    async connectedCallback() {
      if (this.preview)
        return;
      this.update = debounce2(this.update.bind(this), this.debounce);
      const consumer4 = await javascript_default.consumer;
      if (consumer4) {
        this.createSubscription(consumer4, "CableReady::Stream", this.update);
      } else {
        console.error("The `updates-for` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.");
      }
    }
    async update(data) {
      const identifier = this.getAttribute("identifier");
      const query = `updates-for[identifier="${identifier}"]`;
      const blocks = document.querySelectorAll(query);
      if (blocks[0] !== this)
        return;
      const only = this.getAttribute("only");
      if (only && data.changed && !only.split(" ").some((attribute) => data.changed.includes(attribute)))
        return;
      const html = {};
      const template2 = document.createElement("template");
      for (let i = 0; i < blocks.length; i++) {
        blocks[i].setAttribute("updating", "updating");
        if (!html.hasOwnProperty(url(blocks[i]))) {
          const response = await graciouslyFetch(url(blocks[i]), {
            "X-Cable-Ready": "update"
          });
          html[url(blocks[i])] = await response.text();
        }
        template2.innerHTML = String(html[url(blocks[i])]).trim();
        await this.resolveTurboFrames(template2.content);
        const fragments = template2.content.querySelectorAll(query);
        if (fragments.length <= i) {
          console.warn("Update aborted due to mismatched number of elements");
          return;
        }
        active_element_default.set(document.activeElement);
        const operation = {
          element: blocks[i],
          html: fragments[i],
          permanentAttributeName: "data-ignore-updates"
        };
        dispatch2(blocks[i], "cable-ready:before-update", operation);
        morphdom_esm_default(blocks[i], fragments[i], {
          childrenOnly: true,
          onBeforeElUpdated: shouldMorph(operation),
          onElUpdated: (_) => {
            blocks[i].removeAttribute("updating");
            dispatch2(blocks[i], "cable-ready:after-update", operation);
            assignFocus(operation.focusSelector);
          }
        });
      }
    }
    async resolveTurboFrames(documentFragment) {
      const reloadingTurboFrames = [
        ...documentFragment.querySelectorAll('turbo-frame[src]:not([loading="lazy"])')
      ];
      return Promise.all(reloadingTurboFrames.map((frame) => {
        return new Promise(async (resolve) => {
          const frameResponse = await graciouslyFetch(frame.getAttribute("src"), {
            "Turbo-Frame": frame.id,
            "X-Cable-Ready": "update"
          });
          const frameTemplate = document.createElement("template");
          frameTemplate.innerHTML = await frameResponse.text();
          await this.resolveTurboFrames(frameTemplate.content);
          documentFragment.querySelector(`turbo-frame#${frame.id}`).innerHTML = String(frameTemplate.content.querySelector(`turbo-frame#${frame.id}`).innerHTML).trim();
          resolve();
        });
      }));
    }
    get debounce() {
      return this.hasAttribute("debounce") ? parseInt(this.getAttribute("debounce")) : 20;
    }
  };

  // node_modules/cable_ready/javascript/cable_ready.js
  var perform = (operations2, options = { emitMissingElementWarnings: true }) => {
    const batches = {};
    operations2.forEach((operation) => {
      if (!!operation.batch)
        batches[operation.batch] = batches[operation.batch] ? ++batches[operation.batch] : 1;
    });
    operations2.forEach((operation) => {
      const name = operation.operation;
      try {
        if (operation.selector) {
          operation.element = operation.xpath ? xpathToElement(operation.selector) : document[operation.selectAll ? "querySelectorAll" : "querySelector"](operation.selector);
        } else {
          operation.element = document;
        }
        if (operation.element || options.emitMissingElementWarnings) {
          active_element_default.set(document.activeElement);
          const cableReadyOperation = operation_store_default.all[name];
          if (cableReadyOperation) {
            cableReadyOperation(operation);
            if (!!operation.batch && --batches[operation.batch] === 0)
              dispatch2(document, "cable-ready:batch-complete", {
                batch: operation.batch
              });
          } else {
            console.error(`CableReady couldn't find the "${name}" operation. Make sure you use the camelized form when calling an operation method.`);
          }
        }
      } catch (e) {
        if (operation.element) {
          console.error(`CableReady detected an error in ${name}: ${e.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`);
          console.error(e);
        } else {
          console.warn(`CableReady ${name} failed due to missing DOM element for selector: '${operation.selector}'`);
        }
      }
    });
  };
  var performAsync = (operations2, options = { emitMissingElementWarnings: true }) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(perform(operations2, options));
      } catch (err) {
        reject(err);
      }
    });
  };
  var initialize = (initializeOptions = {}) => {
    const { consumer: consumer4 } = initializeOptions;
    action_cable_default.setConsumer(consumer4);
    if (!customElements.get("stream-from"))
      customElements.define("stream-from", StreamFromElement);
    if (!customElements.get("updates-for"))
      customElements.define("updates-for", UpdatesForElement);
  };
  var consumer2 = action_cable_default.getConsumer();

  // node_modules/cable_ready/javascript/index.js
  var javascript_default = {
    perform,
    performAsync,
    shouldMorphCallbacks,
    didMorphCallbacks,
    initialize,
    consumer: consumer2,
    addOperation,
    addOperations,
    version,
    get DOMOperations() {
      console.warn("DEPRECATED: Please use `CableReady.operations` instead of `CableReady.DOMOperations`");
      return operation_store_default.all;
    },
    get operations() {
      return operation_store_default.all;
    }
  };

  // node_modules/stimulus_reflex/javascript/schema.js
  var defaultSchema2 = {
    reflexAttribute: "data-reflex",
    reflexPermanentAttribute: "data-reflex-permanent",
    reflexRootAttribute: "data-reflex-root",
    reflexSuppressLoggingAttribute: "data-reflex-suppress-logging",
    reflexDatasetAttribute: "data-reflex-dataset",
    reflexDatasetAllAttribute: "data-reflex-dataset-all",
    reflexSerializeFormAttribute: "data-reflex-serialize-form",
    reflexFormSelectorAttribute: "data-reflex-form-selector",
    reflexIncludeInnerHtmlAttribute: "data-reflex-include-inner-html",
    reflexIncludeTextContentAttribute: "data-reflex-include-text-content"
  };
  var schema = {};
  var schema_default = {
    set(application2) {
      schema = { ...defaultSchema2, ...application2.schema };
      for (const attribute in schema)
        Object.defineProperty(this, attribute.slice(0, -9), {
          get: () => {
            return schema[attribute];
          }
        });
    }
  };

  // node_modules/stimulus_reflex/javascript/isolation_mode.js
  var isolationMode = false;
  var isolation_mode_default = {
    get disabled() {
      return !isolationMode;
    },
    set(value) {
      isolationMode = value;
    }
  };

  // node_modules/stimulus_reflex/javascript/deprecate.js
  var deprecationWarnings = true;
  var deprecate_default = {
    get enabled() {
      return deprecationWarnings;
    },
    get disabled() {
      return !deprecationWarnings;
    },
    get value() {
      return deprecationWarnings;
    },
    set(value) {
      deprecationWarnings = !!value;
    },
    set deprecate(value) {
      deprecationWarnings = !!value;
    }
  };

  // node_modules/stimulus_reflex/javascript/attributes.js
  var multipleInstances = (element) => {
    if (["checkbox", "radio"].includes(element.type)) {
      return document.querySelectorAll(`input[type="${element.type}"][name="${element.name}"]`).length > 1;
    }
    return false;
  };
  var collectCheckedOptions = (element) => {
    return Array.from(element.querySelectorAll("option:checked")).concat(Array.from(document.querySelectorAll(`input[type="${element.type}"][name="${element.name}"]`)).filter((elem) => elem.checked)).map((o) => o.value);
  };
  var attributeValue = (values = []) => {
    const value = values.filter((v) => v && String(v).length).map((v) => v.trim()).join(" ").trim();
    return value.length ? value : null;
  };
  var attributeValues = (value) => {
    if (!value)
      return [];
    if (!value.length)
      return [];
    return value.split(" ").filter((v) => v.trim().length);
  };
  var extractElementAttributes = (element) => {
    let attrs = Array.from(element.attributes).reduce((memo, attr) => {
      memo[attr.name] = attr.value;
      return memo;
    }, {});
    attrs.checked = !!element.checked;
    attrs.selected = !!element.selected;
    attrs.tag_name = element.tagName;
    if (element.tagName.match(/select/i) || multipleInstances(element)) {
      const collectedOptions = collectCheckedOptions(element);
      attrs.values = collectedOptions;
      attrs.value = collectedOptions.join(",");
    } else {
      attrs.value = element.value;
    }
    return attrs;
  };
  var getElementsFromTokens = (element, tokens) => {
    if (!tokens || tokens.length === 0)
      return [];
    let elements = [element];
    const xPath = elementToXPath(element);
    tokens.forEach((token) => {
      try {
        switch (token) {
          case "combined":
            if (deprecate_default.enabled)
              console.warn("In the next version of StimulusReflex, the 'combined' option to data-reflex-dataset will become 'ancestors'.");
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/ancestor::*`, true)
            ];
            break;
          case "ancestors":
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/ancestor::*`, true)
            ];
            break;
          case "parent":
            elements = [...elements, ...XPathToArray(`${xPath}/parent::*`)];
            break;
          case "siblings":
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/preceding-sibling::*|${xPath}/following-sibling::*`)
            ];
            break;
          case "children":
            elements = [...elements, ...XPathToArray(`${xPath}/child::*`)];
            break;
          case "descendants":
            elements = [...elements, ...XPathToArray(`${xPath}/descendant::*`)];
            break;
          default:
            elements = [...elements, ...document.querySelectorAll(token)];
        }
      } catch (error4) {
        if (debug_default.enabled)
          console.error(error4);
      }
    });
    return elements;
  };
  var extractElementDataset = (element) => {
    const dataset = element.attributes[schema_default.reflexDataset];
    const allDataset = element.attributes[schema_default.reflexDatasetAll];
    const tokens = dataset && dataset.value.split(" ") || [];
    const allTokens = allDataset && allDataset.value.split(" ") || [];
    const datasetElements = getElementsFromTokens(element, tokens);
    const datasetAllElements = getElementsFromTokens(element, allTokens);
    const datasetAttributes = datasetElements.reduce((acc, ele) => {
      return { ...extractDataAttributes(ele), ...acc };
    }, {});
    const reflexElementAttributes = extractDataAttributes(element);
    const elementDataset = {
      dataset: { ...reflexElementAttributes, ...datasetAttributes },
      datasetAll: {}
    };
    datasetAllElements.forEach((element2) => {
      const elementAttributes = extractDataAttributes(element2);
      Object.keys(elementAttributes).forEach((key) => {
        const value = elementAttributes[key];
        if (elementDataset.datasetAll[key] && Array.isArray(elementDataset.datasetAll[key])) {
          elementDataset.datasetAll[key].push(value);
        } else {
          elementDataset.datasetAll[key] = [value];
        }
      });
    });
    return elementDataset;
  };
  var extractDataAttributes = (element) => {
    let attrs = {};
    if (element && element.attributes) {
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          attrs[attr.name] = attr.value;
        }
      });
    }
    return attrs;
  };

  // node_modules/stimulus_reflex/javascript/controllers.js
  var localReflexControllers = (app, element) => {
    return attributeValues(element.getAttribute(schema_default.controller)).reduce((memo, name) => {
      const controller = app.getControllerForElementAndIdentifier(element, name);
      if (controller && controller.StimulusReflex)
        memo.push(controller);
      return memo;
    }, []);
  };
  var allReflexControllers = (app, element) => {
    let controllers = [];
    while (element) {
      controllers = controllers.concat(localReflexControllers(app, element));
      element = element.parentElement;
    }
    return controllers;
  };
  var findControllerByReflexName = (reflexName, controllers) => {
    const controller = controllers.find((controller2) => {
      if (!controller2.identifier)
        return;
      return extractReflexName(reflexName).replace(/([a-z0–9])([A-Z])/g, "$1-$2").replace(/(::)/g, "--").toLowerCase() === controller2.identifier;
    });
    return controller || controllers[0];
  };

  // node_modules/stimulus_reflex/javascript/reflexes.js
  var reflexes = {};
  var received = (data) => {
    if (!data.cableReady)
      return;
    let reflexOperations = [];
    for (let i = data.operations.length - 1; i >= 0; i--) {
      if (data.operations[i].stimulusReflex) {
        reflexOperations.push(data.operations[i]);
        data.operations.splice(i, 1);
      }
    }
    if (reflexOperations.some((operation) => {
      return operation.stimulusReflex.url !== location.href;
    }))
      return;
    let reflexData;
    if (reflexOperations.length) {
      reflexData = reflexOperations[0].stimulusReflex;
      reflexData.payload = reflexOperations[0].payload;
    }
    if (reflexData) {
      const { reflexId, payload } = reflexData;
      if (!reflexes[reflexId] && isolation_mode_default.disabled) {
        const controllerElement = XPathToElement(reflexData.xpathController);
        const reflexElement = XPathToElement(reflexData.xpathElement);
        controllerElement.reflexController = controllerElement.reflexController || {};
        controllerElement.reflexData = controllerElement.reflexData || {};
        controllerElement.reflexError = controllerElement.reflexError || {};
        controllerElement.reflexController[reflexId] = reflexes.app.getControllerForElementAndIdentifier(controllerElement, reflexData.reflexController);
        controllerElement.reflexData[reflexId] = reflexData;
        dispatchLifecycleEvent("before", reflexElement, controllerElement, reflexId, payload);
        registerReflex(reflexData);
      }
      if (reflexes[reflexId]) {
        reflexes[reflexId].totalOperations = reflexOperations.length;
        reflexes[reflexId].pendingOperations = reflexOperations.length;
        reflexes[reflexId].completedOperations = 0;
        reflexes[reflexId].piggybackOperations = data.operations;
        javascript_default.perform(reflexOperations);
      }
    } else {
      if (data.operations.length && reflexes[data.operations[0].reflexId])
        javascript_default.perform(data.operations);
    }
  };
  var registerReflex = (data) => {
    const { reflexId } = data;
    reflexes[reflexId] = { finalStage: "finalize" };
    const promise = new Promise((resolve, reject) => {
      reflexes[reflexId].promise = {
        resolve,
        reject,
        data
      };
    });
    promise.reflexId = reflexId;
    if (debug_default.enabled)
      promise.catch(() => {
      });
    return promise;
  };
  var getReflexRoots = (element) => {
    let list = [];
    while (list.length === 0 && element) {
      let reflexRoot = element.getAttribute(schema_default.reflexRoot);
      if (reflexRoot) {
        if (reflexRoot.length === 0 && element.id)
          reflexRoot = `#${element.id}`;
        const selectors = reflexRoot.split(",").filter((s) => s.trim().length);
        if (debug_default.enabled && selectors.length === 0) {
          console.error(`No value found for ${schema_default.reflexRoot}. Add an #id to the element or provide a value for ${schema_default.reflexRoot}.`, element);
        }
        list = list.concat(selectors.filter((s) => document.querySelector(s)));
      }
      element = element.parentElement ? element.parentElement.closest(`[${schema_default.reflexRoot}]`) : null;
    }
    return list;
  };
  var setupDeclarativeReflexes = debounce(() => {
    document.querySelectorAll(`[${schema_default.reflex}]`).forEach((element) => {
      const controllers = attributeValues(element.getAttribute(schema_default.controller));
      const reflexAttributeNames = attributeValues(element.getAttribute(schema_default.reflex));
      const actions = attributeValues(element.getAttribute(schema_default.action));
      reflexAttributeNames.forEach((reflexName) => {
        const controller = findControllerByReflexName(reflexName, allReflexControllers(reflexes.app, element));
        let action;
        if (controller) {
          action = `${reflexName.split("->")[0]}->${controller.identifier}#__perform`;
          if (!actions.includes(action))
            actions.push(action);
        } else {
          action = `${reflexName.split("->")[0]}->stimulus-reflex#__perform`;
          if (!controllers.includes("stimulus-reflex")) {
            controllers.push("stimulus-reflex");
          }
          if (!actions.includes(action))
            actions.push(action);
        }
      });
      const controllerValue = attributeValue(controllers);
      const actionValue = attributeValue(actions);
      if (controllerValue && element.getAttribute(schema_default.controller) != controllerValue) {
        element.setAttribute(schema_default.controller, controllerValue);
      }
      if (actionValue && element.getAttribute(schema_default.action) != actionValue)
        element.setAttribute(schema_default.action, actionValue);
    });
    emitEvent("stimulus-reflex:ready");
  }, 20);
  var reflexes_default = reflexes;

  // node_modules/stimulus_reflex/javascript/lifecycle.js
  var invokeLifecycleMethod = (stage, reflexElement, controllerElement, reflexId, payload) => {
    if (!controllerElement || !controllerElement.reflexData[reflexId])
      return;
    const controller = controllerElement.reflexController[reflexId];
    const reflex = controllerElement.reflexData[reflexId].target;
    const reflexMethodName = reflex.split("#")[1];
    const specificLifecycleMethodName = ["before", "after", "finalize"].includes(stage) ? `${stage}${camelize2(reflexMethodName)}` : `${camelize2(reflexMethodName, false)}${camelize2(stage)}`;
    const specificLifecycleMethod = controller[specificLifecycleMethodName];
    const genericLifecycleMethodName = ["before", "after", "finalize"].includes(stage) ? `${stage}Reflex` : `reflex${camelize2(stage)}`;
    const genericLifecycleMethod = controller[genericLifecycleMethodName];
    if (typeof specificLifecycleMethod === "function") {
      specificLifecycleMethod.call(controller, reflexElement, reflex, controllerElement.reflexError[reflexId], reflexId, payload);
    }
    if (typeof genericLifecycleMethod === "function") {
      genericLifecycleMethod.call(controller, reflexElement, reflex, controllerElement.reflexError[reflexId], reflexId, payload);
    }
    if (reflexes_default[reflexId] && stage === reflexes_default[reflexId].finalStage) {
      Reflect.deleteProperty(controllerElement.reflexController, reflexId);
      Reflect.deleteProperty(controllerElement.reflexData, reflexId);
      Reflect.deleteProperty(controllerElement.reflexError, reflexId);
    }
  };
  document.addEventListener("stimulus-reflex:before", (event) => invokeLifecycleMethod("before", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:success", (event) => {
    invokeLifecycleMethod("success", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
    dispatchLifecycleEvent("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:nothing", (event) => {
    dispatchLifecycleEvent("success", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:error", (event) => {
    invokeLifecycleMethod("error", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
    dispatchLifecycleEvent("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:halted", (event) => invokeLifecycleMethod("halted", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:after", (event) => invokeLifecycleMethod("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:finalize", (event) => invokeLifecycleMethod("finalize", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  var dispatchLifecycleEvent = (stage, reflexElement, controllerElement, reflexId, payload) => {
    if (!controllerElement) {
      if (debug_default.enabled && !reflexes_default[reflexId].warned) {
        console.warn(`StimulusReflex was not able execute callbacks or emit events for "${stage}" or later life-cycle stages for this Reflex. The StimulusReflex Controller Element is no longer present in the DOM. Could you move the StimulusReflex Controller to an element higher in your DOM?`);
        reflexes_default[reflexId].warned = true;
      }
      return;
    }
    if (!controllerElement.reflexController || controllerElement.reflexController && !controllerElement.reflexController[reflexId]) {
      if (debug_default.enabled && !reflexes_default[reflexId].warned) {
        console.warn(`StimulusReflex detected that the StimulusReflex Controller responsible for this Reflex has been replaced with a new instance. Callbacks and events for "${stage}" or later life-cycle stages cannot be executed.`);
        reflexes_default[reflexId].warned = true;
      }
      return;
    }
    const { target } = controllerElement.reflexData[reflexId] || {};
    const controller = controllerElement.reflexController[reflexId] || {};
    const event = `stimulus-reflex:${stage}`;
    const action = `${event}:${target.split("#")[1]}`;
    const detail = {
      reflex: target,
      controller,
      reflexId,
      element: reflexElement,
      payload
    };
    const options = { bubbles: true, cancelable: false, detail };
    controllerElement.dispatchEvent(new CustomEvent(event, options));
    controllerElement.dispatchEvent(new CustomEvent(action, options));
    if (window.jQuery) {
      window.jQuery(controllerElement).trigger(event, detail);
      window.jQuery(controllerElement).trigger(action, detail);
    }
  };

  // node_modules/stimulus_reflex/javascript/log.js
  var request = (reflexId, target, args, controller, element, controllerElement) => {
    const reflex = reflexes_default[reflexId];
    if (debug_default.disabled || reflex.promise.data.suppressLogging)
      return;
    reflex.timestamp = new Date();
    console.log(`\u2191 stimulus \u2191 ${target}`, {
      reflexId,
      args,
      controller,
      element,
      controllerElement
    });
  };
  var success = (event, halted2) => {
    const { detail } = event || {};
    const { selector, payload } = detail || {};
    const { reflexId, target, morph } = detail.stimulusReflex || {};
    const reflex = reflexes_default[reflexId];
    if (debug_default.disabled || reflex.promise.data.suppressLogging)
      return;
    const progress = reflex.totalOperations > 1 ? ` ${reflex.completedOperations}/${reflex.totalOperations}` : "";
    const duration = reflex.timestamp ? `in ${new Date() - reflex.timestamp}ms` : "CLONED";
    const operation = event.type.split(":")[1].split("-").slice(1).join("_");
    console.log(`\u2193 reflex \u2193 ${target} \u2192 ${selector || "\u221E"}${progress} ${duration}`, { reflexId, morph, operation, halted: halted2, payload });
  };
  var error2 = (event) => {
    const { detail } = event || {};
    const { reflexId, target, payload } = detail.stimulusReflex || {};
    const reflex = reflexes_default[reflexId];
    if (debug_default.disabled || reflex.promise.data.suppressLogging)
      return;
    const duration = reflex.timestamp ? `in ${new Date() - reflex.timestamp}ms` : "CLONED";
    console.log(`\u2193 reflex \u2193 ${target} ${duration} %cERROR: ${event.detail.body}`, "color: #f00;", { reflexId, payload });
  };
  var log_default = { request, success, error: error2 };

  // node_modules/stimulus_reflex/javascript/callbacks.js
  var beforeDOMUpdate = (event) => {
    const { stimulusReflex, payload } = event.detail || {};
    if (!stimulusReflex)
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const controllerElement = XPathToElement(xpathController);
    const reflexElement = XPathToElement(xpathElement);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    reflex.pendingOperations--;
    if (reflex.pendingOperations > 0)
      return;
    if (!stimulusReflex.resolveLate)
      setTimeout(() => promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload,
        reflexId,
        toString: () => ""
      }));
    setTimeout(() => dispatchLifecycleEvent("success", reflexElement, controllerElement, reflexId, payload));
  };
  var afterDOMUpdate = (event) => {
    const { stimulusReflex, payload } = event.detail || {};
    if (!stimulusReflex)
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const controllerElement = XPathToElement(xpathController);
    const reflexElement = XPathToElement(xpathElement);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    reflex.completedOperations++;
    log_default.success(event, false);
    if (reflex.completedOperations < reflex.totalOperations)
      return;
    if (stimulusReflex.resolveLate)
      setTimeout(() => promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload,
        reflexId,
        toString: () => ""
      }));
    setTimeout(() => dispatchLifecycleEvent("finalize", reflexElement, controllerElement, reflexId, payload));
    if (reflex.piggybackOperations.length)
      javascript_default.perform(reflex.piggybackOperations);
  };
  var routeReflexEvent = (event) => {
    const { stimulusReflex, payload, name, body } = event.detail || {};
    const eventType = name.split("-")[2];
    if (!stimulusReflex || !["nothing", "halted", "error"].includes(eventType))
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const reflexElement = XPathToElement(xpathElement);
    const controllerElement = XPathToElement(xpathController);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    if (controllerElement) {
      controllerElement.reflexError = controllerElement.reflexError || {};
      if (eventType === "error")
        controllerElement.reflexError[reflexId] = body;
    }
    switch (eventType) {
      case "nothing":
        nothing(event, payload, promise, reflex, reflexElement);
        break;
      case "error":
        error3(event, payload, promise, reflex, reflexElement);
        break;
      case "halted":
        halted(event, payload, promise, reflex, reflexElement);
        break;
    }
    setTimeout(() => dispatchLifecycleEvent(eventType, reflexElement, controllerElement, reflexId, payload));
    if (reflex.piggybackOperations.length)
      javascript_default.perform(reflex.piggybackOperations);
  };
  var nothing = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "after";
    log_default.success(event, false);
    setTimeout(() => promise.resolve({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      toString: () => ""
    }));
  };
  var halted = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "halted";
    log_default.success(event, true);
    setTimeout(() => promise.resolve({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      toString: () => ""
    }));
  };
  var error3 = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "after";
    log_default.error(event);
    setTimeout(() => promise.reject({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      error: event.detail.body,
      toString: () => event.detail.body
    }));
  };

  // node_modules/stimulus_reflex/javascript/reflex_data.js
  var ReflexData = class {
    constructor(options, reflexElement, controllerElement, reflexController, permanentAttributeName, target, args, url2, tabId2) {
      this.options = options;
      this.reflexElement = reflexElement;
      this.controllerElement = controllerElement;
      this.reflexController = reflexController;
      this.permanentAttributeName = permanentAttributeName;
      this.target = target;
      this.args = args;
      this.url = url2;
      this.tabId = tabId2;
    }
    get attrs() {
      this._attrs = this._attrs || this.options["attrs"] || extractElementAttributes(this.reflexElement);
      return this._attrs;
    }
    get reflexId() {
      this._reflexId = this._reflexId || this.options["reflexId"] || uuidv4();
      return this._reflexId;
    }
    get selectors() {
      this._selectors = this._selectors || this.options["selectors"] || getReflexRoots(this.reflexElement);
      return typeof this._selectors === "string" ? [this._selectors] : this._selectors;
    }
    get resolveLate() {
      return this.options["resolveLate"] || false;
    }
    get dataset() {
      this._dataset = this._dataset || extractElementDataset(this.reflexElement);
      return this._dataset;
    }
    get innerHTML() {
      return this.includeInnerHtml ? this.reflexElement.innerHTML : "";
    }
    get textContent() {
      return this.includeTextContent ? this.reflexElement.textContent : "";
    }
    get xpathController() {
      return elementToXPath(this.controllerElement);
    }
    get xpathElement() {
      return elementToXPath(this.reflexElement);
    }
    get formSelector() {
      const attr = this.reflexElement.attributes[schema_default.reflexFormSelector] ? this.reflexElement.attributes[schema_default.reflexFormSelector].value : void 0;
      return this.options["formSelector"] || attr;
    }
    get includeInnerHtml() {
      const attr = this.reflexElement.attributes[schema_default.reflexIncludeInnerHtml] || false;
      return this.options["includeInnerHTML"] || attr ? attr.value !== "false" : false;
    }
    get includeTextContent() {
      const attr = this.reflexElement.attributes[schema_default.reflexIncludeTextContent] || false;
      return this.options["includeTextContent"] || attr ? attr.value !== "false" : false;
    }
    get suppressLogging() {
      return this.options["suppressLogging"] || this.reflexElement.attributes[schema_default.reflexSuppressLogging] || false;
    }
    valueOf() {
      return {
        attrs: this.attrs,
        dataset: this.dataset,
        selectors: this.selectors,
        reflexId: this.reflexId,
        resolveLate: this.resolveLate,
        suppressLogging: this.suppressLogging,
        xpathController: this.xpathController,
        xpathElement: this.xpathElement,
        inner_html: this.innerHTML,
        text_content: this.textContent,
        formSelector: this.formSelector,
        reflexController: this.reflexController,
        permanentAttributeName: this.permanentAttributeName,
        target: this.target,
        args: this.args,
        url: this.url,
        tabId: this.tabId
      };
    }
  };

  // node_modules/stimulus_reflex/javascript/transports/action_cable.js
  var import_actioncable = __toESM(require_action_cable());
  var consumer3;
  var params;
  var subscriptionActive;
  var createSubscription = (controller) => {
    consumer3 = consumer3 || controller.application.consumer || (0, import_actioncable.createConsumer)();
    const { channel } = controller.StimulusReflex;
    const subscription = { channel, ...params };
    const identifier = JSON.stringify(subscription);
    controller.StimulusReflex.subscription = consumer3.subscriptions.findAll(identifier)[0] || consumer3.subscriptions.create(subscription, {
      received,
      connected,
      rejected,
      disconnected
    });
  };
  var connected = () => {
    subscriptionActive = true;
    document.body.classList.replace("stimulus-reflex-disconnected", "stimulus-reflex-connected");
    emitEvent("stimulus-reflex:connected");
    emitEvent("stimulus-reflex:action-cable:connected");
  };
  var rejected = () => {
    subscriptionActive = false;
    document.body.classList.replace("stimulus-reflex-connected", "stimulus-reflex-disconnected");
    emitEvent("stimulus-reflex:rejected");
    emitEvent("stimulus-reflex:action-cable:rejected");
    if (Debug.enabled)
      console.warn("Channel subscription was rejected.");
  };
  var disconnected = (willAttemptReconnect) => {
    subscriptionActive = false;
    document.body.classList.replace("stimulus-reflex-connected", "stimulus-reflex-disconnected");
    emitEvent("stimulus-reflex:disconnected", willAttemptReconnect);
    emitEvent("stimulus-reflex:action-cable:disconnected", willAttemptReconnect);
  };
  var action_cable_default2 = {
    consumer: consumer3,
    params,
    get subscriptionActive() {
      return subscriptionActive;
    },
    createSubscription,
    connected,
    rejected,
    disconnected,
    set(consumerValue, paramsValue) {
      consumer3 = consumerValue;
      params = paramsValue;
    }
  };

  // node_modules/stimulus_reflex/javascript/stimulus_reflex.js
  var StimulusReflexController = class extends Controller {
    constructor(...args) {
      super(...args);
      register(this);
    }
  };
  var initialize2 = (application2, { controller, consumer: consumer4, debug, params: params2, isolate, deprecate } = {}) => {
    action_cable_default2.set(consumer4, params2);
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.remove("stimulus-reflex-connected");
      document.body.classList.add("stimulus-reflex-disconnected");
      if (deprecate_default.enabled && consumer4)
        console.warn("Deprecation warning: the next version of StimulusReflex will obtain a reference to consumer via the Stimulus application object.\nPlease add 'application.consumer = consumer' to your index.js after your Stimulus application has been established, and remove the consumer key from your StimulusReflex initialize() options object.");
      if (deprecate_default.enabled && isolation_mode_default.disabled)
        console.warn("Deprecation warning: the next version of StimulusReflex will standardize isolation mode, and the isolate option will be removed.\nPlease update your applications to assume that every tab will be isolated.");
    }, { once: true });
    isolation_mode_default.set(!!isolate);
    reflexes_default.app = application2;
    schema_default.set(application2);
    reflexes_default.app.register("stimulus-reflex", controller || StimulusReflexController);
    debug_default.set(!!debug);
    if (typeof deprecate !== "undefined")
      deprecate_default.set(deprecate);
    const observer = new MutationObserver(setupDeclarativeReflexes);
    observer.observe(document.documentElement, {
      attributeFilter: [schema_default.reflex, schema_default.action],
      childList: true,
      subtree: true
    });
  };
  var register = (controller, options = {}) => {
    const channel = "StimulusReflex::Channel";
    controller.StimulusReflex = { ...options, channel };
    action_cable_default2.createSubscription(controller);
    Object.assign(controller, {
      isActionCableConnectionOpen() {
        return this.StimulusReflex.subscription.consumer.connection.isOpen();
      },
      stimulate() {
        const url2 = location.href;
        const args = Array.from(arguments);
        const target = args.shift() || "StimulusReflex::Reflex#default_reflex";
        const controllerElement = this.element;
        const reflexElement = args[0] && args[0].nodeType === Node.ELEMENT_NODE ? args.shift() : controllerElement;
        if (reflexElement.type === "number" && reflexElement.validity && reflexElement.validity.badInput) {
          if (debug_default.enabled)
            console.warn("Reflex aborted: invalid numeric input");
          return;
        }
        const options2 = {};
        if (args[0] && typeof args[0] === "object" && Object.keys(args[0]).filter((key) => [
          "attrs",
          "selectors",
          "reflexId",
          "resolveLate",
          "serializeForm",
          "suppressLogging",
          "includeInnerHTML",
          "includeTextContent"
        ].includes(key)).length) {
          const opts = args.shift();
          Object.keys(opts).forEach((o) => options2[o] = opts[o]);
        }
        const reflexData = new ReflexData(options2, reflexElement, controllerElement, this.identifier, schema_default.reflexPermanent, target, args, url2, tabId);
        const reflexId = reflexData.reflexId;
        if (!this.isActionCableConnectionOpen())
          throw "The ActionCable connection is not open! `this.isActionCableConnectionOpen()` must return true before calling `this.stimulate()`";
        if (!action_cable_default2.subscriptionActive)
          throw "The ActionCable channel subscription for StimulusReflex was rejected.";
        controllerElement.reflexController = controllerElement.reflexController || {};
        controllerElement.reflexData = controllerElement.reflexData || {};
        controllerElement.reflexError = controllerElement.reflexError || {};
        controllerElement.reflexController[reflexId] = this;
        controllerElement.reflexData[reflexId] = reflexData.valueOf();
        dispatchLifecycleEvent("before", reflexElement, controllerElement, reflexId);
        setTimeout(() => {
          const { params: params2 } = controllerElement.reflexData[reflexId] || {};
          const check = reflexElement.attributes[schema_default.reflexSerializeForm];
          if (check) {
            options2["serializeForm"] = check.value !== "false";
          }
          const form = reflexElement.closest(reflexData.formSelector) || document.querySelector(reflexData.formSelector) || reflexElement.closest("form");
          if (deprecate_default.enabled && options2["serializeForm"] === void 0 && form)
            console.warn(`Deprecation warning: the next version of StimulusReflex will not serialize forms by default.
Please set ${schema_default.reflexSerializeForm}="true" on your Reflex Controller Element or pass { serializeForm: true } as an option to stimulate.`);
          const formData = options2["serializeForm"] === false ? "" : serializeForm(form, {
            element: reflexElement
          });
          controllerElement.reflexData[reflexId] = {
            ...reflexData.valueOf(),
            params: params2,
            formData
          };
          this.StimulusReflex.subscription.send(controllerElement.reflexData[reflexId]);
        });
        const promise = registerReflex(reflexData.valueOf());
        log_default.request(reflexId, target, args, this.context.scope.identifier, reflexElement, controllerElement);
        return promise;
      },
      __perform(event) {
        let element = event.target;
        let reflex;
        while (element && !reflex) {
          reflex = element.getAttribute(schema_default.reflex);
          if (!reflex || !reflex.trim().length)
            element = element.parentElement;
        }
        const match = attributeValues(reflex).find((reflex2) => reflex2.split("->")[0] === event.type);
        if (match) {
          event.preventDefault();
          event.stopPropagation();
          this.stimulate(match.split("->")[1], element);
        }
      }
    });
  };
  var tabId = uuidv4();
  var useReflex = (controller, options = {}) => {
    register(controller, options);
  };
  document.addEventListener("cable-ready:after-dispatch-event", routeReflexEvent);
  document.addEventListener("cable-ready:before-inner-html", beforeDOMUpdate);
  document.addEventListener("cable-ready:before-morph", beforeDOMUpdate);
  document.addEventListener("cable-ready:after-inner-html", afterDOMUpdate);
  document.addEventListener("cable-ready:after-morph", afterDOMUpdate);
  window.addEventListener("load", setupDeclarativeReflexes);
  var stimulus_reflex_default = {
    initialize: initialize2,
    register,
    useReflex,
    get debug() {
      return debug_default.value;
    },
    set debug(value) {
      debug_default.set(!!value);
    },
    get deprecate() {
      return deprecate_default.value;
    },
    set deprecate(value) {
      deprecate_default.set(!!value);
    }
  };

  // app/javascript/controllers/application_controller.js
  var application_controller_default = class extends Controller {
    connect() {
      stimulus_reflex_default.register(this);
    }
    beforeReflex(element, reflex, noop2, reflexId) {
    }
    reflexSuccess(element, reflex, noop2, reflexId) {
    }
    reflexError(element, reflex, error4, reflexId) {
    }
    reflexHalted(element, reflex, error4, reflexId) {
    }
    afterReflex(element, reflex, noop2, reflexId) {
    }
    finalizeReflex(element, reflex, noop2, reflexId) {
    }
  };

  // app/javascript/controllers/dropdown_controller.js
  var dropdown_controller_default = class extends Controller {
    connect() {
      this.toggleClass = this.data.get("class") || "hidden";
      this.visibleClass = this.data.get("visibleClass") || null;
      this.invisibleClass = this.data.get("invisibleClass") || null;
      this.activeClass = this.data.get("activeClass") || null;
      this.enteringClass = this.data.get("enteringClass") || null;
      this.leavingClass = this.data.get("leavingClass") || null;
      if (this.hasButtonTarget) {
        this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown);
      }
      this.element.setAttribute("aria-haspopup", "true");
    }
    disconnect() {
      if (this.hasButtonTarget) {
        this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown);
      }
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    openValueChanged() {
      if (this.openValue) {
        this._show();
      } else {
        this._hide();
      }
    }
    _show(cb) {
      setTimeout((() => {
        this.menuTarget.classList.remove(this.toggleClass);
        this.element.setAttribute("aria-expanded", "true");
        this._enteringClassList[0].forEach(((klass) => {
          this.menuTarget.classList.add(klass);
        }).bind(this));
        this._activeClassList[0].forEach((klass) => {
          this.activeTarget.classList.add(klass);
        });
        this._invisibleClassList[0].forEach((klass) => this.menuTarget.classList.remove(klass));
        this._visibleClassList[0].forEach((klass) => {
          this.menuTarget.classList.add(klass);
        });
        setTimeout((() => {
          this._enteringClassList[0].forEach((klass) => this.menuTarget.classList.remove(klass));
        }).bind(this), this.enterTimeout[0]);
        if (typeof cb == "function")
          cb();
      }).bind(this));
    }
    _hide(cb) {
      setTimeout((() => {
        this.element.setAttribute("aria-expanded", "false");
        this._invisibleClassList[0].forEach((klass) => this.menuTarget.classList.add(klass));
        this._visibleClassList[0].forEach((klass) => this.menuTarget.classList.remove(klass));
        this._activeClassList[0].forEach((klass) => this.activeTarget.classList.remove(klass));
        this._leavingClassList[0].forEach((klass) => this.menuTarget.classList.add(klass));
        setTimeout((() => {
          this._leavingClassList[0].forEach((klass) => this.menuTarget.classList.remove(klass));
          if (typeof cb == "function")
            cb();
          this.menuTarget.classList.add(this.toggleClass);
        }).bind(this), this.leaveTimeout[0]);
      }).bind(this));
    }
    _onMenuButtonKeydown = (event) => {
      switch (event.keyCode) {
        case 13:
        case 32:
          event.preventDefault();
          this.toggle();
      }
    };
    show() {
      this.openValue = true;
    }
    hide(event) {
      if (this.element.contains(event.target) === false && this.openValue) {
        this.openValue = false;
      }
    }
    get activeTarget() {
      return this.data.has("activeTarget") ? document.querySelector(this.data.get("activeTarget")) : this.element;
    }
    get _activeClassList() {
      return !this.activeClass ? [
        [],
        []
      ] : this.activeClass.split(",").map((classList) => classList.split(" "));
    }
    get _visibleClassList() {
      return !this.visibleClass ? [
        [],
        []
      ] : this.visibleClass.split(",").map((classList) => classList.split(" "));
    }
    get _invisibleClassList() {
      return !this.invisibleClass ? [
        [],
        []
      ] : this.invisibleClass.split(",").map((classList) => classList.split(" "));
    }
    get _enteringClassList() {
      return !this.enteringClass ? [
        [],
        []
      ] : this.enteringClass.split(",").map((classList) => classList.split(" "));
    }
    get _leavingClassList() {
      return !this.leavingClass ? [
        [],
        []
      ] : this.leavingClass.split(",").map((classList) => classList.split(" "));
    }
    get enterTimeout() {
      let timeout = this.data.get("enterTimeout") || "0,0";
      return timeout.split(",").map((t) => parseInt(t));
    }
    get leaveTimeout() {
      let timeout = this.data.get("leaveTimeout") || "0,0";
      return timeout.split(",").map((t) => parseInt(t));
    }
  };
  __publicField(dropdown_controller_default, "targets", ["menu", "button"]);
  __publicField(dropdown_controller_default, "values", { open: Boolean });

  // app/javascript/controllers/infinite_scroll_controller.js
  var infinite_scroll_controller_default = class extends Controller {
    initialize() {
      let options = {
        rootMargin: "200px"
      };
      this.intersectionObserver = new IntersectionObserver((entries) => this.processIntersectionEntries(entries), options);
    }
    connect() {
      this.intersectionObserver.observe(this.paginationTarget);
    }
    disconnect() {
      this.intersectionObserver.unobserve(this.paginationTarget);
    }
    processIntersectionEntries(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMore();
        }
      });
    }
    loadMore() {
      let next_page = this.paginationTarget.querySelector("a[rel='next']");
      if (next_page == null) {
        return;
      }
      let url2 = next_page.href;
      fetch(url2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }).then((response) => response.json()).then((data) => {
        this.entriesTarget.insertAdjacentHTML("beforeend", data.entries);
        this.paginationTarget.innerHTML = data.pagination;
      }).catch((error4) => {
        console.log("error:", error4);
      });
    }
  };
  __publicField(infinite_scroll_controller_default, "targets", ["entries", "pagination"]);

  // app/javascript/controllers/modal_controller.js
  var modal_controller_default = class extends Controller {
    close() {
      this.element.remove();
    }
    escClose(event) {
      if (event.key === "Escape")
        this.close();
    }
  };

  // app/javascript/controllers/nav_search_controller.js
  var nav_search_controller_default = class extends Controller {
    connect() {
      this.resultsTarget.hidden = true;
      this.inputTarget.setAttribute("autocomplete", "off");
      this.inputTarget.setAttribute("spellcheck", "false");
      this.mouseDown = false;
      this.onInputChange = this.onInputChange.bind(this);
      this.onResultsClick = this.onResultsClick.bind(this);
      this.onResultsMouseDown = this.onResultsMouseDown.bind(this);
      this.onInputBlur = this.onInputBlur.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
      this.inputTarget.addEventListener("keydown", this.onKeydown);
      this.inputTarget.addEventListener("blur", this.onInputBlur);
      this.inputTarget.addEventListener("input", this.onInputChange);
      this.resultsTarget.addEventListener("mousedown", this.onResultsMouseDown);
      this.resultsTarget.addEventListener("click", this.onResultsClick);
      if (typeof this.inputTarget.getAttribute("autofocus") === "string") {
        this.inputTarget.focus();
      }
      let element = document.querySelector("meta[name='current-account']");
      if (element == null)
        return;
      this.current_account = element.getAttribute("content");
    }
    disconnect() {
      if (this.hasInputTarget) {
        this.inputTarget.removeEventListener("keydown", this.onKeydown);
        this.inputTarget.removeEventListener("focus", this.onInputFocus);
        this.inputTarget.removeEventListener("blur", this.onInputBlur);
        this.inputTarget.removeEventListener("input", this.onInputChange);
      }
      if (this.hasResultsTarget) {
        this.resultsTarget.removeEventListener("mousedown", this.onResultsMouseDown);
        this.resultsTarget.removeEventListener("click", this.onResultsClick);
      }
    }
    sibling(next) {
      const options = Array.from(this.resultsTarget.querySelectorAll('[role="option"]:not([aria-disabled])'));
      const selected = this.resultsTarget.querySelector('[aria-selected="true"]');
      const index = options.indexOf(selected);
      const sibling = next ? options[index + 1] : options[index - 1];
      const def = next ? options[0] : options[options.length - 1];
      return sibling || def;
    }
    select(target) {
      for (const el of this.resultsTarget.querySelectorAll('[aria-selected="true"]')) {
        el.removeAttribute("aria-selected");
        el.classList.remove("bg-gray-100");
      }
      target.setAttribute("aria-selected", "true");
      target.classList.add("bg-gray-100");
      this.inputTarget.setAttribute("aria-activedescendant", target.id);
      target.scrollIntoView(false);
    }
    onKeydown(event) {
      switch (event.key) {
        case "Escape":
          if (!this.resultsTarget.hidden) {
            this.hideAndRemoveOptions();
            event.stopPropagation();
            event.preventDefault();
          }
          break;
        case "ArrowDown":
          {
            const item = this.sibling(true);
            if (item)
              this.select(item);
            event.preventDefault();
          }
          break;
        case "ArrowUp":
          {
            const item = this.sibling(false);
            if (item)
              this.select(item);
            event.preventDefault();
          }
          break;
        case "Tab":
          {
            const selected = this.resultsTarget.querySelector('[aria-selected="true"]');
            if (selected) {
              this.commit(selected);
            }
          }
          break;
        case "Enter":
          {
            const selected = this.resultsTarget.querySelector('[aria-selected="true"]');
            if (selected && !this.resultsTarget.hidden) {
              this.click(selected);
              if (!this.hasSubmitOnEnterValue) {
                event.preventDefault();
              }
            }
          }
          break;
      }
    }
    onInputBlur() {
      if (this.mouseDown)
        return;
      this.resultsTarget.hidden = true;
    }
    commit(selected) {
      if (selected.getAttribute("aria-disabled") === "true")
        return;
      if (selected.parentElement instanceof HTMLAnchorElement) {
        selected.click();
        this.resultsTarget.hidden = true;
        return;
      }
      const textValue = this.extractTextValue(selected);
      const value = selected.getAttribute("data-autocomplete-value") || textValue;
      this.inputTarget.value = textValue;
      if (this.hasHiddenTarget) {
        this.hiddenTarget.value = value;
        this.hiddenTarget.dispatchEvent(new Event("input"));
        this.hiddenTarget.dispatchEvent(new Event("change"));
      } else {
        this.inputTarget.value = value;
      }
      this.inputTarget.focus();
      this.hideAndRemoveOptions();
      this.element.dispatchEvent(new CustomEvent("autocomplete.change", {
        bubbles: true,
        detail: { value, textValue }
      }));
    }
    click(selected) {
      if (selected.getAttribute("aria-disabled") === "true")
        return;
      selected.click();
      this.resultsTarget.hidden = true;
      this.hideAndRemoveOptions();
    }
    onResultsClick(event) {
      if (!(event.target instanceof Element))
        return;
      const selected = event.target.closest('[role="option"]');
      if (selected)
        this.commit(selected);
    }
    onResultsMouseDown() {
      this.mouseDown = true;
      this.resultsTarget.addEventListener("mouseup", () => this.mouseDown = false, { once: true });
    }
    onInputChange() {
      this.element.removeAttribute("value");
      this.fetchResults();
    }
    identifyOptions() {
      let id2 = 0;
      for (const el of this.resultsTarget.querySelectorAll('[role="option"]:not([id])')) {
        el.id = `${this.resultsTarget.id}-option-${id2++}`;
      }
    }
    hideAndRemoveOptions() {
      this.resultsTarget.hidden = true;
      this.resultsTarget.innerHTML = null;
    }
    fetchResults() {
      const query = this.inputTarget.value.trim();
      if (!query || query.length < this.minLengthValue) {
        this.hideAndRemoveOptions();
        return;
      }
      if (!this.hasUrlValue)
        return;
      const headers = { "X-Requested-With": "XMLHttpRequest" };
      const url2 = new URL("/" + this.urlValue, window.location.href);
      const params2 = new URLSearchParams(url2.search.slice(1));
      params2.append("q", query);
      url2.search = params2.toString();
      this.element.dispatchEvent(new CustomEvent("loadstart"));
      fetch(url2.toString(), { headers }).then((response) => response.text()).then((html) => {
        this.resultsTarget.innerHTML = html;
        this.identifyOptions();
        const hasResults = !!this.resultsTarget.querySelector('[role="option"]');
        this.resultsTarget.hidden = !hasResults;
        this.element.dispatchEvent(new CustomEvent("load"));
        this.element.dispatchEvent(new CustomEvent("loadend"));
      }).catch(() => {
        this.element.dispatchEvent(new CustomEvent("error"));
        this.element.dispatchEvent(new CustomEvent("loadend"));
      });
    }
    open() {
      if (!this.resultsTarget.hidden)
        return;
      this.resultsTarget.hidden = false;
      this.element.setAttribute("aria-expanded", "true");
      this.element.dispatchEvent(new CustomEvent("toggle", {
        detail: { input: this.input, results: this.results }
      }));
    }
    close() {
      if (this.resultsTarget.hidden)
        return;
      this.resultsTarget.hidden = true;
      this.inputTarget.removeAttribute("aria-activedescendant");
      this.element.setAttribute("aria-expanded", "false");
      this.element.dispatchEvent(new CustomEvent("toggle", {
        detail: { input: this.input, results: this.results }
      }));
    }
    extractTextValue = (el) => el.hasAttribute("data-autocomplete-label") ? el.getAttribute("data-autocomplete-label") : el.textContent.trim();
  };
  __publicField(nav_search_controller_default, "targets", ["input", "hidden", "results"]);
  __publicField(nav_search_controller_default, "values", {
    submitOnEnter: Boolean,
    url: String,
    minLength: Number
  });

  // app/javascript/controllers/confirmation_controller.js
  var confirmation_controller_default = class extends Controller {
    confirm(event) {
      if (!window.confirm(this.messageValue)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  };
  __publicField(confirmation_controller_default, "values", { message: String });

  // app/javascript/channels/consumer.js
  var import_actioncable2 = __toESM(require_action_cable());
  var consumer_default = (0, import_actioncable2.createConsumer)();

  // app/javascript/controllers/index.js
  application.register("application", application_controller_default);
  application.register("dropdown", dropdown_controller_default);
  application.register("infinite-scroll", infinite_scroll_controller_default);
  application.register("modal", modal_controller_default);
  application.register("nav-search", nav_search_controller_default);
  application.register("confirmation", confirmation_controller_default);
  application.consumer = consumer_default;
  stimulus_reflex_default.initialize(application, { controller: application_controller_default, isolate: true });
  javascript_default.initialize({ consumer: consumer_default });
  application.consumer = consumer_default;
  application.consumer = consumer_default;
  application.consumer = consumer_default;

  // app/javascript/application.js
  var import_trix = __toESM(require_trix());

  // node_modules/@rails/activestorage/app/assets/javascripts/activestorage.esm.js
  var sparkMd5 = {
    exports: {}
  };
  (function(module, exports) {
    (function(factory) {
      {
        module.exports = factory();
      }
    })(function(undefined$1) {
      var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
      }
      function md5blk_array(a) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
      }
      function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function md51_array(a) {
        var n = a.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
        for (i = 64; i <= n; i += 64) {
          md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }
        a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= a[i] << (i % 4 << 3);
        }
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(state, tail);
        return state;
      }
      function rhex(n) {
        var s = "", j;
        for (j = 0; j < 4; j += 1) {
          s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        }
        return s;
      }
      function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
          x[i] = rhex(x[i]);
        }
        return x.join("");
      }
      if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592")
        ;
      if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
        (function() {
          function clamp(val, length) {
            val = val | 0 || 0;
            if (val < 0) {
              return Math.max(val + length, 0);
            }
            return Math.min(val, length);
          }
          ArrayBuffer.prototype.slice = function(from, to) {
            var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
            if (to !== undefined$1) {
              end = clamp(to, length);
            }
            if (begin > end) {
              return new ArrayBuffer(0);
            }
            num = end - begin;
            target = new ArrayBuffer(num);
            targetArray = new Uint8Array(target);
            sourceArray = new Uint8Array(this, begin, num);
            targetArray.set(sourceArray);
            return target;
          };
        })();
      }
      function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
          str = unescape(encodeURIComponent(str));
        }
        return str;
      }
      function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
        for (i = 0; i < length; i += 1) {
          arr[i] = str.charCodeAt(i);
        }
        return returnUInt8Array ? arr : buff;
      }
      function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
      }
      function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);
        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);
        return returnUInt8Array ? result : result.buffer;
      }
      function hexToBinaryString(hex2) {
        var bytes = [], length = hex2.length, x;
        for (x = 0; x < length - 1; x += 2) {
          bytes.push(parseInt(hex2.substr(x, 2), 16));
        }
        return String.fromCharCode.apply(String, bytes);
      }
      function SparkMD52() {
        this.reset();
      }
      SparkMD52.prototype.append = function(str) {
        this.appendBinary(toUtf8(str));
        return this;
      };
      SparkMD52.prototype.appendBinary = function(contents) {
        this._buff += contents;
        this._length += contents.length;
        var length = this._buff.length, i;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }
        this._buff = this._buff.substring(i - 64);
        return this;
      };
      SparkMD52.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, i, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD52.prototype.reset = function() {
        this._buff = "";
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD52.prototype.getState = function() {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice()
        };
      };
      SparkMD52.prototype.setState = function(state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;
        return this;
      };
      SparkMD52.prototype.destroy = function() {
        delete this._hash;
        delete this._buff;
        delete this._length;
      };
      SparkMD52.prototype._finish = function(tail, length) {
        var i = length, tmp, lo, hi;
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
          md5cycle(this._hash, tail);
          for (i = 0; i < 16; i += 1) {
            tail[i] = 0;
          }
        }
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;
        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
      };
      SparkMD52.hash = function(str, raw) {
        return SparkMD52.hashBinary(toUtf8(str), raw);
      };
      SparkMD52.hashBinary = function(content, raw) {
        var hash = md51(content), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      SparkMD52.ArrayBuffer = function() {
        this.reset();
      };
      SparkMD52.ArrayBuffer.prototype.append = function(arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
        this._length += arr.byteLength;
        for (i = 64; i <= length; i += 64) {
          md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }
        this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
        return this;
      };
      SparkMD52.ArrayBuffer.prototype.end = function(raw) {
        var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i, ret;
        for (i = 0; i < length; i += 1) {
          tail[i >> 2] |= buff[i] << (i % 4 << 3);
        }
        this._finish(tail, length);
        ret = hex(this._hash);
        if (raw) {
          ret = hexToBinaryString(ret);
        }
        this.reset();
        return ret;
      };
      SparkMD52.ArrayBuffer.prototype.reset = function() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
        return this;
      };
      SparkMD52.ArrayBuffer.prototype.getState = function() {
        var state = SparkMD52.prototype.getState.call(this);
        state.buff = arrayBuffer2Utf8Str(state.buff);
        return state;
      };
      SparkMD52.ArrayBuffer.prototype.setState = function(state) {
        state.buff = utf8Str2ArrayBuffer(state.buff, true);
        return SparkMD52.prototype.setState.call(this, state);
      };
      SparkMD52.ArrayBuffer.prototype.destroy = SparkMD52.prototype.destroy;
      SparkMD52.ArrayBuffer.prototype._finish = SparkMD52.prototype._finish;
      SparkMD52.ArrayBuffer.hash = function(arr, raw) {
        var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
        return raw ? hexToBinaryString(ret) : ret;
      };
      return SparkMD52;
    });
  })(sparkMd5);
  var SparkMD5 = sparkMd5.exports;
  var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var FileChecksum = class {
    static create(file, callback) {
      const instance = new FileChecksum(file);
      instance.create(callback);
    }
    constructor(file) {
      this.file = file;
      this.chunkSize = 2097152;
      this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
      this.chunkIndex = 0;
    }
    create(callback) {
      this.callback = callback;
      this.md5Buffer = new SparkMD5.ArrayBuffer();
      this.fileReader = new FileReader();
      this.fileReader.addEventListener("load", (event) => this.fileReaderDidLoad(event));
      this.fileReader.addEventListener("error", (event) => this.fileReaderDidError(event));
      this.readNextChunk();
    }
    fileReaderDidLoad(event) {
      this.md5Buffer.append(event.target.result);
      if (!this.readNextChunk()) {
        const binaryDigest = this.md5Buffer.end(true);
        const base64digest = btoa(binaryDigest);
        this.callback(null, base64digest);
      }
    }
    fileReaderDidError(event) {
      this.callback(`Error reading ${this.file.name}`);
    }
    readNextChunk() {
      if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
        const start3 = this.chunkIndex * this.chunkSize;
        const end = Math.min(start3 + this.chunkSize, this.file.size);
        const bytes = fileSlice.call(this.file, start3, end);
        this.fileReader.readAsArrayBuffer(bytes);
        this.chunkIndex++;
        return true;
      } else {
        return false;
      }
    }
  };
  function getMetaValue(name) {
    const element = findElement(document.head, `meta[name="${name}"]`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  function findElements(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    const elements = root.querySelectorAll(selector);
    return toArray(elements);
  }
  function findElement(root, selector) {
    if (typeof root == "string") {
      selector = root;
      root = document;
    }
    return root.querySelector(selector);
  }
  function dispatchEvent2(element, type, eventInit = {}) {
    const { disabled } = element;
    const { bubbles, cancelable, detail } = eventInit;
    const event = document.createEvent("Event");
    event.initEvent(type, bubbles || true, cancelable || true);
    event.detail = detail || {};
    try {
      element.disabled = false;
      element.dispatchEvent(event);
    } finally {
      element.disabled = disabled;
    }
    return event;
  }
  function toArray(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (Array.from) {
      return Array.from(value);
    } else {
      return [].slice.call(value);
    }
  }
  var BlobRecord = class {
    constructor(file, checksum, url2, directUploadToken, attachmentName) {
      this.file = file;
      this.attributes = {
        filename: file.name,
        content_type: file.type || "application/octet-stream",
        byte_size: file.size,
        checksum
      };
      this.directUploadToken = directUploadToken;
      this.attachmentName = attachmentName;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("POST", url2, true);
      this.xhr.responseType = "json";
      this.xhr.setRequestHeader("Content-Type", "application/json");
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      const csrfToken = getMetaValue("csrf-token");
      if (csrfToken != void 0) {
        this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
      }
      this.xhr.addEventListener("load", (event) => this.requestDidLoad(event));
      this.xhr.addEventListener("error", (event) => this.requestDidError(event));
    }
    get status() {
      return this.xhr.status;
    }
    get response() {
      const { responseType, response } = this.xhr;
      if (responseType == "json") {
        return response;
      } else {
        return JSON.parse(response);
      }
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(JSON.stringify({
        blob: this.attributes,
        direct_upload_token: this.directUploadToken,
        attachment_name: this.attachmentName
      }));
    }
    requestDidLoad(event) {
      if (this.status >= 200 && this.status < 300) {
        const { response } = this;
        const { direct_upload } = response;
        delete response.direct_upload;
        this.attributes = response;
        this.directUploadData = direct_upload;
        this.callback(null, this.toJSON());
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`);
    }
    toJSON() {
      const result = {};
      for (const key in this.attributes) {
        result[key] = this.attributes[key];
      }
      return result;
    }
  };
  var BlobUpload = class {
    constructor(blob) {
      this.blob = blob;
      this.file = blob.file;
      const { url: url2, headers } = blob.directUploadData;
      this.xhr = new XMLHttpRequest();
      this.xhr.open("PUT", url2, true);
      this.xhr.responseType = "text";
      for (const key in headers) {
        this.xhr.setRequestHeader(key, headers[key]);
      }
      this.xhr.addEventListener("load", (event) => this.requestDidLoad(event));
      this.xhr.addEventListener("error", (event) => this.requestDidError(event));
    }
    create(callback) {
      this.callback = callback;
      this.xhr.send(this.file.slice());
    }
    requestDidLoad(event) {
      const { status, response } = this.xhr;
      if (status >= 200 && status < 300) {
        this.callback(null, response);
      } else {
        this.requestDidError(event);
      }
    }
    requestDidError(event) {
      this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`);
    }
  };
  var id = 0;
  var DirectUpload = class {
    constructor(file, url2, serviceName, attachmentName, delegate) {
      this.id = ++id;
      this.file = file;
      this.url = url2;
      this.serviceName = serviceName;
      this.attachmentName = attachmentName;
      this.delegate = delegate;
    }
    create(callback) {
      FileChecksum.create(this.file, (error4, checksum) => {
        if (error4) {
          callback(error4);
          return;
        }
        const blob = new BlobRecord(this.file, checksum, this.url, this.serviceName, this.attachmentName);
        notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
        blob.create((error5) => {
          if (error5) {
            callback(error5);
          } else {
            const upload = new BlobUpload(blob);
            notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
            upload.create((error6) => {
              if (error6) {
                callback(error6);
              } else {
                callback(null, blob.toJSON());
              }
            });
          }
        });
      });
    }
  };
  function notify(object, methodName, ...messages) {
    if (object && typeof object[methodName] == "function") {
      return object[methodName](...messages);
    }
  }
  var DirectUploadController = class {
    constructor(input, file) {
      this.input = input;
      this.file = file;
      this.directUpload = new DirectUpload(this.file, this.url, this.directUploadToken, this.attachmentName, this);
      this.dispatch("initialize");
    }
    start(callback) {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = this.input.name;
      this.input.insertAdjacentElement("beforebegin", hiddenInput);
      this.dispatch("start");
      this.directUpload.create((error4, attributes) => {
        if (error4) {
          hiddenInput.parentNode.removeChild(hiddenInput);
          this.dispatchError(error4);
        } else {
          hiddenInput.value = attributes.signed_id;
        }
        this.dispatch("end");
        callback(error4);
      });
    }
    uploadRequestDidProgress(event) {
      const progress = event.loaded / event.total * 100;
      if (progress) {
        this.dispatch("progress", {
          progress
        });
      }
    }
    get url() {
      return this.input.getAttribute("data-direct-upload-url");
    }
    get directUploadToken() {
      return this.input.getAttribute("data-direct-upload-token");
    }
    get attachmentName() {
      return this.input.getAttribute("data-direct-upload-attachment-name");
    }
    dispatch(name, detail = {}) {
      detail.file = this.file;
      detail.id = this.directUpload.id;
      return dispatchEvent2(this.input, `direct-upload:${name}`, {
        detail
      });
    }
    dispatchError(error4) {
      const event = this.dispatch("error", {
        error: error4
      });
      if (!event.defaultPrevented) {
        alert(error4);
      }
    }
    directUploadWillCreateBlobWithXHR(xhr) {
      this.dispatch("before-blob-request", {
        xhr
      });
    }
    directUploadWillStoreFileWithXHR(xhr) {
      this.dispatch("before-storage-request", {
        xhr
      });
      xhr.upload.addEventListener("progress", (event) => this.uploadRequestDidProgress(event));
    }
  };
  var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
  var DirectUploadsController = class {
    constructor(form) {
      this.form = form;
      this.inputs = findElements(form, inputSelector).filter((input) => input.files.length);
    }
    start(callback) {
      const controllers = this.createDirectUploadControllers();
      const startNextController = () => {
        const controller = controllers.shift();
        if (controller) {
          controller.start((error4) => {
            if (error4) {
              callback(error4);
              this.dispatch("end");
            } else {
              startNextController();
            }
          });
        } else {
          callback();
          this.dispatch("end");
        }
      };
      this.dispatch("start");
      startNextController();
    }
    createDirectUploadControllers() {
      const controllers = [];
      this.inputs.forEach((input) => {
        toArray(input.files).forEach((file) => {
          const controller = new DirectUploadController(input, file);
          controllers.push(controller);
        });
      });
      return controllers;
    }
    dispatch(name, detail = {}) {
      return dispatchEvent2(this.form, `direct-uploads:${name}`, {
        detail
      });
    }
  };
  var processingAttribute = "data-direct-uploads-processing";
  var submitButtonsByForm = /* @__PURE__ */ new WeakMap();
  var started = false;
  function start2() {
    if (!started) {
      started = true;
      document.addEventListener("click", didClick, true);
      document.addEventListener("submit", didSubmitForm, true);
      document.addEventListener("ajax:before", didSubmitRemoteElement);
    }
  }
  function didClick(event) {
    const { target } = event;
    if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
      submitButtonsByForm.set(target.form, target);
    }
  }
  function didSubmitForm(event) {
    handleFormSubmissionEvent(event);
  }
  function didSubmitRemoteElement(event) {
    if (event.target.tagName == "FORM") {
      handleFormSubmissionEvent(event);
    }
  }
  function handleFormSubmissionEvent(event) {
    const form = event.target;
    if (form.hasAttribute(processingAttribute)) {
      event.preventDefault();
      return;
    }
    const controller = new DirectUploadsController(form);
    const { inputs } = controller;
    if (inputs.length) {
      event.preventDefault();
      form.setAttribute(processingAttribute, "");
      inputs.forEach(disable);
      controller.start((error4) => {
        form.removeAttribute(processingAttribute);
        if (error4) {
          inputs.forEach(enable);
        } else {
          submitForm(form);
        }
      });
    }
  }
  function submitForm(form) {
    let button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
    if (button) {
      const { disabled } = button;
      button.disabled = false;
      button.focus();
      button.click();
      button.disabled = disabled;
    } else {
      button = document.createElement("input");
      button.type = "submit";
      button.style.display = "none";
      form.appendChild(button);
      button.click();
      form.removeChild(button);
    }
    submitButtonsByForm.delete(form);
  }
  function disable(input) {
    input.disabled = true;
  }
  function enable(input) {
    input.disabled = false;
  }
  function autostart() {
    if (window.ActiveStorage) {
      start2();
    }
  }
  setTimeout(autostart, 1);

  // node_modules/@rails/actiontext/app/javascript/actiontext/attachment_upload.js
  var AttachmentUpload = class {
    constructor(attachment, element) {
      this.attachment = attachment;
      this.element = element;
      this.directUpload = new DirectUpload(attachment.file, this.directUploadUrl, this.directUploadToken, this.attachmentName, this);
    }
    start() {
      this.directUpload.create(this.directUploadDidComplete.bind(this));
    }
    directUploadWillStoreFileWithXHR(xhr) {
      xhr.upload.addEventListener("progress", (event) => {
        const progress = event.loaded / event.total * 100;
        this.attachment.setUploadProgress(progress);
      });
    }
    directUploadDidComplete(error4, attributes) {
      if (error4) {
        throw new Error(`Direct upload failed: ${error4}`);
      }
      this.attachment.setAttributes({
        sgid: attributes.attachable_sgid,
        url: this.createBlobUrl(attributes.signed_id, attributes.filename)
      });
    }
    createBlobUrl(signedId, filename) {
      return this.blobUrlTemplate.replace(":signed_id", signedId).replace(":filename", encodeURIComponent(filename));
    }
    get directUploadUrl() {
      return this.element.dataset.directUploadUrl;
    }
    get blobUrlTemplate() {
      return this.element.dataset.blobUrlTemplate;
    }
    get directUploadToken() {
      return this.element.getAttribute("data-direct-upload-token");
    }
    get attachmentName() {
      return this.element.getAttribute("data-direct-upload-attachment-name");
    }
  };

  // node_modules/@rails/actiontext/app/javascript/actiontext/index.js
  addEventListener("trix-attachment-add", (event) => {
    const { attachment, target } = event;
    if (attachment.file) {
      const upload = new AttachmentUpload(attachment, target);
      upload.start();
    }
  });

  // app/javascript/application.js
  var import_line_clamp = __toESM(require_src());
  var import_forms = __toESM(require_src2());
  var import_trix2 = __toESM(require_trix());
})();
//# sourceMappingURL=application.js.map
