import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import randomWord from "random-words";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import shuffleArray from "./functions/shuffleArray";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWordChecker } from "react-word-checker";

const initialValues = {
    word: [],
    temp: [],
    score: 0,
    win: false,
    steps: 0,
};

function App() {
    const [setup, setSetup] = useState(initialValues);
    const { word, temp, score, win, steps } = setup;

    const { wordExists } = useWordChecker("en");
    useEffect(() => {
        setNewWord();
        if (getData()) {
            setSetup(getData());
        }
    }, []);

    useEffect(() => {
        console.log("WORD: " + word);
        checkWin();
    }, [temp]);

    let wordLen = 3;
    const setNewWord = () => {
        if (score >= 0 && score <= 10) {
            wordLen = 4;
        } else if (score > 10 && score <= 15) {
            wordLen = 5;
        } else if (score > 15 && score <= 20) {
            wordLen = 6;
        } else {
            wordLen = 7;
        }
        const newWordArr = randomWord({
            exactly: 1,
            maxLength: wordLen,
            minLength: wordLen,
        })[0]
            .toUpperCase()
            .split("");
        //show shuffleArray to the user
        const randomARR = shuffleArray([...newWordArr]);
        setSetup((prev) => ({ ...prev, word: newWordArr, temp: randomARR }));

        if (randomARR.join("") === newWordArr.join("")) {
            setNewWord();
        }
    };

    const updateDrag = (param) => {
        const sourceIndex = param.source.index;
        const destIndex = param.destination.index;
        const tempWord = [...temp];
        tempWord.splice(destIndex, 0, tempWord.splice(sourceIndex, 1)[0]);
        if (tempWord.join("") !== [...temp].join("")) {
            if (word.length - 1 === steps && word.length > 1) {
                toast(`GAME OVER `);
                setData();
                if (window.confirm("Are you sure you want to start again?")) {
                    window.location.reload();
                }
            } else {
                const result = { ...setup, steps: steps + 1, temp: tempWord };
                setData(result);
                setSetup(result);
            }
        }
    };

    const setData = (data = "") => {
        localStorage.setItem("spellGame", JSON.stringify(data));
    };
    const getData = () => {
        return localStorage.getItem("spellGame")
            ? JSON.parse(localStorage.getItem("spellGame"))
            : false;
    };
    const checkWin = () => {
        if (steps > 0) {
            const arr1 = [...temp];
            const arr2 = [...word];

            if (arr1.join("") === arr2.join("") || wordExists(arr1.join(""))) {
                toast(`Correct: ${arr1.join("")}`);
                setSetup({ ...setup, score: score + 1, win: true, steps: 0 });
                setNewWord();
            } else {
                if (word.length - 1 === steps) {
                    toast(`GAME OVER `);
                     if (
                         window.confirm("Are you sure you want to start again?")
                     ) {

                         window.location.reload();
                         setData();
                     }
                }
                setSetup({ ...setup, win: false });
            }
        }
    };
    return (
        <>
            <div
                className="container d-flex flex-column justify-content-center align-items-center border position-relative gap-5"
                style={{ height: "100vh" }}
            >
                <div
                    className="position-absolute"
                    style={{ right: "30px", top: "30px" }}
                >
                    <button className="btn btn-primary text-light" disabled>
                        {steps}/{word.length - 1} steps Left
                    </button>
                </div>
                <div
                    className="position-absolute"
                    style={{ left: "30px", top: "30px" }}
                >
                    <button
                        className="btn btn-outline-light text-primary border border-primary"
                        disabled
                    >
                        <h5 className="mb-0">
                            Score: <span className="text-danger">{score}</span>{" "}
                        </h5>
                    </button>
                </div>

                <h3 className="text-primary">
                    WORD
                    <span className="text-danger"> SCRAMBLER</span>
                </h3>

                <DragDropContext onDragEnd={(param) => updateDrag(param)}>
                    <Droppable droppableId="droppable-1" direction="horizontal">
                        {(provided, _) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="gap-4 d-flex flex-row justify-content-center border p-3"
                            >
                                {temp?.map((char, i) => {
                                    return (
                                        <Draggable
                                            key={"key" + i}
                                            draggableId={"draggable" + i}
                                            index={i}
                                            isDragDisabled={
                                                word.length - 1 === steps &&
                                                word.length > 1
                                            }
                                        >
                                            {(provided, snapshot) => (
                                                <>
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided
                                                                .draggableProps
                                                                .style,
                                                            boxShadow:
                                                                snapshot.isDragging
                                                                    ? "0 0 .4rem #666"
                                                                    : "none",
                                                            background:
                                                                snapshot.isDragging
                                                                    ? "red"
                                                                    : "initial",
                                                            color: snapshot.isDragging
                                                                ? "white"
                                                                : "initial",
                                                        }}
                                                    >
                                                        <Card
                                                            char={char}
                                                            win={win}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <ToastContainer />
        </>
    );
}

export default App;
