import React, { useEffect, useState } from "react";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputNote, setInputNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = "http://127.0.0.1:5000/api/v1/todolists";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setFilteredTodos(data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const addTodo = () => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        todolist: {
          title: inputTitle,
          note: inputNote,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        const data = {
          title: inputTitle,
          note: inputNote,
        };
        setTodos([...todos, data]);
        applyFilter(filterStatus);
        setInputTitle("");
        setInputNote("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTitle = (event) => {
    setInputTitle(event.target.value);
  };

  const handleNote = (event) => {
    setInputNote(event.target.value);
  };

  const toggledata = () => {
    setToggle(!toggle);
  };

  const handleAddTodo = () => {
    addTodo();
  };

  const handleFilter = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    applyFilter(status);
  };

  const applyFilter = (status) => {
    let filteredData = todos;
    if (status === "active") {
      filteredData = todos.filter((todo) => !todo.completed);
    } else if (status === "complete") {
      filteredData = todos.filter((todo) => todo.completed);
    }
    setFilteredTodos(filteredData);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applySearch(term);
  };

  const applySearch = (term) => {
    let filteredData = todos;
    if (term !== "") {
      filteredData = todos.filter((todo) =>
        todo.title.toLowerCase().includes(term.toLowerCase())
      );
    }
    setFilteredTodos(filteredData);
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  useEffect(() => {
    applyFilter(filterStatus);
  }, [todos, filterStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid" id="Container">
      <h1 className="text-center mt-4 mb-5">Todo List</h1>

      <div className="row" id="searchRow">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control search-task rounded-pill"
            placeholder="Search tasks here..."
            value={searchTerm}
            onChange={handleSearch}
            id="searchInput"
          />
        </div>
      </div>
      <div className="text-center mt-5">
        <button
          className="btn btn-dark mb-3 rounded-pill"
          id="show-btn"
          onClick={toggledata}
        >
          {toggle ? "Hide Todo" : "Create Todo"}
        </button>
      </div>
      {toggle && (
        <>
          <div className="row mt-4" id="titleRow">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control add-task"
                placeholder="Add title"
                value={inputTitle}
                onChange={handleTitle}
              />
            </div>
          </div>
          <div className="row mt-4" id="titleRow">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control add-task"
                placeholder="Add Note"
                value={inputNote}
                onChange={handleNote}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6" id="btnCol">
              <button
                className="btn btn-dark rounded-pill"
                onClick={handleAddTodo}
              >
                Add Todo
              </button>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={handleFilter}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
        </>
      )}
      <div className="row mt-4">
        <div className="col-md-12 mt-4" id="tablecol">
          {filteredTodos.length > 0 ? (
            <table className="table w-75" id="Table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Note</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.map((todo, index) => (
                  <tr key={index}>
                    <td>{todo.title}</td>
                    <td>{todo.note}</td>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(index)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No todos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
