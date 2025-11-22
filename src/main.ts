// --- INICIO DEL PARCHE ---
import * as crypto from 'crypto';

// Si global.crypto no existe (pasa en Node 18), lo asignamos manualmente
if (!global.crypto) {
  // @ts-ignore
  global.crypto = crypto;
}
// --- FIN DEL PARCHE ---

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS por si acaso el Frontend lo necesita luego
  app.enableCors(); 

  await app.listen(process.env.PORT ?? 3005);
  console.log(`Microservicio corriendo en el puerto: ${process.env.PORT ?? 3000}`);
}
bootstrap();