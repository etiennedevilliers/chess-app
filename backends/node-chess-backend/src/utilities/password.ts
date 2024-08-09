import * as bcrypt from 'bcrypt';

export async function hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(process.env.ROUNDS) ?? 10);
}

export async function compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}