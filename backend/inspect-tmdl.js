import JSZip from 'jszip';
import fs from 'fs';

async function inspectTMDL() {
  const zipPath = 'C:\\Users\\josia\\Desktop\\logiz_almacen_original_v2.zip';

  const fileContent = fs.readFileSync(zipPath);
  const zip = new JSZip();
  await zip.loadAsync(fileContent);

  // Encontrar un archivo TMDL de tabla
  let tableFile = null;
  let tablePath = null;

  // Primero, buscar todos los TMDL para ver dónde están
  const allTmdl = [];
  for (const [path] of Object.entries(zip.files)) {
    if (path.endsWith('.tmdl')) {
      allTmdl.push(path);
    }
  }

  console.log(`📂 Total de archivos TMDL encontrados: ${allTmdl.length}\n`);
  console.log('Primeros 10 TMDL encontrados:');
  allTmdl.slice(0, 10).forEach(p => console.log(`  ${p}`));
  console.log('');

  // Buscar table TMDL (no model.tmdl ni relationships.tmdl)
  for (const [path, file] of Object.entries(zip.files)) {
    if (path.endsWith('.tmdl') && !path.includes('model.tmdl') && !path.includes('relationships.tmdl') && !path.includes('database.tmdl') && !path.includes('cultures')) {
      tableFile = file;
      tablePath = path;
      break;
    }
  }

  if (!tableFile) {
    // Si no hay tabla, usa el model.tmdl
    for (const [path, file] of Object.entries(zip.files)) {
      if (path.includes('model.tmdl')) {
        tableFile = file;
        tablePath = path;
        break;
      }
    }
  }

  if (!tableFile) {
    console.log('❌ No se encontraron archivos TMDL');
    return;
  }

  console.log(`📄 Archivo encontrado: ${tablePath}\n`);

  const content = await tableFile.async('string');

  console.log('══════════════════════════════════════════════════════');
  console.log('ESTRUCTURA DEL ARCHIVO TMDL');
  console.log('══════════════════════════════════════════════════════\n');

  // Mostrar primeros 800 caracteres
  console.log(content.substring(0, 800));

  console.log('\n...\n');
  console.log(`Total de caracteres: ${content.length}`);
  console.log(`Total de líneas: ${content.split('\n').length}`);

  // Analizar estructura
  console.log('\n══════════════════════════════════════════════════════');
  console.log('ANÁLISIS DE ESTRUCTURA');
  console.log('══════════════════════════════════════════════════════\n');

  // Buscar palabras clave
  const hasTable = /table\s+/.test(content);
  const hasColumn = /column\s+/.test(content);
  const hasMeasure = /measure\s+/.test(content);
  const hasExpression = /expression\s*:/.test(content);

  console.log(`✓ Tiene palabra clave "table": ${hasTable}`);
  console.log(`✓ Tiene palabra clave "column": ${hasColumn}`);
  console.log(`✓ Tiene palabra clave "measure": ${hasMeasure}`);
  console.log(`✓ Tiene definiciones de expresión: ${hasExpression}`);

  // Contar elementos
  const tableMatches = content.match(/table\s+/g) || [];
  const columnMatches = content.match(/column\s+/g) || [];
  const measureMatches = content.match(/measure\s+/g) || [];

  console.log(`\nTablas encontradas: ${tableMatches.length}`);
  console.log(`Columnas encontradas: ${columnMatches.length}`);
  console.log(`Medidas encontradas: ${measureMatches.length}`);
}

inspectTMDL().catch(console.error);
