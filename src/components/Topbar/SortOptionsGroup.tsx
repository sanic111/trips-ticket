import React from "react";
import SortOptionButton, { type SortDirection } from "./SortOptionButton";

export type SortOptionsGroupHandle = {
  reset: () => void;
};

const sortOptions = [
  { label: "Giờ chạy", field: "departure_time" },
  { label: "Giá vé",   field: "fare_amount"   },
  { label: "Đánh giá", field: "rating"        },
] as const;

interface State {
  selectedField: string;
  direction: SortDirection;
}

export default class SortOptionsGroup extends React.PureComponent<{}, State> {
  state: State = {
    selectedField: sortOptions[0].field,
    direction: "asc",
  };

  // Expose imperative API
  reset = () => {
    const def = { selectedField: sortOptions[0].field, direction: "asc" } as State;
    this.setState(def, () => {
      window.dispatchEvent(
        new CustomEvent("trip-sort-change", {
          detail: { sortField: def.selectedField, sortDirection: def.direction },
        })
      );
    });
  };

  // Hook vào ref in parent
  componentDidMount() {
    // nothing
  }

  // Parent sẽ gán ref.current = this
  // nên trong TopBar: sortGroupRef.current?.reset()
  // sẽ gọi vào đây.
  // (không cần useImperativeHandle, vì là class.)
  
  handleSelect = (field: string) => {
    this.setState(
      (prev) => {
        const nextDir: SortDirection =
          prev.selectedField === field
            ? prev.direction === "asc"
              ? "desc"
              : "asc"
            : "asc";
        return { selectedField: field, direction: nextDir };
      },
      () => {
        window.dispatchEvent(
          new CustomEvent("trip-sort-change", {
            detail: {
              sortField: this.state.selectedField,
              sortDirection: this.state.direction,
            },
          })
        );
      }
    );
  };

  render() {
    return (
      <div className="sortOptionsGroup">
        {sortOptions.map((opt) => (
          <SortOptionButton
            key={opt.field}
            label={opt.label}
            active={opt.field === this.state.selectedField}
            direction={opt.field === this.state.selectedField ? this.state.direction : null}
            onClick={() => this.handleSelect(opt.field)}
          />
        ))}
      </div>
    );
  }
}
