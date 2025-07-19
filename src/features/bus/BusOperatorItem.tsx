import React from "react";
import Icon from "@/assets/icons/Icon";

type Props = {
    name: string;
    image?: string;
    selected: boolean;
    onClick: () => void;
};

const BusOperatorItem = ({name, image, selected, onClick}: Props) => {
    return (
        <div className="item" onClick={onClick}>
            <img src={image} alt={name} />
            <span>{name}</span>
            <Icon name={selected ? "selected" : "select"} className="selectIcon" />
        </div>
    );
};

export default BusOperatorItem;

