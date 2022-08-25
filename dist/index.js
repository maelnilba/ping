"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const pingSchema_1 = require("./zod/pingSchema");
const server = (0, fastify_1.default)();
const tm = new Map();
server.get("/ping", (req, reply) => {
    // req.headers.authorization
    const params = pingSchema_1.pingSchema.parse(req.query);
    // allow from 1ms to 1hour
    if (params.ms_time <= 0 || params.ms_time > 60 * 60 * 1000) {
        reply.status(404).send({});
        return;
    }
    // timeout the actions
    const t = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        let request = {
            method: "GET",
        };
        if (params.data) {
            request = {
                method: "POST",
                body: params.data,
            };
        }
        if (params.key) {
            request = Object.assign(Object.assign({}, request), { headers: {
                    authorization: params.key,
                } });
        }
        (0, cross_fetch_1.default)(params.url, request).catch((e) => console.log(e));
        // unstore the timeout
        if (params.id && tm.has(params.id)) {
            tm.delete(params.id);
        }
    }), params.ms_time);
    // store the timeout ref in a map
    if (params.id && !tm.has(params.id)) {
        tm.set(params.id, { timeout: t, key: params.key });
    }
    reply.status(200).send({});
});
server.delete("/ping", (req, reply) => {
    var _a, _b;
    const params = pingSchema_1.pingDeleteSchema.parse(req.query);
    if (tm.has(params.id)) {
        let t = tm.get(params.id);
        if (!t) {
            reply.status(404).send({});
            return;
        }
        if (t.key) {
            if (params.key === t.key) {
                clearTimeout((_a = tm.get(params.id)) === null || _a === void 0 ? void 0 : _a.timeout);
                tm.delete(params.id);
            }
        }
        else {
            clearTimeout((_b = tm.get(params.id)) === null || _b === void 0 ? void 0 : _b.timeout);
            tm.delete(params.id);
        }
        reply.status(200).send({});
        return;
    }
    reply.status(404).send({});
});
server.get("/", (_, reply) => {
    reply.send({ uptime: process.uptime() });
});
server.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    host: process.env.HOST || "0.0.0.0",
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map