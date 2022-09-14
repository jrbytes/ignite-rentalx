import { parse } from 'csv-parse'
import fs from 'fs'

export interface IImportCategory {
  name: string
  description: string
}

export async function loadCategories(
  file: Express.Multer.File
): Promise<IImportCategory[]> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const categories: IImportCategory[] = []

    const parseFile = parse()

    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [name, description] = line
        categories.push({ name, description })
      })
      .on('end', () => {
        fs.promises.unlink(file.path)
        resolve(categories)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
