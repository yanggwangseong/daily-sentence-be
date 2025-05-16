/**
 * 객체를 병합하는 함수
 * @param target 병합할 객체
 * @param sources 병합할 객체들
 * @returns 병합된 객체
 */
export const mergeObjects = <T extends object = object>(
    target: T,
    ...sources: T[]
): T => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();
    if (source === undefined) {
        return target;
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(function (key: string) {
            const sourceTarget = (source as Record<string, any>)[key];

            if (isMergebleObject(sourceTarget)) {
                if (!(target as Record<string, any>)[key]) {
                    (target as Record<string, any>)[key] = {};
                }
                mergeObjects(
                    (target as Record<string, any>)[key],
                    sourceTarget,
                );
            } else {
                (target as Record<string, any>)[key] = sourceTarget;
            }
        });
    }

    return mergeObjects(target, ...sources);
};

const isObject = (item: any): boolean => {
    return item !== null && typeof item === "object";
};

const isMergebleObject = (item: any): boolean => {
    return isObject(item) && !Array.isArray(item);
};
