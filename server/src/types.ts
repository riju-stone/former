import { auth } from './lib/auth.js';

export type Session = {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session | null;
}