import { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from './firebase';

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    // Attach the decoded user to the request
    (request as any).user = decodedToken;
  } catch (error) {
    reply.status(401).send({ error: 'Unauthorized: Token verification failed' });
  }
}
