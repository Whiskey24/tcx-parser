export type JsonValue = boolean | number | string | JsonObject | JsonArray;
export interface JsonArray extends Array<JsonValue> { }
export interface JsonObject {
    [k: string]: JsonValue
}

export const json: JsonObject = {}
