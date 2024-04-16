import { twMerge } from "tailwind-merge";

type ActionButtonProps = {
  clickHandler: () => void;
  label: string;
  className?: string;
};

export default function ActionButton({
  clickHandler,
  label,
  className,
}: ActionButtonProps) {
  return (
    <button
      className={twMerge(
        "text-white font-bold py-2 px-4 rounded bg-secondary mx-auto",
        className
      )}
      onClick={clickHandler}
    >
      {label}
    </button>
  );
}
