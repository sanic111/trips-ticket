// import Heart from "@/assets/icons/ic_heart.svg?react";
// import HeartSelected from "@/assets/icons/ic_heart_selected.svg?react";
// import Filter from "@/assets/icons/ic_filter_grey.svg?react";
// import Back from "@/assets/icons/ic_back.svg?react";
// import Close from "@/assets/icons/ic_close.svg?react";
// import Arrow from "@/assets/icons/ic_arrow.svg?react";

// const icons = {
//   heart: Heart,
//   heartSelected: HeartSelected,
//   filter: Filter,
//   back: Back,
//   close: Close,
//   arrow: Arrow,
// };

// export default function Icon({
//   name,
//   className,
// }: Readonly<{
//   name: keyof typeof icons;
//   className?: string;
// }>) {
//   const IconComponent = icons[name];
//   return <IconComponent className={className} />;
// }

// src/components/Icon/Icon.tsx
// import Heart from "@/assets/icons/ic_heart.svg?react";
// import HeartSelected from "@/assets/icons/ic_heart_selected.svg?react";
// import Filter from "@/assets/icons/ic_filter_grey.svg?react";
// import Back from "@/assets/icons/ic_back.svg?react";
// import Close from "@/assets/icons/ic_close.svg?react";
// import Arrow from "@/assets/icons/ic_arrow.svg?react";
// const icons = {
//   heart: Heart,
//   heartSelected: HeartSelected,
//   filter: Filter,
//   back: Back,
//   close: Close,
//   arrow: Arrow,
// };
// export default function Icon({
//   name,
//   className,
// }: Readonly<{
//   name: keyof typeof icons;
//   className?: string;
// }>) {
//   const IconComponent = icons[name];
//   return <IconComponent className={className} />;
// }
// src/components/Icon/Icon.tsx
import type { IconName } from "@/assets/icons/icon.types";

import Heart from "@/assets/icons/ic_heart.svg?react";
import HeartSelected from "@/assets/icons/ic_heart_selected.svg?react";
import Filter from "@/assets/icons/ic_filter_grey.svg?react";
import Back from "@/assets/icons/ic_back.svg?react";
import Close from "@/assets/icons/ic_close.svg?react";
import Arrow from "@/assets/icons/ic_arrow.svg?react";
import Select from "@/assets/icons/ic_select.svg?react";
import Selected from "@/assets/icons/ic_selected.svg?react";

const icons = {
  heart: Heart,
  heartSelected: HeartSelected,
  filter: Filter,
  back: Back,
  close: Close,
  arrow: Arrow,
  select: Select,
  selected: Selected,
};

export default function Icon({
  name,
  className,
}: Readonly<{
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
}>) {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
}
