import { FC, useId } from "react";
import { OptionType } from "../../types/multi-selector";
import { RMCharacter } from "../../types/rick-and-morty";
import highlightSubstring from "../multi-selector/highlighter";

const RickMortyOptionRow: FC<OptionType<RMCharacter>> = ({searchTerm, option, selected, setSelected}) => {
    const id = useId();

    const toggleSelected = () => {
        if (selected) {
            setSelected((prevSelected) => prevSelected.filter((selectedOption) => selectedOption.id !== option.id));
        } else {
            setSelected((prevSelected) => [...prevSelected, option]);
        }
    }

    const highlightedName = highlightSubstring(option.name, searchTerm);

    return (
        <label className="bg-gray-100 flex items-center gap-2 p-2" data-id={option.id} htmlFor={id}>
            <input type="checkbox" checked={selected} id={id} onChange={toggleSelected} />
            <img src={option.image} alt={option.name} className="h-10 w-10 rounded" />
            <div className="flex flex-col">
                <span className="text-gray-700">{highlightedName}</span>
                <span className="text-gray-500">{option.episode.length} Episodes</span>
            </div>
        </label>
    )
}

export default RickMortyOptionRow;