import React, {useRef, useState, useCallback} from "react";
import DiscountBadge from "./DiscountBadge";
import VoucherList, {type VoucherListHandle} from "@/components/VoucherCard/VoucherList";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";

const VoucherSection: React.FC = () => {
    const voucherRef = useRef<VoucherListHandle>(null);
    const [expanded, setExpanded] = useState(false);

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
                    <span className="distext">Mã giảm giá của tôi</span>
                    <DiscountBadge code="XEKHACH100" />
                </div>
                <div className="morenicon">
                    <button className="seeMore" onClick={toggleOpen}>
                        {expanded ? "Thu gọn" : "Xem thêm"}
                        {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>
            <VoucherList ref={voucherRef} />
        </>
    );
};

export default VoucherSection;
