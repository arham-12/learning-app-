import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import QuizCard from "./QuizCard";
import Loading from "./Loaiding";

const Quiz = () => {
  const [quizes, setquizes] = useState([]);
  const [inputs, setinputs] = useState({ topic: "", num_questions: 0 });
const [loading, setloading] = useState(false)
  const [submit, setsubmit] = useState(false);
 const [correctOptions, setcorrectOptions] = useState([]);

  const changeHandler = (e) => {
    setinputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    setloading(true);
    axios
      .post("http://localhost:8000/generate_quiz", inputs)
      .then(async (res) => {
        // Check if res.data is an object and has the 'response' field
        if (
          typeof res.data === "object" &&
          res.data.response &&
          res.statusText === "OK"
        ) {
          // Extract the JSON string from the response field
          const responseText = res.data.response;

          // Find the start and end positions of the JSON content in the responseText
          const jsonStart = responseText.indexOf("{");
          const jsonEnd = responseText.lastIndexOf("}") + 1;

          if (jsonStart !== -1 && jsonEnd !== -1) {
            // Extract the JSON part
            const jsonString = responseText.substring(jsonStart, jsonEnd);

            try {
              // Parse the extracted JSON string
              const jsonData = JSON.parse(jsonString);
              setquizes(jsonData.questions);
             await quizes.forEach((q,i) => correctOptions.push(jsonData.questions[i].correctAnswer));
              setloading(false);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              setloading(false);
            }
          } else {
            toast.error(res.data.response);
            setloading(false);
          }
        } else {
          toast.error("Invalid response format.");
          setloading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setloading(false);
      });
  };

if(loading) return  <div className="top-0 absolute w-full h-screen text-black"><Loading Text={"Generating..."}/></div>

  return (
    <>
      <div className=" w-[70%] py-24 min-h-screen mx-auto rounded-lg">
        <div className="quiz-section py-5 bg-white h-aato px-16">
          <h1 className="text-center text-4xl font-medium w-[60%] mx-auto py-10">
            Enter Quiz Topic And Number of Questions
          </h1>
          <div className="quz-topic-input w-full flex justify-center items-center gap-5">
            <input
              placeholder="Enter Topic"
              className="bg-slate-100 outline-none w-[50%] text-sm py-2 px-3 rounded-lg border border-primary"
              type="text"
              name="topic"
              onChange={changeHandler}
              value={inputs.topic}
            />
            <input
              placeholder="Enter No of Quiz"
              className="bg-slate-100 outline-none w-[30%] text-sm py-2 px-3 rounded-lg border border-primary"
              type="number"
              name="num_questions"
              onChange={changeHandler}
              value={inputs.num_questions}
            />
            <button
              onClick={submitHandler}
              className="Genrate-btn w-[20%] py-2 px-10 border-2 text-white border-primary rounded-lg flex items-center justify-center gap-2 transition-all bg-primary hover:bg-transparent hover:text-black"
            >
              Generate
            </button>
          </div>
          <div className="quiz-genrated-question flex flex-col gap-5 h-auto w-full my-10 rounded-lg">
            {quizes.map((quiz, index) => {
              return <QuizCard key={index} Submit={submit} quiz={quiz} />;
            })}
            <div
              className={`submit-quiz ${
                quizes.length === 0 ? "hidden" : "flex"
              } justify-center gap-4 w-full`}
            >
              <button
                onClick={() => {
                  setsubmit(true);
                }}
                className=" w-[40%] text-center py-2 px-10 border-2 text-white border-primary rounded-lg gap-2 transition-all bg-primary hover:bg-transparent hover:text-black"
              >
                Submit
              </button>
            </div>
            {/* <div className="Quiz-1 w-full relative px-10 py-10 bg-slate-100 rounded-md overflow-hidden">
              <div
                className={`absolute ${
                  selectedOption === "Python" ? "bg-green-500" : "bg-red-500"
                } top-0 right-0 text-2xl p-3 text-white`}
              >
                x
              </div>
              <h1 className="text-lg font-medium pb-5">What you like</h1>
              <div className="options grid text-[18px] grid-cols-2 gap-2 grid-rows-2">
                <div className="option-1 w-full flex items-start gap-2 ">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Web"}
                    value={"Web"}
                    type="checkbox"
                    name="A"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Web</p>
                </div>
                <div className="option-2 flex items-start gap-2">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Word"}
                    value={"Word"}
                    type="checkbox"
                    name="B"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Word</p>
                </div>
                <div className="option-3 flex items-start gap-2">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Python"}
                    value={"Python"}
                    type="checkbox"
                    name="C"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Python</p>
                </div>
                <div className="option-4 flex items-start gap-2">
                  <input
                    onChange={handleOptionChange}
                    checked={selectedOption === "Dev"}
                    value={"Dev"}
                    type="checkbox"
                    name="D"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Dev</p>
                </div>
              </div>
            </div>
            <div className="Quiz-1 w-full relative px-10 py-10 bg-slate-100 rounded-md overflow-hidden">
              <div
                className={`absolute ${
                  selectedOption === "Python" ? "bg-green-500" : "bg-red-500"
                } top-0 right-0 text-2xl p-3 text-white`}
              >
                x
              </div>
              <h1 className="text-lg font-medium pb-5">What you like</h1>
              <div className="options grid text-[18px] grid-cols-2 gap-2 grid-rows-2">
                <div className="option-1 w-full flex items-start gap-2 ">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Web"}
                    value={"Web"}
                    type="checkbox"
                    name="A"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Web</p>
                </div>
                <div className="option-2 flex items-start gap-2">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Word"}
                    value={"Word"}
                    type="checkbox"
                    name="B"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Word</p>
                </div>
                <div className="option-3 flex items-start gap-2">
                  <input
                    onClick={handleOptionChange}
                    checked={selectedOption === "Python"}
                    value={"Python"}
                    type="checkbox"
                    name="C"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Python</p>
                </div>
                <div className="option-4 flex items-start gap-2">
                  <input
                    onChange={handleOptionChange}
                    checked={selectedOption === "Dev"}
                    value={"Dev"}
                    type="checkbox"
                    name="D"
                    className="rounded-full border-none w-5 h-5"
                  />{" "}
                  <p className="w-[90%]">Dev</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
