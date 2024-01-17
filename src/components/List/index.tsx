import { useEffect } from "react";
import { Task } from "../Task";

interface Props {
  list: {
    id: number;
    title: string;
  }[];
  onChange: () => void;
}

export const List = ({ list, onChange }: Props) => {
  return (
    <div>
      {list.map((e) => (
        <Task {...e} onChange={onChange} />
      ))}
    </div>
  );
};
