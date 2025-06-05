export const getEnvFileName = (env: string): string => {
    switch (env) {
        case "production":
            return ".production.env";
        case "stage":
            return ".stage.env";
        default:
            return ".development.env";
    }
};
