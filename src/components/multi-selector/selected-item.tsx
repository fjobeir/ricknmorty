import { FC } from "react";
import { BaseOption } from "../../types/multi-selector";

type Props = {
    item: BaseOption,
    onRemove?: () => void;
}

const SelectedItem: FC<Props> = ({ item, onRemove }) => {
    return (
        <div className="bg-gray-200 text-sm flex items-center gap-1 px-2 py-1 whitespace-nowrap rounded-lg">
            <span>{item.name}</span>
            <button className="bg-gray-400 rounded w-4 h-4" onClick={() => onRemove && onRemove()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default SelectedItem;