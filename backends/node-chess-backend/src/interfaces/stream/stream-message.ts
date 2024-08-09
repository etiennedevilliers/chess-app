import { IListEvent } from "./list.event";

export interface IStreamMessage {
    identifier: string,
    event: IListEvent<any>
}
