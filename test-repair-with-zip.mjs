import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import http from 'http';

const testFile = 'c:\\Users\\josia\\Desktop\\powerbi-ai-assistant\\uploads\\logiz_test.zip';

async function uploadFile() {
  console.log('📁 Subiendo archivo ZIP con estructura PBIP...');

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(testFile));

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pbip/upload',
      method: 'POST',
      headers: form.getHeaders()
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Archivo subido:', result.data?.filename);
            console.log('📊 Metadatos extraídos:');
            if (result.data?.metadata?.tables) {
              console.log(`   • ${result.data.metadata.tables.length} tablas encontradas`);
              result.data.metadata.tables.forEach(table => {
                console.log(`     - ${table.name} (${table.columns.length} columnas)`);
              });
            }
            if (result.data?.metadata?.relationships) {
              console.log(`   • ${result.data.metadata.relationships.length} relaciones existentes`);
            }
            resolve(result.data?.filePath);
          } else {
            console.error('❌ Error al subir:', result.error);
            reject(result.error);
          }
        } catch (e) {
          console.error('❌ Error parseando respuesta:', data.substring(0, 200));
          reject(e);
        }
      });
    });

    req.on('error', reject);
    form.pipe(req);
  });
}

async function analyzeRelationships(filePath) {
  console.log('\n🔍 Analizando relaciones con IA...');

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ filePath });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pbip/analyze-relationships',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success && result.data?.actions) {
            console.log(`✅ Detectadas ${result.data.actions.length} relaciones faltantes:\n`);
            result.data.actions.forEach((action, idx) => {
              console.log(`   ${idx+1}. [${action.type}]`);
              console.log(`      ${action.fromTable}.${action.fromColumn} → ${action.toTable}.${action.toColumn}`);
              console.log(`      📝 Razón: ${action.rationale}`);
              if (action.joinKey) {
                console.log(`      🔑 Clave: ${action.joinKey}`);
              }
              console.log('');
            });
            resolve(result.data.actions);
          } else {
            console.log('ℹ️  Sin relaciones faltantes detectadas');
            resolve([]);
          }
        } catch (e) {
          console.error('❌ Error parseando análisis:', data.substring(0, 200));
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function performRepair(filePath, actions) {
  if (actions.length === 0) {
    console.log('\n⏭️  Sin reparaciones a aplicar (todas las relaciones están correctas)');
    return null;
  }

  console.log(`\n🔧 Aplicando ${actions.length} reparaciones...\n`);

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ filePath, actions });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/pbip/auto-repair',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success && result.data?.repairPath) {
            console.log('✅ Archivo reparado exitosamente!');
            console.log(`📁 Ubicación: ${result.data.repairPath}`);
            console.log(`📝 Resumen: ${result.data.summary || 'Reparación completada'}`);
            resolve(result.data.repairPath);
          } else {
            console.error('❌ Error al reparar:', result.error);
            reject(result.error);
          }
        } catch (e) {
          console.error('❌ Error parseando reparación:', data.substring(0, 200));
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTest() {
  try {
    console.log('🚀 TEST: Flujo completo de reparación automática con archivo ZIP PBIP\n');
    console.log('═'.repeat(70) + '\n');

    const uploadedPath = await uploadFile();
    console.log('═'.repeat(70) + '\n');

    const actions = await analyzeRelationships(uploadedPath);
    console.log('═'.repeat(70));

    const repairPath = await performRepair(uploadedPath, actions);

    console.log('\n' + '═'.repeat(70));
    console.log('\n✨ TEST COMPLETADO EXITOSAMENTE!\n');

    if (repairPath) {
      const fileSize = fs.statSync(repairPath).size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      console.log(`📥 Archivo reparado disponible para descargar:`);
      console.log(`   Nombre: ${path.basename(repairPath)}`);
      console.log(`   Tamaño: ${fileSizeMB} MB`);
      console.log(`   Path: ${repairPath}`);
    } else {
      console.log('📌 El archivo no requería reparación');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el test:', error);
    process.exit(1);
  }
}

runTest();
