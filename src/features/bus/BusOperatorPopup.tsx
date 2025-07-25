import React, {forwardRef, useRef, useImperativeHandle, useCallback, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Icon from "@/assets/icons/Icon";
import rawData from "@/data/locchuyenxe.json";
import type {Trip} from "@/features/trip/model/trip.types";
import type {FilterState} from "@/types/filter.types";
import {IoClose} from "react-icons/io5";
import {useDynamicTranslation} from "@/ultils/useDynamicTranslation";
import BusOperatorItem, {type OperatorItemHandle} from "@/features/bus/BusOperatorItem";
import {useTranslation} from "react-i18next";

const CloseIcon = () => <IoClose />;
const TRIPS: Trip[] = rawData.json.coreData.data;

export interface BusOperatorPopupHandle {
    open: () => void;
    close: () => void;
    setInitialFilter: (filter: FilterState) => void;
}

type Props = {};

const BusOperatorPopup = forwardRef<BusOperatorPopupHandle, Props>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const lastKnownFilter = useRef<FilterState | null>(null);
    const {t} = useTranslation();
    const operatorNames = Array.from(new Set(TRIPS.map((t) => t.transport_information.name)));

    const itemRefs = useRef<Record<string, React.RefObject<OperatorItemHandle | null>>>({});

    operatorNames.forEach((name) => {
        if (!itemRefs.current[name]) {
            itemRefs.current[name] = React.createRef();
        }
    });

    useImperativeHandle(ref, () => ({
        open: () => {
            if (lastKnownFilter.current) {
                const active = lastKnownFilter.current.operators ?? [];
                Object.entries(itemRefs.current).forEach(([name, r]) => r.current?.set(active.includes(name)));
            }
            setIsOpen(true);
        },
        close: () => setIsOpen(false),
        setInitialFilter: (f) => {
            lastKnownFilter.current = f;
        },
    }));

    const handleApply = () => {
        const selectedOperators = Object.entries(itemRefs.current)
        .filter(([, r]) => r.current?.get())
        .map(([name]) => name);

        window.dispatchEvent(
            new CustomEvent("operator-filter-apply", {
                detail: {
                    ...lastKnownFilter.current,
                    operators: selectedOperators,
                } as FilterState,
            })
        );
        setIsOpen(false);
    };

    const {translateOperator} = useDynamicTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 0.4}}
                        exit={{opacity: 0}}
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        className="popup"
                        initial={{y: "100%"}}
                        animate={{y: 0}}
                        exit={{y: "100%"}}
                        transition={{type: "tween", duration: 0.3}}
                    >
                        <div className="busHouseheader">
                            <span style={{marginBottom: "8px"}}>{t("filter.operators")}</span>
                            <button onClick={() => setIsOpen(false)}>
                                <CloseIcon />{" "}
                            </button>
                        </div>

                        <div className="list">
                            {operatorNames.map((name) => {
                                const info = TRIPS.find(
                                    (t) => t.transport_information.name === name
                                )?.transport_information;
                                const translatedName = translateOperator(name);
                                return (
                                    <BusOperatorItem
                                        key={name}
                                        ref={itemRefs.current[name]}
                                        name={name}
                                        image={info?.image_url}
                                        translatedName={translatedName}
                                    />
                                );
                            })}
                        </div>

                        <div className="busHouseFooter">
                            <button className="doneBtn" onClick={handleApply}>
                               {t("filter.apply")}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default BusOperatorPopup;
