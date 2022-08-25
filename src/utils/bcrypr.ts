import * as bcrypt from 'bcrypt';

const saltOrRounds = parseInt(process.env.SALT_ROUNDS);

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltOrRounds || 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
