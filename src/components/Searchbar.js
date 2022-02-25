import { React, useState } from "react";
import { useDebounce } from "../hooks/debounceHook";
import "./Searchbar.css";

function SearchBar({ placeholder }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const isEmpty = !data || data.length === 0;
  const noSearch = !searchQuery;

  const changeHandler = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    if (!searchQuery) {
      setData([]);
    }
  };

  const prepareSearchQuery = (query) => {
    const url = `https://api.github.com/search/users?q=${query}`;
    return encodeURI(url);
  };

  const searchProfile = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;
    setLoading(true);
    const URL = prepareSearchQuery(searchQuery);
    await fetch(URL)
      .then((res) => res.json())
      .then((data) => setData(data.items))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  useDebounce(searchQuery, 700, searchProfile);

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={changeHandler}
        ></input>
      </div>
      {isLoading && (
        <div className="dataResult">
          <p className="text">Loading!</p>
        </div>
      )}
      {!isLoading && isEmpty && !noSearch && (
        <div className="dataResult">
          <p className="text">no github profile found!</p>
        </div>
      )}
      {!isLoading && noSearch && (
        <div className="dataResult">
          <p className="text">start typing</p>
        </div>
      )}
      {!isLoading && !isEmpty && !noSearch && (
        <div className="dataResult">
          {data.map((value, key) => {
            return (
              <a
                key={value.id}
                className="dataItem"
                href={value.html_url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="avatarContainer">
                  <img src={value.avatar_url} alt="avatar"></img>
                </div>
                <p>{value.login}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
