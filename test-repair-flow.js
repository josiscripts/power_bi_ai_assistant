const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');
const https = require('https');

const testFile = 'c:\\Users\\josia\\Desktop\\powerbi-ai-assistant\\uploads\\test.pbip';

async function uploadFile() {
  console.log('📁 Subiendo archivo PBIP...');

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
            resolve(result.data?.filePath);
          } else {
            console.error('❌ Error al subir:', result.error);
            reject(result.error);
          }
        } catch (e) {
          console.error('❌ Error parseando respuesta:', data);
          reject(e);
        }
      });
    });

    req.on('error', reject);
    form.pipe(req);
  });
}

async function analyzeRelationships(filePath) {
  console.log('\n🔍 Analizando relaciones...');

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
            console.log(`✅ Encontradas ${result.data.actions.length} relaciones:`);
            result.data.actions.forEach((action, idx) => {
              console.log(`   ${idx+1}. ${action.type}: ${action.fromTable}.${action.fromColumn} → ${action.toTable}.${action.toColumn}`);
              console.log(`      ${action.rationale}`);
            });
            resolve(result.data.actions);
          } else {
            console.log('ℹ️  Sin relaciones faltantes detectadas');
            resolve([]);
          }
        } catch (e) {
          console.error('❌ Error parseando análisis:', data);
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
    console.log('\n⏭️  Sin reparaciones a aplicar');
    return null;
  }

  console.log(`\n🔧 Reparando archivo con ${actions.length} acciones...`);

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
            console.log('✅ Archivo reparado:', path.basename(result.data.repairPath));
            resolve(result.data.repairPath);
          } else {
            console.error('❌ Error al reparar:', result.error);
            reject(result.error);
          }
        } catch (e) {
          console.error('❌ Error parseando reparación:', data);
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
    console.log('🚀 Iniciando test del flujo de reparación automática...\n');

    const uploadedPath = await uploadFile();
    const actions = await analyzeRelationships(uploadedPath);
    const repairPath = await performRepair(uploadedPath, actions);

    console.log('\n✨ Test completado exitosamente!');
    if (repairPath) {
      console.log(`📥 Descarga disponible: ${repairPath}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el test:', error);
    process.exit(1);
  }
}

runTest();
