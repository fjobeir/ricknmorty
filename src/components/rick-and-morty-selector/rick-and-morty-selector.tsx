import { FC, useMemo, useState } from "react";
// import { ApiResponse, Character, Info, getCharacters } from "rickmortyapi";
import MultiSelector from "../multi-selector/multi-selector";
import RickMortyOptionRow from "./rick-and-morty-option-row";
import useSWRInfinite from "swr/infinite";
import { RMApiResponse, RMCharacter } from "../../types/rick-and-morty";
import fetcher from "../../utils/swr-fetcher";

const getKey = (pageIndex: number, previousPageData: RMApiResponse | null, character: string) => {
  if (!character) return null
  if (previousPageData && !previousPageData.results?.length) return null;
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
        return data?.map((page) => page.results).flat()
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
                <p>Two main components are created</p>
                <ul className="list-outside list-disc">
                    <li><span className="font-bold">MultiSelector</span>: a generic multi selector that has a search field and some event listeners</li>
                    <li><span className="font-bold">RickAndMortySelector</span>: uses the <code className="bg-sky-100 px-2 py-0.5">MultiSelector</code> component to show characters and set which component will be rendered for each option</li>
                </ul>
                <p>Because the case does not mention what should happen when the user checks so many options, I have added an attribute <code className="bg-sky-100 px-2 py-0.5">maxSelectableOptions</code> and set it to 2 in this sample</p>
            </div>
        </div>

    )
}

export default RickAndMortySelector;