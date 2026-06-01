import JSZip from 'jszip';
import fs from 'fs';

async function testPBIPExtraction() {
  const filePath = 'C:\\Users\\josia\\Desktop\\logiz_original_vfinal\\logiz_almacen_original_v2.pbip';

  console.log('📦 Leyendo archivo:', filePath);
  const fileContent = fs.readFileSync(filePath);
  const zip = new JSZip();

  await zip.loadAsync(fileContent);

  console.log('\n📂 Listando archivos del ZIP:');
  let count = 0;
  for (const [path] of Object.entries(zip.files)) {
    if (count < 30) {
      console.log(`  ${path}`);
      count++;
    }
  }

  console.log(`\n✅ Total de archivos: ${Object.keys(zip.files).length}`);

  console.log('\n🔍 Buscando archivos TMDL:');
  for (const [path, file] of Object.entries(zip.files)) {
    if (path.includes('model.tmdl') || path.includes('definition/tables/')) {
      console.log(`  ✓ ${path}`);
      if (path.endsWith('.tmdl')) {
        const content = await file.async('string');
        console.log(`    Tamaño: ${content.length} caracteres`);
        if (content.length < 500) {
          console.log(`    Contenido: ${content.substring(0, 200)}...`);
        }
      }
    }
  }

  console.log('\n🎨 Buscando visualizaciones:');
  for (const [path] of Object.entries(zip.files)) {
    if (path.includes('visual.json')) {
      console.log(`  ✓ ${path}`);
    }
  }
}

testPBIPExtraction().catch(console.error);
