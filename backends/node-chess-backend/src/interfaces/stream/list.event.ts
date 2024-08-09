import { EStreamListEvents } from "../../enums";
import { IListDeleteEvent } from "./list-delete.event";
import { IListInitEvent } from "./list-init.event";
import { IListInsertEvent } from "./list-insert.event";

export interface IListEvent<T> {
    type: EStreamListEvents;
    event: IListInitEvent<T> | IListInsertEvent<T> | IListDeleteEvent;
}