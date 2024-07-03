import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { todoType } from "../../context/TodosContext";
import { useState } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";

type Props = {
  sort: { by: keyof todoType; asc: boolean };
  setSort: React.Dispatch<
    React.SetStateAction<{
      by: keyof todoType;
      asc: boolean;
    }>
  >;
};

const SortTodosPopover = ({ sort, setSort }: Props) => {
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  return (
    <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-40 justify-between">
          <div className="flex items-center">
            {sort.by === "createdAt"
              ? "Created at"
              : sort.by === "status"
              ? "Status"
              : "Priority"}
            <ArrowDown
              size={15}
              className={`${sort.asc ? "" : "rotate-180"} ml-1`}
            />
          </div>
          <ChevronDown size={18} strokeWidth={1} className="ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        <Button
          variant={"ghost"}
          className="w-full h-8 gap-2"
          onClick={() => {
            setSort((prev) => {
              if (prev.by !== "createdAt")
                return { by: "createdAt", asc: true };
              else return { by: "createdAt", asc: !prev.asc };
            });
            setSortPopoverOpen(false);
          }}>
          Created at
          {sort.by === "createdAt" && (
            <ArrowDown
              size={15}
              className={`${sort.asc ? "" : "rotate-180"}`}
            />
          )}
        </Button>
        <Button
          variant={"ghost"}
          className="w-full h-8 gap-2"
          onClick={() => {
            setSort((prev) => {
              if (prev.by !== "status") return { by: "status", asc: true };
              else return { by: "status", asc: !prev.asc };
            });
            setSortPopoverOpen(false);
          }}>
          Status
          {sort.by === "status" && (
            <ArrowDown
              size={15}
              className={`${sort.asc ? "" : "rotate-180"}`}
            />
          )}
        </Button>
        <Button
          variant={"ghost"}
          className="w-full h-8 gap-2"
          onClick={() => {
            setSort((prev) => {
              if (prev.by !== "priority") return { by: "priority", asc: true };
              else return { by: "priority", asc: !prev.asc };
            });
            setSortPopoverOpen(false);
          }}>
          Priority
          {sort.by === "priority" && (
            <ArrowDown
              size={15}
              className={`${sort.asc ? "" : "rotate-180"}`}
            />
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default SortTodosPopover;
