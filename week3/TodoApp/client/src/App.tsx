import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";

interface Todo {
  id: number;
  title: string;
}

function App() {
  const [todo, setTodo] = useState({
    title: "",
  });

  const [todoList, setTodoList] = useState<Todo[]>([]);

  const updateTodo = async (id: number) => {
    if (todo.title == "") {
      alert("Please add updated todo title");
      return;
    }
    const data = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const json = await data.json();
    setTodoList(json);
    setTodo({ ...todo, title: "" });
  };

  const deleteTodo = async (id: number) => {
    console.log(todo);
    const data = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await data.json();
    setTodoList(json);
  };

  const addTodo = () => {
    console.log(todo);
    fetch("http://localhost:3000/addTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then((resp) => {
      return console.log(resp.json());
    });
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("http://localhost:3000/todos", {
        method: "GET",
      });
      const json = await data.json();
      setTodoList(json);
    };
    getData();
  }, []);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-2/5 p-3">
          <h1 className="text-3xl text-center">Todo App</h1>
          <form className="flex p-3" action="">
            <input
              className="w-4/5 p-2 border border-black focus:outline-none"
              placeholder="add todo"
              type="text"
              onChange={(e) => setTodo({ title: e.target.value })}
            />
            <button
              className="w-1/5 p-2 mx-1 border border-black"
              onClick={() => addTodo()}
            >
              Add
            </button>
          </form>
          {todoList.map((todo) => (
            <div
              key={todo.id}
              className="flex ml-3 mr-4 px-1 py-2 my-1 border border-black justify-between"
            >
              <h1 className="text-md font-medium">{todo.title}</h1>
              <div className="flex">
                <MdModeEdit
                  className="text-2xl text-sky-500"
                  onClick={() => updateTodo(todo.id)}
                />
                <MdDelete
                  className="text-2xl text-red-500"
                  onClick={() => deleteTodo(todo.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
