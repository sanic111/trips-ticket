  import React from "react";
  import FilterButton from "./FilterButton";
  import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

  export type SortDirection = "asc" | "desc";

  interface Props {
    label: string;
    active: boolean;
    direction: SortDirection | null;
    onClick: () => void;
  }

  export default class SortOptionButton extends React.PureComponent<Props> {
    render() {
      const { label, active, direction, onClick } = this.props;
      let icon = null;
      if (active) {
        icon = direction === "asc" ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />;
      }

      return (
        <FilterButton
          label={label}
          active={active}
          onClick={onClick}
          icon={icon}
          className="sortButton"
        />
      );
    }
  }
