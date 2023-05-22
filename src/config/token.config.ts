import { registerAs } from "@nestjs/config";

export default registerAs("token", () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET_KEY,
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
}));