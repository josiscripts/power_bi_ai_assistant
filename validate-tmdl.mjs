import fs from 'fs';
import JSZip from 'jszip';

const repairFile = 'C:\\Users\\josia\\Desktop\\powerbi-ai-assistant\\backend\\uploads\\1780254319329-logiz_test_REPARADO_20260531190551.zip';

async function validateTMDL() {
  try {
    console.log('🔍 Validando archivo TMDL reparado...\n');

    const fileContent = fs.readFileSync(repairFile);
    const zip = new JSZip();
    await zip.loadAsync(fileContent);

    // Buscar el archivo relationships.tmdl
    let found = false;
    for (const [path, file] of Object.entries(zip.files)) {
      if (path.includes('relationships.tmdl') && !file.dir) {
        found = true;
        const content = await file.async('string');

        console.log('✅ Archivo relationships.tmdl encontrado\n');
        console.log('═'.repeat(70));
        console.log('CONTENIDO DEL ARCHIVO:\n');
        console.log(content);
        console.log('\n' + '═'.repeat(70));

        // Validar líneas de relación
        const relationshipLines = content.match(/relationship\s+[a-f0-9\-]+/g) || [];
        console.log(`\n✅ ${relationshipLines.length} relaciones encontradas\n`);

        // Verificar formato correcto
        const fromTableMatches = content.match(/fromTable:/g) || [];
        const toTableMatches = content.match(/toTable:/g) || [];
        const fromColumnMatches = content.match(/fromColumn:/g) || [];
        const toColumnMatches = content.match(/toColumn:/g) || [];

        console.log('📋 Validación de estructura:');
        console.log(`   • fromTable: ${fromTableMatches.length} (esperado: ${relationshipLines.length})`);
        console.log(`   • toTable: ${toTableMatches.length} (esperado: ${relationshipLines.length})`);
        console.log(`   • fromColumn: ${fromColumnMatches.length} (esperado: ${relationshipLines.length})`);
        console.log(`   • toColumn: ${toColumnMatches.length} (esperado: ${relationshipLines.length})`);

        // Verificar que las columnas con espacios están entre comillas
        const columnNamesWithSpaces = content.match(/"[^"]*\s[^"]*"/g) || [];
        console.log(`\n✅ Columnas con espacios entre comillas: ${columnNamesWithSpaces.length}`);
        if (columnNamesWithSpaces.length > 0) {
          columnNamesWithSpaces.slice(0, 5).forEach(col => {
            console.log(`   - ${col}`);
          });
        }

        // Verificar sintaxis de UUIDs
        const uuidPattern = /relationship\s+([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;
        const uuids = content.match(uuidPattern) || [];
        console.log(`\n✅ UUIDs válidos encontrados: ${uuids.length}`);

        // Resumen
        console.log('\n' + '═'.repeat(70));
        if (fromTableMatches.length === relationshipLines.length &&
            toTableMatches.length === relationshipLines.length &&
            fromColumnMatches.length === relationshipLines.length &&
            toColumnMatches.length === relationshipLines.length) {
          console.log('✅ VALIDACIÓN EXITOSA - Archivo TMDL está bien formado\n');
          console.log('El archivo está listo para abrir en Power BI Desktop');
        } else {
          console.log('⚠️ VALIDACIÓN INCOMPLETA - Revisar estructura\n');
        }

        break;
      }
    }

    if (!found) {
      console.log('❌ No se encontró relationships.tmdl en el ZIP');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

validateTMDL();
