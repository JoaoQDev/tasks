import { SetMetadata } from "@nestjs/common"
import { ROUTE_POLICY_KEY } from "../auth.const"
import { RoutePolicies } from "../enum/route-policies.enum";

export const SetRoutePolicy = (policy:RoutePolicies) => {
    return SetMetadata(ROUTE_POLICY_KEY,policy);
}