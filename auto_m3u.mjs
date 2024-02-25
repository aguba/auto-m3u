import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readdirSync, renameSync } from "node:fs";
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISC_IDENTIFIER = '(Disc';

const chdFiles = readdirSync(__dirname)
    .filter(fileName => fileName.endsWith('.chd') && fileName.includes(DISC_IDENTIFIER));

const m3uFiles = {}

chdFiles.forEach(fileName => {
    const discIdStartIndex = fileName.indexOf(DISC_IDENTIFIER);
    const m3uFileName = `${fileName.slice(0, discIdStartIndex).trim()}.m3u`;

    if(!m3uFiles[m3uFileName]) {
        m3uFiles[m3uFileName] = [];
    }

    m3uFiles[m3uFileName].push(fileName);
});

for(const m3uFileName in m3uFiles) {
    const currentChdFiles = m3uFiles[m3uFileName];
    const m3uFileDirectory = `${m3uFileName}/${m3uFileName}`;

    mkdirSync(m3uFileName);
    currentChdFiles.forEach(chdFileName => renameSync(chdFileName, `${m3uFileName}/${chdFileName}`));
    writeFileSync(m3uFileDirectory, currentChdFiles.join('\n'));
}