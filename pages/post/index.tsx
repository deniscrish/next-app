import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { IUser } from "../../types/user";
import { ITodo } from "../../types/todo";
import styles from "./post.module.scss";
import Link from "next/link";

interface PostPageProps {
  data: IUser[];
}

export default function FirstPost({ data }: PostPageProps) {
  const [count, setCount] = useState<number>(0);
  const [todo, setTodo] = useState<ITodo[] | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      const json: ITodo[] = await response.json();
      setTodo(json);
    }
    load();
  }, []);

  return (
    <Layout title="Post">
      <h1>First Post</h1>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <div className={styles.ulblock}>
        <ul>
          <h4>getServerSideProps</h4>
          {data.map((el, i) => (
            <li key={el.id}>
              <Link href={`/post/[id]`} as={`post/${el.id}`}>
                {i + 1}.&nbsp;
                {el.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul>
          <h4>client side render (useEffect)</h4>
          {todo ? (
            todo.map((el, i) => (
              <li key={el.id}>
                {i + 1}.&nbsp;
                {el.title}
              </li>
            ))
          ) : (
            <p>Loading ...</p>
          )}
        </ul>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const data: IUser[] = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
