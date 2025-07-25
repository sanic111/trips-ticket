import React, {useRef, useState, useCallback} from "react";
import DiscountBadge from "./DiscountBadge";
import VoucherList, {type VoucherListHandle} from "@/components/VoucherCard/VoucherList";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const VoucherSection: React.FC = () => {
    const voucherRef = useRef<VoucherListHandle>(null);
    const [expanded, setExpanded] = useState(false);
    const {t} = useTranslation();

    const toggleOpen = useCallback(() => {
        setExpanded((prev) => {
            const next = !prev;
            if (next) voucherRef.current?.open();
            else voucherRef.current?.close();
            return next;
        });
    }, []);

    return (
        <>
            <div className="discountRow">
                <div className="discode">
                    <span className="distext">{t("myPromo")}</span>
                    <DiscountBadge code="XEKHACH100" />
                </div>
                <div className="morenicon">
                    <button className="seeMore" onClick={toggleOpen}>
                        {expanded ? t("collapse") : t("expand")}
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>
            <VoucherList ref={voucherRef} />
        </>
    );
};

export default VoucherSection;
