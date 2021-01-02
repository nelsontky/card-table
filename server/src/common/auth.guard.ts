import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.query.idToken;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      request.user = decodedToken.uid;
      return true;
    } catch {
      return false;
    }
  }
}
