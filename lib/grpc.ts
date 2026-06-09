// lib/grpc.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(process.cwd(), 'proto/match.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const matchPackage = protoDescriptor.match as any;

// ใช้ Env Variable ถ้าอยู่บน Cloud แต่ถ้าทดสอบในเครื่องให้ใช้ localhost:50051
const backendUrl = process.env.GRPC_BACKEND_URL || 'localhost:50051';

const client = new matchPackage.MatchService(
  backendUrl,
  grpc.credentials.createInsecure() // หมายเหตุ: ตอนรันบน Fly.io จริงๆ อาจจะต้องปรับเป็น createSsl()
);

export default client;