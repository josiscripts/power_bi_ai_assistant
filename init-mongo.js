db = db.getSiblingDB('powerbi-ai');

// Crear colecciones
db.createCollection('users');
db.createCollection('projects');
db.createCollection('measures');
db.createCollection('translations');
db.createCollection('routes');
db.createCollection('filters');

// Crear índices
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.projects.createIndex({ usuarioId: 1 });
db.projects.createIndex({ nombre: 1 });
db.projects.createIndex({ createdAt: 1 });

db.measures.createIndex({ proyectoId: 1 });
db.measures.createIndex({ nombre: 1 });

db.translations.createIndex({ proyectoId: 1 });
db.translations.createIndex({ clave: 1 });

db.routes.createIndex({ proyectoId: 1 });
db.routes.createIndex({ nombre: 1 });

db.filters.createIndex({ proyectoId: 1 });
db.filters.createIndex({ nombre: 1 });

console.log('Colecciones e índices creados exitosamente');
