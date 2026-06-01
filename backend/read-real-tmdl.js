import JSZip from 'jszip';
import fs from 'fs';

async function readRealTMDL() {
  const zipPath = 'C:\\Users\\josia\\Desktop\\logiz_almacen_original_v2.zip';

  const fileContent = fs.readFileSync(zipPath);
  const zip = new JSZip();
  await zip.loadAsync(fileContent);

  // Encontrar un archivo TMDL de tabla
  for (const [path, file] of Object.entries(zip.files)) {
    if (path.includes('definition/tables/') && path.endsWith('.tmdl') && !path.includes('DateTableTemplate')) {
      const content = await file.async('string');

      console.log(`📄 Archivo: ${path}\n`);
      console.log('═'.repeat(80));
      console.log('ESTRUCTURA COMPLETA DEL TMDL:');
      console.log('═'.repeat(80));
      console.log(content);
      console.log('═'.repeat(80));

      break;
    }
  }
}

readRealTMDL().catch(console.error);
