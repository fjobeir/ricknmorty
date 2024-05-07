import { Dispatch, SetStateAction } from "react";

export interface BaseOption {
    id: number;
    name: string;
}

export type OptionType<T> = {
    searchTerm: string;
    option: T;
    selected: boolean,
    focused: boolean;
    onArrowDown?: () => void;
    onArrowUp: () => void;
    setSelected: Dispatch<SetStateAction<Array<T>>>
}