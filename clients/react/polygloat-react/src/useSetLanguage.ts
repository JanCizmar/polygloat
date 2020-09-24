import {useContext} from "react";
import {PolygloatProviderContext} from "./PolygloatProvider";

/**
 * Custom react hook
 * @return function accepting language abbreviation as parameter
 */
export const useSetLanguage = () => {
    const context = useContext(PolygloatProviderContext);
    return (language: string) => {
        context.polygloat.lang = language
    };
}