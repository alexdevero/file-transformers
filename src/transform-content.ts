/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const { readdir } = require('fs').promises;

enum FileExtensions {
  ts = 'ts',
  tsx = 'tsx',
};

const replaceString = (file: string, search: string | RegExp, replace: string): string => {
  return file.replace(search, replace);
};

async function* getFiles(dir: any): any {
  const dirEntries = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirEntries) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export const main = async (dir: string, search: string | RegExp, replace: string) => {
  try {
    for await (const file of getFiles(dir)) {
      if (file.endsWith(FileExtensions.ts)) {
        fs.readFile(file, 'utf8', function (err: any, data: any) {
          if (err) {
            return err;
          }

          const res = replaceString(data, search, replace);

          fs.writeFile(path.resolve(file), res, 'utf8', function (err: any) {
            if (err) return console.log(err);
          });
        });
      }
    }

    console.log('Job done.')
  }
  catch (err) {
    console.error(err);
  }
};
