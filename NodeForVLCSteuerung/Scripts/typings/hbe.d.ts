// ein paar Sachen, die ich noch gebraucht habe...

interface Error {
    status?: number
}



declare module hbeModule {
    export interface hbeError {
        status: number;
        info: string;
        value: number | string

    }

    export class hbeErrors {
        error: hbeError[]
    }

    export var Holder: any

    //export class Holder {
    //     run( Option?: any ): any;
    //}
}

declare module Holder {
   export var run
}