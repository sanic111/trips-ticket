import React, {useState, useMemo, useCallback, useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Icon from "@/assets/icons/Icon";
import rawData from "@/data/locchuyenxe.json";
import type {FilterState, TimeRange} from "@/types/filter.types";
import type {Trip} from "@/features/trip/model/trip.types";
import {TIME_RANGES, VEHICLE_TYPES, PRICE_RANGE_LIMIT} from "@/features/trip/model/filter.constants";

const TRIPS: Trip[] = rawData.json.coreData.data;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpenOperatorPopup: () => void;
    filter: FilterState;
    onFilterChange: (newFilter: FilterState) => void;
};

const TripFilterPopup: React.FC<Props> = ({isOpen, onClose, onOpenOperatorPopup, filter, onFilterChange}) => {
    const [selectedOperators, setSelectedOperators] = useState<string[]>(filter.operators);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(filter.vehicleTypes);
    const [selectedTimes, setSelectedTimes] = useState<TimeRange[]>(filter.departureTimes);
    const [priceRange, setPriceRange] = useState<[number, number]>(filter.priceRange ?? PRICE_RANGE_LIMIT);

    useEffect(() => {
        setSelectedOperators(filter.operators);
    }, [filter.operators]);

    const operators = useMemo(() => Array.from(new Set(TRIPS.map((t) => t.transport_information.name))), []);

    const toggleOperator = useCallback((name: string) => {
        setSelectedOperators((prev) => (prev.includes(name) ? prev.filter((o) => o !== name) : [...prev, name]));
    }, []);

    const toggleVehicleType = useCallback((type: string) => {
        const upper = type.toUpperCase();
        setSelectedTypes((prev) => (prev.includes(upper) ? prev.filter((t) => t !== upper) : [...prev, upper]));
    }, []);

    const toggleTimeRange = useCallback((range: TimeRange) => {
        setSelectedTimes((prev) =>
            prev.some((t) => t.label === range.label) ? prev.filter((t) => t.label !== range.label) : [...prev, range]
        );
    }, []);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newMin = Math.round(Number(e.target.value) / 50000) * 50000;
        newMin = Math.min(newMin, priceRange[1] - 50000);
        setPriceRange([newMin, priceRange[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newMax = Math.round(Number(e.target.value) / 50000) * 50000;
        newMax = Math.max(newMax, priceRange[0] + 50000);
        setPriceRange([priceRange[0], newMax]);
    };

    const handleReset = useCallback(() => {
        setSelectedOperators([]);
        setSelectedTypes([]);
        setSelectedTimes([]);
        setPriceRange(PRICE_RANGE_LIMIT);
        onFilterChange({
            ...filter,
            operators: [],
            vehicleTypes: [],
            departureTimes: [],
            priceRange: PRICE_RANGE_LIMIT,
        });
    }, [filter, onFilterChange]);

    const handleApply = useCallback(() => {
        onFilterChange({
            ...filter,
            operators: selectedOperators,
            vehicleTypes: selectedTypes,
            departureTimes: selectedTimes,
            priceRange,
        });
        onClose();
    }, [filter, selectedOperators, selectedTypes, selectedTimes, priceRange, onFilterChange, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 0.4}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                    />
                    <motion.div
                        className="popup"
                        initial={{y: "100%"}}
                        animate={{y: 0}}
                        exit={{y: "100%"}}
                        transition={{type: "tween", duration: 0.3}}
                    >
                        <div className="tripFilterHeader">
                            <span>Lọc</span>
                            <button onClick={onClose}>
                                <Icon name="close" className="closeIcon" />
                            </button>
                        </div>

                        {/* Nhà xe */}
                        <div className="section">
                            <div className="sectionHeader">
                                <h4>Nhà xe</h4>
                                <button
                                    onClick={() => {
                                        onFilterChange({...filter, operators: selectedOperators});
                                        onClose();
                                        onOpenOperatorPopup();
                                    }}
                                >
                                    Xem tất cả
                                </button>
                            </div>
                            <div className="busList">
                                {operators.slice(0, 3).map((name) => {
                                    const info = TRIPS.find(
                                        (t) => t.transport_information.name === name
                                    )?.transport_information;
                                    return (
                                        <div key={name} className="busItem" onClick={() => toggleOperator(name)}>
                                            <img src={info?.image_url} alt={name} />
                                            <span>{name}</span>
                                            <Icon
                                                name={selectedOperators.includes(name) ? "selected" : "select"}
                                                className="selectIcon"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Loại xe */}
                        <div className="section">
                            <div className="sectionHeader">
                                <h4>Loại xe</h4>
                            </div>
                            <div className="typeOptions">
                                {VEHICLE_TYPES.map((type) => {
                                    const isSel = selectedTypes.includes(type);
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => toggleVehicleType(type)}
                                            className={isSel ? "selected" : ""}
                                            aria-pressed={isSel}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Giờ đi */}
                        <div className="section">
                            <div className="sectionHeader">
                                <h4>Giờ đi</h4>
                            </div>
                            <div className="timeOptions">
                                {TIME_RANGES.map((range) => {
                                    const isSel = selectedTimes.some((t) => t.label === range.label);
                                    return (
                                        <button
                                            key={range.label}
                                            onClick={() => toggleTimeRange(range)}
                                            className={isSel ? "selected" : ""}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Khoảng giá */}
                        <div className="section">
                            <div className="sectionHeader">
                                <h4>Khoảng giá</h4>
                            </div>
                            <div className="doubleSlider">
                                <input
                                    type="range"
                                    min={PRICE_RANGE_LIMIT[0]}
                                    max={PRICE_RANGE_LIMIT[1]}
                                    step={50000}
                                    value={priceRange[0]}
                                    onChange={handleMinChange}
                                    className="thumbMin"
                                />
                                <input
                                    type="range"
                                    min={PRICE_RANGE_LIMIT[0]}
                                    max={PRICE_RANGE_LIMIT[1]}
                                    step={50000}
                                    value={priceRange[1]}
                                    onChange={handleMaxChange}
                                    className="thumbMax"
                                />

                                <div
                                    className="sliderTrack"
                                    style={
                                        {
                                            "--pos-min": `${(priceRange[0] / PRICE_RANGE_LIMIT[1]) * 100}%`,
                                            "--pos-max": `${(priceRange[1] / PRICE_RANGE_LIMIT[1]) * 100}%`,
                                        } as React.CSSProperties
                                    }
                                />
                            </div>
                            <div className="priceRange">
                                <span>{priceRange[0].toLocaleString()} đ</span>
                                <span>{priceRange[1].toLocaleString()} đ</span>
                            </div>
                            <div className="tripFilterFooter">
                                <div className="tripFilterButton">
                                    <button className="clearBtn" onClick={handleReset}>
                                        Xóa lọc
                                    </button>
                                    <button className="applyBtn" onClick={handleApply}>
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default React.memo(TripFilterPopup);
