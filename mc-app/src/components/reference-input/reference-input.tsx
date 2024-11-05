import React from "react";

type Props = {
  name: string;
  value?: any | null;
  placeholder?: string;
  showProductCount?: boolean;
  hasError?: boolean;
  referenceBy: string;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
};

const ReferenceInput: FC<React.HTMLAttributes<HTMLDivElement> & Props> = (
  props
) => {
  return <div>ReferenceInput</div>;
};

export default ReferenceInput;
