import React from "react";

export type Column<T> = {
    key: keyof T;
    header: string,
    render?: (row: T) => React.ReactNode;
    className?: string
};
