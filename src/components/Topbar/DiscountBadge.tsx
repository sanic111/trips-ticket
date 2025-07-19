import React from "react";

type DiscountBadgeProps = {
  code: string;
};

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ code }) => {
  return <div className="discountBadge">{code}</div>;
};

export default DiscountBadge;
