import { ComponentType, useEffect, useState } from "react";
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
    // const targetRef = useRef<HTMLDivElement>(null);

    const [selectedOptions, setSelectedOptions] = useState<Array<T>>(defaultSelectedOptions);
    const [showOptions, setShowOptions] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    return (
        <div className="flex relative">
            {/* Input Wrapper */}
            <div className="border-2 border-solid border-gray-400 py-2 px-3 rounded-xl w-full flex items-center gap-2">
                {
                    selectedOptions.map((selectedOption) => (
                        <SelectedItem key={selectedOption.id} item={selectedOption} onRemove={() => {
                            setSelectedOptions((prevSelected) => prevSelected.filter((option) => option.id !== selectedOption.id))
                        }} />
                    ))
                }
                <input
                    className="flex w-full text-sm min-w-8 outline-none h-7"
                    placeholder="Type a character name"
                    onChange={(e) => {
                        onInputChange?.(e.target.value);
                        setSearchTerm(e.target.value);
                    }}
                />
                <button
                    disabled={options.length === 0}
                    onClick={() => setShowOptions((prevShowOptions) => !prevShowOptions)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className={`w-5 h-5 transition-all duration-300 ${!showOptions && 'rotate-180'} ${options.length ? 'text-gray-600' : 'text-gray-300'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" stroke="currentColor" />
                    </svg>
                </button>
            </div>
            {/* Options Wrapper */}
            {
                (searchTerm && showOptions) && (
                    <div className="absolute z-10 top-full mt-1 border-2 border-solid border-gray-400 overflow-hidden rounded-xl w-full bg-gray-400 h-60">
                        {/* Internal wrapper so the scrollbar doesn't affect the border and the options don't come over rounded corners */}
                        <div className="flex flex-col overflow-auto h-60 gap-0.5" ref={targetRef} >
                            {
                            options.map((option) => {
                                const selected = selectedOptions.some((selectedOption) => selectedOption.id === option.id);
                                return (
                                    <Render
                                        searchTerm={searchTerm}
                                        key={`option${option.id }`}
                                        setSelected={setSelectedOptions}
                                        option={option}
                                        selected={selected} />
                                )
                            })
                        }
                        </div>
                        {
                            loading && (<MultiSelectLoading />)
                        }
                    </div>
                )
            }
            
        </div>
    )
}

export default MultiSelector;