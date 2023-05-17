export class DecodedTeacherTokenDto {
    header: {
        alg: string;
        typ: string;
    };
    payload: {
        email: string;
        id: number;
        iat: number;
        exp: number;
    };
    signature: string;
}