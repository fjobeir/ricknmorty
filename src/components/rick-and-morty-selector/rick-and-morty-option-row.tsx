import { FC, KeyboardEvent, useEffect, useId, useRef } from "react";
import { OptionType } from "../../types/multi-selector";
import { RMCharacter } from "../../types/rick-and-morty";
import highlightSubstring from "../multi-selector/highlighter";

const RickMortyOptionRow: FC<OptionType<RMCharacter>> = ({searchTerm, option, selected, focused, setSelected, onArrowDown, onArrowUp}) => {
    const id = useId();
    const optionRef = useRef(null);

    const toggleSelected = () => {
        if (selected) {
            setSelected((prevSelected) => prevSelected.filter((selectedOption) => selectedOption.id !== option.id));
        } else {
            setSelected((prevSelected) => [...prevSelected, option]);
        }
    }

    useEffect(() => {
        if (focused && optionRef.current) {
            (optionRef.current as HTMLLIElement).focus();
        }
    }, [focused]);

    const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      toggleSelected();
    } else if (e.key === 'ArrowDown') {
        if (onArrowDown)
            onArrowDown();
    } else if (e.key === 'ArrowUp') {
        if (onArrowUp)
            onArrowUp();
    }
  };

    const highlightedName = highlightSubstring(option.name, searchTerm);

    return (
        <li role="option" aria-selected={selected} id={`rm_option_${option.id}`} ref={optionRef} tabIndex={-1} onKeyDown={handleKeyDown}>
            <label className="bg-gray-100 flex items-center gap-2 p-2" htmlFor={id}>
            <input type="checkbox" checked={selected} id={id} onChange={toggleSelected} />
            <img src={option.image} alt={option.name} className="h-10 w-10 rounded" />
            <div className="flex flex-col">
                <span className="text-gray-700">{highlightedName}</span>
                <span className="text-gray-500">{option.episode.length} Episodes</span>
            </div>
        </label>
        </li>
    )
}

export default RickMortyOptionRow;