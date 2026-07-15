import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'Fetureslist.md');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'features.ts');

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const features = [];

function getCategory(id) {
  if (id >= 1 && id <= 15) return 'Organization & Search';
  if (id >= 16 && id <= 30) return 'Smart & AI Intelligence';
  if (id >= 31 && id <= 45) return 'Offline, Reader & Media';
  if (id >= 46 && id <= 60) return 'Security & Privacy';
  if (id >= 61 && id <= 75) return 'Collaboration & Sharing';
  if (id >= 76 && id <= 90) return 'Integrations & API';
  return 'Analytics & Gamification';
}

for (const line of lines) {
  if (line.trim().startsWith('|') && !line.includes('Sr No.') && !line.includes('---|')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 5) {
      const id = parseInt(parts[1], 10);
      if (isNaN(id)) continue;
      const name = parts[2].replace(/\*\*/g, '').trim();
      const description = parts[3].trim();
      const usecase = parts[4].trim();
      
      features.push({
        id,
        name,
        description,
        usecase,
        category: getCategory(id)
      });
    }
  }
}

const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, `export interface Feature {
  id: number;
  name: string;
  description: string;
  usecase: string;
  category: string;
}

export const FEATURES: Feature[] = ${JSON.stringify(features, null, 2)};
`, 'utf8');

console.log(`Successfully parsed ${features.length} features and saved to ${outputPath}`);
