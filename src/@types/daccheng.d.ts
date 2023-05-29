declare module "daccheng/HelloWidget" {
    export interface HelloWidgetProps {
        sayHello: string;
    }
    declare const HelloWidget: React.ForwardRefExoticComponent<HelloWidgetProps & React.RefAttributes<any>>;
    export default HelloWidget;

}

declare module "daccheng/Coupled" {
    export interface CoupledProps {
        service: CommunicationService;
    }
    export declare const Coupled: React.ForwardRefExoticComponent<CoupledProps & React.RefAttributes<any>>;
    export default Coupled;
}

declare module "daccheng/externalRoutes" {
    import { RouteObject } from "react-router-dom";

    export declare const routes: RouteObject[];
    export default routes;
}