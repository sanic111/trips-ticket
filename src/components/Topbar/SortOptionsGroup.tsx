import React, {useState, useCallback, useMemo, forwardRef, useImperativeHandle} from "react";
import {useTranslation} from "react-i18next";
import SortOptionButton, {type SortDirection} from "./SortOptionButton";

export type SortOptionsGroupHandle = {
    reset: () => void;
};

const SortOptionsGroup = forwardRef<SortOptionsGroupHandle>((_, ref) => {
    const {t} = useTranslation();
    const [selectedField, setSelectedField] = useState("departure_time");
    const [direction, setDirection] = useState<SortDirection>("asc");

    const reset = useCallback(() => {
        setSelectedField("departure_time");
        setDirection("asc");

        window.dispatchEvent(
            new CustomEvent("trip-sort-change", {
                detail: {
                    sortField: "departure_time",
                    sortDirection: "asc",
                },
            })
        );
    }, []);

    useImperativeHandle(ref, () => ({reset}));

    const handleSelect = useCallback(
        (field: string) => {
            setSelectedField((prevField) => {
                const isSame = prevField === field;
                const nextDir = isSame ? (direction === "asc" ? "desc" : "asc") : "asc";
                setDirection(nextDir);

                window.dispatchEvent(
                    new CustomEvent("trip-sort-change", {
                        detail: {
                            sortField: field,
                            sortDirection: nextDir,
                        },
                    })
                );

                return field;
            });
        },
        [direction]
    );

    const sortOptions = useMemo(
        () =>
            [
                {label: t("topbar.sort.departureTime"), field: "departure_time"},
                {label: t("topbar.sort.fare"), field: "fare_amount"},
                {label: t("topbar.sort.rating"), field: "rating"},
            ] as const,
        [t]
    );

    return (
        <div className="sortOptionsGroup">
            {sortOptions.map((opt) => (
                <SortOptionButton
                    key={opt.field}
                    label={opt.label}
                    active={opt.field === selectedField}
                    direction={opt.field === selectedField ? direction : null}
                    onClick={() => handleSelect(opt.field)}
                />
            ))}
        </div>
    );
});

export default SortOptionsGroup;
