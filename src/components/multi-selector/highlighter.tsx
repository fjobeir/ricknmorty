import { ReactNode } from 'react';

function highlightSubstring(originalString: string, substring: string): ReactNode {
    const index = originalString.toLowerCase().indexOf(substring.toLowerCase());
    if (index !== -1) {
        const before = originalString.substr(0, index);
        const highlightedPart = originalString.substr(index, substring.length);
        const after = originalString.substr(index + substring.length);
        return (
            <>
                {before}
                <span className='font-bold'>{highlightedPart}</span>
                {after}
            </>
        );
    }
    return originalString;
}

export default highlightSubstring;