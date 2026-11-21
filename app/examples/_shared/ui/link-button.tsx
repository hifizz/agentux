import { cx } from "./cx";

export const LinkButton = ({ className, ...props }: React.ComponentProps<"button">) => (
  <button
    type="button"
    {...props}
    className={cx("ch-color-ease ch-focus cursor-pointer rounded-xs text-ch-link outline-none hover:text-ch-link-hover hover:underline", className)}
  />
);
