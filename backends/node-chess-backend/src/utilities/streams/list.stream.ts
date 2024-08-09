import WebSocket from "ws";
import { IListDeleteEvent, IListInitEvent, IListInsertEvent, IListUpdateEvent, IStreamMessage } from "../../interfaces/stream";
import { IListEvent } from "../../interfaces/stream/list.event";
import { EStreamListEvents } from "../../enums";
import { Types } from "mongoose";

export class ListStream<T> {
    _identifier: string;
    _ws: WebSocket;


    constructor(name: string, ws: WebSocket) {
        this._identifier = name;
        this._ws = ws;
    }

    send(event: IListEvent<T>) {
        this._ws.send(JSON.stringify({
            identifier: this._identifier,
            event
        } as IStreamMessage));
    }

    init(documents: T[]) {
        this.send({
            type: EStreamListEvents.init,
            event: {
                documents
            } as IListInitEvent<T>
        } as IListEvent<T>);
    }

    insert(document: T) {
        this.send({
            type: EStreamListEvents.insert,
            event: {
                document
            } as IListInsertEvent<T>
        } as IListEvent<T>);
    }

    update(document: T) {
        this.send({
            type: EStreamListEvents.update,
            event: {
                document
            } as IListUpdateEvent<T>
        } as IListEvent<T>);
    }

    delete(id: Types.ObjectId) {
        this.send({
            type: EStreamListEvents.delete,
            event: {
                id: id
            } as IListDeleteEvent
        } as IListEvent<T>);
    }
}