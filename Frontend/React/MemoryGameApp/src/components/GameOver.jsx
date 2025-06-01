import RegularButton from './RegularButton';
import { useRef, useEffect } from 'react';

export default function GameOver({ handleClick, finalScore, finalTime }) {
    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.focus();
    }, []);

    return (
        <div className="wrapper wrapper--accent" ref={divRef} tabIndex={-1}>
            <p className="p--large">You've matched all the memory cards!</p>
            <p className="p--regular">Your final score: {finalScore} pairs</p>
            <p className="p--regular">Time taken: {finalTime}</p>
            <RegularButton handleClick={handleClick}>
                Play again
            </RegularButton>
        </div>
    )
}