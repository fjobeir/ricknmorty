import { ChangeEvent, ComponentType, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BaseOption, OptionType } from "../../types/multi-selector";
import SelectedItem from "./selected-item";
import useScrollEnd from "../../hooks/use-scroll-end";
import MultiSelectLoading from "./loading";

// Props is a generic type that extends Option
interface Props<T extends BaseOption> {
    options: Array<T>;
    maxSelectableOptions?: number;
    defaultSelectedOptions?: Array<T>;  
    // onChange is a function that will be triggered when the selected options change
    onChange?: (selectedOptions: Array<T>) => void;
    // onInputChange is a function that will be triggered when the user change the input value
    onInputChange?: (typedValue: string) => void;
    // Render is a component that will be rendered for each option
    Render: ComponentType<OptionType<T>>;
    onScrollEnd?: () => void;
    loading?: boolean;
}

const MultiSelector = <T extends BaseOption,>({
    options,
    maxSelectableOptions = Infinity,
    defaultSelectedOptions = [],
    onChange,
    onInputChange,
    Render,
    onScrollEnd,
    loading,
}: Props<T>) => {

    const multiSelectorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [selectedOptions, setSelectedOptions] = useState<Array<T>>(defaultSelectedOptions);
    const [showOptions, setShowOptions] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(e.target.value);
        setSearchTerm(e.target.value);
        if (!showOptions) {
            setShowOptions(true);
            inputRef.current?.focus();
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            // if the user previously hided the options, we show them again
            setShowOptions(true);
            console.log('ArrowDown')
            // focus the next option (first if there is no focused option)
            setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, options.length - 1));
        } else if (e.key === 'Backspace' && searchTerm === '' && selectedOptions.length > 0) {
            setSelectedOptions((prevSelected) => prevSelected.slice(0, prevSelected.length - 1));
        }
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && showOptions) {
            setShowOptions(false);
        }
    }
    const onOptionArrowDown = () => {
        setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, options.length - 1));
    }
    const onOptionArrowUp = () => {
        setFocusedIndex((prevIndex) => {
            if (prevIndex === 0 && inputRef.current) {
                inputRef.current?.focus();
            }
            return Math.max(prevIndex - 1, -1)
        });
    }
   const targetRef = useScrollEnd(() => {
        if (onScrollEnd) {
            onScrollEnd()
        }
    });

    useEffect(() => {
        if (selectedOptions.length > maxSelectableOptions) {
            // If the selected options exceed the maxSelectableOptions, we remove the first ones
            setSelectedOptions((prevSelected) => prevSelected.slice(prevSelected.length - maxSelectableOptions));
        } else {
            // inside else block if we do not want to call it when modifing items according to the maxSelectableOptions
            onChange?.(selectedOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (multiSelectorRef.current && !multiSelectorRef.current.contains(e.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [multiSelectorRef]);

    const noResultsFound = searchTerm && !loading && options.length === 0;

    return (
        <div className="flex flex-col gap-2 relative" onKeyDown={onEscape} ref={multiSelectorRef}>
            {/* Input Wrapper */}
            <div className="border-2 border-solid border-gray-400 py-2 px-3 rounded-xl w-full flex items-center gap-2">
                <div className="w-full flex items-center flex-wrap gap-2">
                    {
                    selectedOptions.map((selectedOption) => (
                        <SelectedItem key={selectedOption.id} item={selectedOption} onRemove={() => {
                            setSelectedOptions((prevSelected) => prevSelected.filter((option) => option.id !== selectedOption.id))
                        }} />
                    ))
                }
                <input
                    ref={inputRef}
                    className="flex flex-1 text-sm min-w-8 outline-none h-7"
                    placeholder="Type a character name"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                </div>
                {loading && <MultiSelectLoading />}
                {
                    noResultsFound && (<p className="text-xl scale-150 leading-[0]">🤷‍♂️</p>)
                }
                <button
                    aria-expanded={showOptions}
                    disabled={options.length === 0}
                    onClick={() => setShowOptions((prevShowOptions) => !prevShowOptions)}>
                    <svg clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-all duration-300 ${!showOptions && 'rotate-180'} ${options.length ? 'text-gray-600' : 'text-gray-300'}`}>
                        <path fill="currentColor" d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
                    </svg>
                </button>
            </div>
            {/* Options Wrapper */}
            {(searchTerm && showOptions && options.length > 0) && (
                <div className="absolute z-10 top-full mt-1 border-2 border-solid border-gray-400 overflow-hidden rounded-xl w-full bg-gray-400 max-h-60">
                    {/* Internal wrapper so the scrollbar doesn't affect the border and the options don't come over rounded corners */}
                    <ul className="flex flex-col overflow-auto max-h-60 gap-0.5" ref={targetRef} tabIndex={-1}>
                        {
                        options.map((option, i) => {
                            const selected = selectedOptions.some((selectedOption) => selectedOption.id === option.id);
                            return (
                                <Render
                                    focused={focusedIndex === i}
                                    searchTerm={searchTerm}
                                    key={`option${option.id }`}
                                    setSelected={setSelectedOptions}
                                    option={option}
                                    selected={selected} 
                                    onArrowDown={onOptionArrowDown}
                                    onArrowUp={onOptionArrowUp}
                                />
                            )
                        })
                    }
                    </ul>
                </div>
            )}
            {
                noResultsFound && (<p className="text-sm">No results found :/</p>)
            }
        </div>
    )
}

export default MultiSelector;