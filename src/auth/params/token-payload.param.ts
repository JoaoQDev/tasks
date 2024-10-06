import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQ_USER_PAYLOAD } from "../auth.const";

export const TokenPayloadParam = createParamDecorator(
    (data:unknown,ctx:ExecutionContext) => {
        const context = ctx.switchToHttp();
        const request:Request = context.getRequest();
        return request[REQ_USER_PAYLOAD];
    }
)