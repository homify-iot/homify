import { Characteristics, CharacteristicType, Services, ServiceType } from "@/types/hap-types";
import axios from "axios";
import decamelize from "decamelize";
import inflection from "inflection";

export const getAccessories = (_req, res) => {
    axios.get("http://localhost:1124/accessories")
        .then((response) => {
            res.json(getAllServices(response.data.accessories));
        })
        .catch((error) => {
            console.log(error);
        });
};
const hiddenServices = [
    Services.AccessoryInformation
];

const hiddenCharacteristics = [
    Characteristics.Name
];

function humanizeString(s: string) {
    return inflection.titleize(decamelize(s));
}
function getAllServices(accessories) {
    const services = [];
    accessories.forEach((accessory) => {

        /* Parse Accessory Information */
        const accessoryInformationService = accessory.services.find((x) => x.type === Services.AccessoryInformation);
        const accessoryInformation = {};

        if (accessoryInformationService && accessoryInformationService.characteristics) {
            accessoryInformationService.characteristics.forEach((c) => {
                if (c.value) {
                    accessoryInformation[c.description] = c.value;
                }
            });
        }

        /* Parse All Services */
        accessory.services
            .filter((s) => hiddenServices.indexOf(s.type) < 0 && Services[s.type])
            .map((s) => {
                let serviceName = s.characteristics.find((x) => x.type === Characteristics.Name);

                /* Set default name characteristic if none defined */
                serviceName = serviceName ? serviceName : {
                    iid: 0,
                    type: Characteristics.Name,
                    description: "Name",
                    format: "string",
                    value: humanizeString(Services[s.type]),
                    perms: ["pr"]
                };

                /* Parse Service Characteristics */
                const serviceCharacteristics: CharacteristicType[] = s.characteristics
                    .filter((c) => hiddenCharacteristics.indexOf(c.type) < 0 && Characteristics[c.type])
                    .map((c) => {
                        return {
                            aid: accessory.aid,
                            iid: c.iid,
                            uuid: c.type,
                            type: Characteristics[c.type],
                            serviceType: Services[s.type],
                            serviceName: serviceName.value.toString(),
                            description: c.description,
                            value: c.value,
                            format: c.format,
                            perms: c.perms,
                            unit: c.unit,
                            maxValue: c.maxValue,
                            minValue: c.minValue,
                            minStep: c.minStep,
                            canRead: c.perms.includes("pr"),
                            canWrite: c.perms.includes("pw")
                        };
                    });

                const service: ServiceType = {
                    aid: accessory.aid,
                    iid: s.iid,
                    uuid: s.type,
                    type: Services[s.type],
                    humanType: humanizeString(Services[s.type]),
                    serviceName: serviceName.value.toString(),
                    serviceCharacteristics,
                    accessoryInformation,
                    values: {},
                };

                // /* Helper function to trigger a call to the accessory to get all the characteristic values */
                // service.refreshCharacteristics = () => {
                //     return refreshServiceCharacteristics.bind(this)(service);
                // };
                //
                // /* Helper function to set the value of a characteristic */
                // service.setCharacteristic = (iid: number, value: number | string | boolean) => {
                //     return setCharacteristic.bind(this)(service, iid, value);
                // };

                /* Helper function to returns a characteristic by it's type name */
                service.getCharacteristic = (type: string) => {
                    return service.serviceCharacteristics.find((c) => c.type === type);
                };

                service.serviceCharacteristics.forEach((c) => {
                    // /* Helper function to set the value of a characteristic */
                    // c.setValue = async (value: number | string | boolean) => {
                    //     return await setCharacteristic.bind(this)(service, c.iid, value);
                    // };
                    //
                    // /* Helper function to get the value of a characteristic from the accessory */
                    // c.getValue = async () => {
                    //     return await getCharacteristic.bind(this)(service, c.iid);
                    // };

                    /* set the values for each characteristic type in an easy-to-access object */
                    service.values[c.type] = c.value;
                });

                services.push(service);
            });
    });
    return services;
}





