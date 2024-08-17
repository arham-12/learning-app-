import React, { useState } from "react";
import SearchInput from "./SearchInput";
import axios from "axios";
import LinkCard from "./LinkCard";
import toast from "react-hot-toast";
import Loading from "../Loaiding";

const Search = () => {
  const [searchStart, setsearchStart] = useState(false)
  const [query, setquery] = useState("");
  const [links, setlinks] = useState([]);
  const [loading, setloading] = useState(false)
  const fetchData = () => {
    setloading(true)
    axios
      .post("http://localhost:8000/search_content", { query: query })
      .then((res) => {
        setlinks(res.data);
        setsearchStart(true)
        setloading(false)
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  if(loading){
    return <Loading Text={"Searching"}/>
  }
  return (
    <>
      <div className="search-main overflow-hidden px-5 lg:px-24 min-h-screen flex flex-col items-center pt-40 gap-10">
       <h1 className="text-2xl font-medium">You can search the learning material easily with <strong className="text-primary">SmartLearn AI</strong></h1>
        <div className="searchbar w-full lg:w-[70%] h-12">
          <SearchInput
            value={query}
            onChange={(e) => setquery(e.target.value)}
            fetchData={fetchData}
          />
        </div>
        <div className={`show-data ${searchStart ? "flex" : "hidden"} flex-col justify-center items-center gap-4 rounded-lg border-2 border-primary w-full min-h-[320px] lg:w-[70%] lg:h-auto custom-scrollbar overflow-auto p-5`}>
          {links.length === 0 ? (
            <div>no data</div>
          ) : (
            links.map((link) => {
              return (
                <LinkCard
                  Title={link.title}
                  link={link.link}
                  Image={link.favicon_url}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
