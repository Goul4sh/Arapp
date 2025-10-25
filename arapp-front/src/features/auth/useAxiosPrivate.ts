import {useEffect} from "react";
import api from "./api";
import {useAuth} from "./auth";

export function useAxiosPrivate() {
    const {accessToken} = useAuth();

    useEffect(() => {

        const requestIntercept = api.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            api.interceptors.request.eject(requestIntercept);
        };
    }, [accessToken]);

    return api;
}
