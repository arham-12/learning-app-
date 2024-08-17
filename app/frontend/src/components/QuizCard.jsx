import React, { useState } from "react";

const QuizCard = ({ Submit, quiz }) => {
  const [selectedOption, setSelectedOption] = useState("");

  // Handler to update the selected option
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className="Quiz-1 w-full rounded-lg overflow-hidden relative px-10 py-10 bg-slate-100">
       
        <h1 className="text-lg font-medium pb-5">{quiz.question}</h1>
        <div className="options grid text-[18px] grid-cols-2 gap-2 grid-rows-2">
          <div className="option-1 w-full flex items-start gap-2 ">
            <input
              onClick={handleOptionChange}
              checked={selectedOption === quiz.options.A}
              value={quiz.options.A}
              type="checkbox"
              name="A"
              className="rounded-full border-none w-5 h-5"
            />{" "}
            <p className="w-[90%]">{quiz.options.A}</p>
          </div>
          <div className="option-2 flex items-start gap-2">
            <input
              onClick={handleOptionChange}
              checked={selectedOption === quiz.options.B}
              value={quiz.options.B}
              type="checkbox"
              name="B"
              className="rounded-full border-none w-5 h-5"
            />{" "}
            <p className="w-[90%]">{quiz.options.B}</p>
          </div>
          <div className="option-3 flex items-start gap-2">
            <input
              onClick={handleOptionChange}
              checked={selectedOption === quiz.options.C}
              value={quiz.options.C}
              type="checkbox"
              name="C"
              className="rounded-full border-none w-5 h-5"
            />{" "}
            <p className="w-[90%]">{quiz.options.C}</p>
          </div>
          <div className="option-4 flex items-start gap-2">
            <input
              onChange={handleOptionChange}
              checked={selectedOption === quiz.options.D}
              value={quiz.options.D}
              type="checkbox"
              name="D"
              className="rounded-full border-none w-5 h-5"
            />{" "}
            <p className="w-[90%]">{quiz.options.D}</p>
          </div>
        </div>
        <div
          className={`static ${
            selectedOption === quiz.correctAnswer
              ? "bg-green-500"
              : "bg-red-500"
          } ${
            Submit ? "block" : "hidden"
          } top-0 right-0 p-3 text-sm mt-5 rounded-lg text-white`}
        >
          Correct Option : {quiz.correctAnswer}
          {selectedOption === quiz.correctAnswer ? "✔" : "x"}
        </div>
      </div>
    </>
  );
};

export default QuizCard;
