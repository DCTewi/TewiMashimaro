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
exports.db = exports.Mashimaro = void 0;
const level_1 = __importDefault(require("level"));
const uuid_1 = require("uuid");
class Mashimaro {
    constructor(author, content) {
        this.id = (0, uuid_1.v1)();
        this.author = author;
        this.content = content;
        this.time = new Date();
        this.read = false;
        this.answer = undefined;
    }
}
exports.Mashimaro = Mashimaro;
class DbContext {
    constructor() {
        if (DbContext._instance != undefined) {
            throw "can't instantiate a singeleton twice";
        }
        else {
            DbContext._instance = this;
        }
        this._db = (0, level_1.default)('./_db', { valueEncoding: 'json' });
    }
    static instance() {
        if (DbContext._instance == undefined) {
            DbContext._instance = new DbContext();
        }
        return DbContext._instance;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._db.get(DbContext._mashimaros_dbkey);
            }
            catch (error) {
                return [];
            }
        });
    }
    add(mashimaro) {
        return __awaiter(this, void 0, void 0, function* () {
            let mashimaros = yield this.get();
            mashimaros.push(mashimaro);
            yield this._db.put(DbContext._mashimaros_dbkey, mashimaros);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let mashimaros = yield this.get();
            const index = mashimaros.findIndex(m => m.id == id);
            mashimaros.splice(index, 1);
            yield this._db.put(DbContext._mashimaros_dbkey, mashimaros);
        });
    }
    update(mashimaro) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.remove(mashimaro.id);
            yield this.add(mashimaro);
        });
    }
}
DbContext._instance = undefined;
DbContext._mashimaros_dbkey = "_m";
const db = () => {
    return DbContext.instance();
};
exports.db = db;
//# sourceMappingURL=database.js.map