//export module hbeClasses {
    export class respVLC {
        Show: string
        Season: number
        Episode: number
        Titel: string
        runTime: number
        totalTime: number
        imgSource: string
    }

    export class clAktWerte {
        aktPos: number
        aktSpielzeit: number
        aktTitel: string
    }

    export class clPlayListEntry {
        Show: string
        Season: number
        Episode: number
        Duration: number
        Titel: string
        imgSrc: string
        imgSrcNode: string
        ndx: number
    }

    export interface IimdbInfo {
        ImdbID: string
        ImdbURL: string
        ndxOf
    }

    export class clTimeAndURLs {
        time: number
        urlInfo: { [showName: string]: IimdbInfo } 
    }

    export interface IAntwort { aktWerte: clAktWerte, playListForWebServer: Array<clPlayListEntry> }

//}