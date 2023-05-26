declare module "starter/HelloWidget" {
    export interface HelloWidgetProps {
        sayHello: string;
    }
    declare const HelloWidget: React.ForwardRefExoticComponent<HelloWidgetProps & React.RefAttributes<any>>;
    export default HelloWidget;

}

declare module "starter/Coupled" {
    export interface CoupledProps {
        service: CommunicationService;
    }
    export declare const Coupled: React.ForwardRefExoticComponent<CoupledProps & React.RefAttributes<any>>;
    export default Coupled;
}