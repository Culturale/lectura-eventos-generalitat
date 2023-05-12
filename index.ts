import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import dotenv from 'dotenv';

dotenv.config();

const URI: string = process.env.URI as string;
const auth_token: string = process.env.auth_token as string;

var eventos_posteados: number = 0;
var eventos_fallidos: number = 0;
var eventos_incompletos: number = 0;

type EventGeneralitat = {
    codi: number;
    data_fi: string;
    data_inici: string;
    data_fi_aproximada: string;
    denominaci: string;
    descripcio: string;
    entrades: string;
    horari: string;
    subt_tol: string;
    tags_mbits: string;
    tags_categor_es: string;
    tags_altres_categor_es: string;
    enlla_os: string;
    documents: string;
    imatges: string;
    v_deos: string;
    adre_a: string;
    codi_postal: string;
    comarca_i_municipi: string;
    email: string;
    espai: string;
    latitud: number;
    localitat: string;
    longitud: number;
    regi_o_pa_s: string;
    tel_fon: string;
    url: string;
    imgapp: string;
    descripcio_html: string;
    georefer_ncia: PointerEvent;
}

type Event = {
    codi: number;
    denominacio: string;
    descripcio?: string;
    dataIni?: Date;
    dataFi?: Date;
    horari?: string;
    adress?: string;
    lat?: number;
    long?: number;
    price?: string;
    url?: string;
    photo?: string;
}

function formatDate(data: string): Date {
    // Todas las fechas del CSV siguen el formato: 19/09/2020 12:00:00 AM
    data = data.split(' ')[0];
    var diaMesAny = data.split('/');

    const d: Date = new Date(diaMesAny[2] + '-' + diaMesAny[1] +'-' +diaMesAny[0]);
    return d;
}

function getEvent(eventG: EventGeneralitat): Event {
    var e: Event = {
        codi: eventG.codi,
        denominacio: eventG.denominaci,
        descripcio: eventG.descripcio,
        dataIni: formatDate(eventG.data_inici),
        dataFi: formatDate(eventG.data_fi),
        horari: eventG.horari,
        adress: eventG.adre_a,
        lat: eventG.latitud,
        long: eventG.longitud,
        price: eventG.entrades,
        url: eventG.url,
        photo: eventG.imatges
    };

    if (!e.descripcio) delete e.descripcio;
    if (!e.dataIni) delete e.dataIni;
    if (!e.dataFi) delete e.dataFi;
    if (!e.horari) delete e.horari;
    if (!e.adress) delete e.adress;
    if (!e.lat) delete e.lat;
    if (!e.long) delete e.long;
    if (!e.price) delete e.price;
    if (!e.url) delete e.url;
    if (!e.photo) delete e.photo;

    return e;
}

async function postEvent(data: Event): Promise<void> {
    try {
        const res: Response = await fetch(URI + '/events/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + auth_token
            }
        });

        if (!res.ok) {
            eventos_fallidos++;
            throw new Error('status: ' + res.status);
        }
        
        // Muestra por pantalla la respuesta de la peticion:
        //const result = (await res.json());
        //console.log('result is: ', JSON.stringify(result, null, 4));

        eventos_posteados++;
        
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
    }
}


// Lectura del archivo CSV:
(() => {
    const csvFilePath = path.resolve(__dirname, 'files/Agenda_cultural_de_Catalunya__per_localitzacions_.csv');

    const headers = [
        'codi',
        'data_fi',
        'data_inici',
        'data_fi_aproximada',
        'denominaci',
        'descripcio',
        'entrades',
        'horari',
        'subt_tol',
        'tags_mbits',
        'tags_categor_es',
        'tags_altres_categor_es',
        'enlla_os',
        'documents',
        'imatges',
        'v_deos',
        'adre_a',
        'codi_postal',
        'comarca_i_municipi',
        'email',
        'espai',
        'latitud',
        'localitat',
        'longitud',
        'regi_o_pa_s',
        'tel_fon',
        'url',
        'imgapp',
        'descripcio_html',
        'georefer_ncia'
    ];

    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

    parse(fileContent, {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: (columnValue, context) => {
        if (context.column === 'codi') {
            return parseInt(columnValue, 10);
        } else if ((context.column === 'latitud' || context.column === 'longitud') && columnValue != "") {
            return parseFloat(columnValue);
        }
        return columnValue;
    }/*,
    on_record: (line, context) => {
        if (line.codi !== 20201112024) {
            return;
        }   
        return line;
    }*/
    }, async (error, result: EventGeneralitat[]) => {
        // Archivo CSV leido, procedemos a tratar la informacion
        if (error) {
            console.error(error);
        }
        
        for (var i = 0; i < result.length; i++) {
            console.log("Post nº: " + (i + 1));
            const event: Event = getEvent(result[i]);
            
            if (event.lat !== undefined && event.long !== undefined && event.dataIni !== undefined && event.dataFi !== undefined && event.horari !== undefined && event.adress !== undefined && event.descripcio !== undefined) await postEvent(event);
            else eventos_incompletos++;
        }

        console.log("Eventos totales: " + result.length);
        console.log("Se ha hecho POST de " + eventos_posteados + " evento(s)");
        console.log("Han fallado " + eventos_fallidos + " evento(s)");
        console.log("Hay " + eventos_incompletos + " evento(s) a los que le faltan campos por rellenar");
    });
})();

/*async function getAllEvents(): Promise<void> {
    try {
        const res: Response = await fetch(URI + '/events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + auth_token
            }
        });

        if (!res.ok) {
            throw new Error('status: ' + res.status);
        }
        
        const result = (await res.json());

        console.log('result is: ', JSON.stringify(result, null, 4));

        return result;
        
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            //return error.message;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
        }
    }
}
getAllEvents();*/