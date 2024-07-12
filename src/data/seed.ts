import fs from 'fs';
import csv from 'csv-parser';
import index from '../configs/upstash.vector.config';
 
type Row = {text : string}

const parseCSV = async (filePath : string) : Promise<Row[]> => {
    return new Promise((resolve, reject) => {
        const rows : Row[] = [];
        fs.createReadStream(filePath).pipe(csv({separator : ','})).on('data', (row) => {
            rows.push(row);
        }).on('error', (error) => reject(error)).on('end', () => {resolve(rows);});
    })
}

const seed = async () => {
    const STEP = 30;
    const data = await parseCSV('./src/data/training_dataset.csv');
    
    for (let i = 0; i < data.length; i += STEP) {
        const chunk = data.slice(i, i + STEP);
        
        const formatted = chunk.map((row, batchIndex) => {
            return {data : row.text, id : i + batchIndex, metadata : {text : row.text}}
        });
        await index.upsert(formatted);
    }
}

await seed();