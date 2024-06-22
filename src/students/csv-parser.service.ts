import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class CsvParserService {
  async parseCsv(fileBuffer: Buffer): Promise<any[]> {
    const results = [];
    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);

    return new Promise((resolve, reject) => {
      readable
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          if (Object.values(data).some((value: string) => value.trim() !== '')) {
            results.push(data);
          }
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}
