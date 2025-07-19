import React, {forwardRef, useRef, useImperativeHandle, useCallback, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Icon from "@/assets/icons/Icon";
import rawData from "@/data/locchuyenxe.json";
import type {Trip} from "@/features/trip/model/trip.types";
import type {FilterState} from "@/types/filter.types";
import {IoClose} from "react-icons/io5";


const CloseIcon = () => <IoClose />;
const TRIPS: Trip[] = rawData.json.coreData.data;

export interface BusOperatorPopupHandle {
    open: () => void;
    close: () => void;
    setInitialFilter: (filter: FilterState) => void;
}

type Props = {};

interface OperatorItemHandle {
    get: () => boolean;
    set: (v: boolean) => void;
}

const BusOperatorItem = forwardRef(
    (
        {
            name,
            image,
        }: {
            name: string;
            image?: string;
        },
        ref: React.Ref<OperatorItemHandle>
    ) => {
        const selectedRef = useRef(false);
        const [, setRender] = useState(0);

        const forceUpdate = () => setRender((r) => r + 1);

        const toggle = () => {
            selectedRef.current = !selectedRef.current;
            forceUpdate();
        };

        useImperativeHandle(ref, () => ({
            get: () => selectedRef.current,
            set: (v) => {
                selectedRef.current = v;
                forceUpdate();
            },
        }));

        return (
            <div className="item" onClick={toggle}>
                <img src={image} alt={name} />
                <span>{name}</span>
                <Icon name={selectedRef.current ? "selected" : "select"} className="selectIcon" />
            </div>
        );
    }
);

const BusOperatorPopup = forwardRef<BusOperatorPopupHandle, Props>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const lastKnownFilter = useRef<FilterState | null>(null);

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
                            <span style={{ marginBottom: "8px" }}>Nhà xe</span>
                            <button onClick={() => setIsOpen(false)}>
                                <CloseIcon />{" "}
                            </button>
                        </div>

                        <div className="list">
                            {operatorNames.map((name) => {
                                const info = TRIPS.find(
                                    (t) => t.transport_information.name === name
                                )?.transport_information;
                                return (
                                    <BusOperatorItem
                                        key={name}
                                        ref={itemRefs.current[name]}
                                        name={name}
                                        image={info?.image_url}
                                    />
                                );
                            })}
                        </div>

                        <div className="busHouseFooter">
                            <button className="doneBtn" onClick={handleApply}>
                                Áp dụng
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default BusOperatorPopup;
