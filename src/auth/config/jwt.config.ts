import { registerAs } from "@nestjs/config"

export default registerAs('jwt',() => {
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        jwtTtl: parseInt(process.env.JWT_TTL) ?? 3600,
        jwtRefreshTtl: parseInt(process.env.JWT_REFRESH_TTL) ?? 86400
    }
})
