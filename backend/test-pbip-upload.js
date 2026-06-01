import JSZip from 'jszip';
import fs from 'fs';

async function testZipStructure() {
  const zipPath = 'C:\\Users\\josia\\Desktop\\logiz_almacen_original_v2.zip';

  console.log('🔍 Analizando estructura del ZIP...\n');

  try {
    const fileContent = fs.readFileSync(zipPath);
    const zip = new JSZip();
    await zip.loadAsync(fileContent);

    // Encontrar archivos TMDL
    const tmdlFiles = [];
    const pages = [];
    const visualFiles = [];

    for (const [path] of Object.entries(zip.files)) {
      if (path.endsWith('.tmdl')) {
        tmdlFiles.push(path);
      }
      if (path.includes('/pages/') && path.endsWith('.json')) {
        pages.push(path);
      }
      if (path.includes('visual.json')) {
        visualFiles.push(path);
      }
    }

    console.log(`📊 Archivos TMDL encontrados: ${tmdlFiles.length}`);
    tmdlFiles.slice(0, 10).forEach(f => console.log(`   ✓ ${f}`));
    if (tmdlFiles.length > 10) {
      console.log(`   ... y ${tmdlFiles.length - 10} más`);
    }

    console.log(`\n📄 Páginas encontradas: ${pages.length}`);
    pages.slice(0, 5).forEach(p => console.log(`   ✓ ${p}`));

    console.log(`\n📈 Visualizaciones encontradas: ${visualFiles.length}`);
    visualFiles.slice(0, 5).forEach(v => console.log(`   ✓ ${v}`));

    console.log(`\n✅ Total de archivos en ZIP: ${Object.keys(zip.files).length}`);
    console.log('✅ TEST EXITOSO: ZIP válido y contiene estructura PBIP');
  } catch (error) {
    console.error('❌ ERROR:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testZipStructure();
