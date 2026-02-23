export interface User {
    id: string;
    email: string;
    name: string | null;
    weeklySessionCount: number;
    weeklyResetAt: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

export interface UserIdentity {
    id: string;
    userId: string;
    provider: string;
    providerId: string;
    metadata: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}