import { FC, useMemo, useState } from "react";
import MultiSelector from "../multi-selector/multi-selector";
import RickMortyOptionRow from "./rick-and-morty-option-row";
import useSWRInfinite from "swr/infinite";
import { RMApiResponse, RMCharacter } from "../../types/rick-and-morty";
import fetcher from "../../utils/swr-fetcher";

const getKey = (pageIndex: number, previousPageData: RMApiResponse | null, character: string) => {
  if (!character) return null
  if (previousPageData && !previousPageData?.results?.length) return null;
  return `https://rickandmortyapi.com/api/character?name=${character}&page=${pageIndex + 1}`
}

const RickAndMortySelector: FC = () => {
    const [character, setCharacter] = useState<string>("");
    const { data, isLoading, setSize, size } = useSWRInfinite<RMApiResponse>(
        (index, prevData) => getKey(index, prevData, character), fetcher, {
            revalidateFirstPage: false,
        });

    const pagesCount = useMemo(() => data?.[0]?.info?.pages, [data]);

    const allCharacters = useMemo(() => {
        return data?.map((page) => page?.results ?? []).flat() ?? []
    }, [data]);

    return (
        <div className="flex flex-col gap-10 my-20 px-2 m-auto max-w-2xl">
            <MultiSelector
                options={allCharacters as Array<RMCharacter> || []}
                onInputChange={(value) => {
                    setCharacter(value)
                    // Reset the page when the user types (the character is changed)
                    setSize(1)
                }}
                Render={RickMortyOptionRow}
                maxSelectableOptions={2}
                onScrollEnd={() => {
                    if ((pagesCount ?? 0) > size) {
                        setSize(size + 1)
                    }
                }}
                loading={isLoading}
            />
            <div className="flex flex-col gap-3">
                <h4 className="font-bold">Two main components are created</h4>
                <ul className="list-inside list-disc">
                    <li><span className="font-bold">MultiSelector</span>: a generic multi selector that has a search field, some event listeners and the required state management to store (and pass) the selected options</li>
                    <li><span className="font-bold">RickAndMortySelector</span>: uses the <code className="bg-sky-100 px-2 py-0.5">MultiSelector</code> component to show characters and set which component will be rendered for each option</li>
                </ul>
                <p>So basically I wanted to introduce a skeleton of a multi selector that can be used in different ways where RickAndMortySelector is an example</p>
                <p>Because the case does not mention what should happen when the user checks so many options, I have added the property <code className="bg-sky-100 px-2 py-0.5">maxSelectableOptions</code> and set it to 2 in this sample</p>
                <h4 className="font-bold">Keyboard Events</h4>
                <ul className="list-inside list-disc">
                    <li>Escape: Hide the options list</li>
                    <li>Arrow Down: Focus the next option</li>
                    <li>Arrow Up: Focus the previous option</li>
                    <li>Space: Select the focused option</li>
                </ul>
            </div>
        </div>

    )
}

export default RickAndMortySelector;