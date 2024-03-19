import Link from "next/link";
import Layout from "../../components/Layout/Layout";
import { IUser } from "../../types/user";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

interface UserPageProps {
  user: IUser;
}

export default function Post({ user: serverUser }: UserPageProps) {
  const [user, setUser] = useState(serverUser);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${router.query.id}`
      );
      const data: IUser = await res.json();
      setUser(data);
    }

    if (!serverUser) {
      load();
    }
  }, [serverUser,router.query.id]);

  if (!user) {
    return (
      <Layout>
        <p>Loading ...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>{user.name}</h1>
      <hr />
      <p>{user.email}</p>
      <Link href="/post">Back to all users</Link>
    </Layout>
  );
}

interface UserNextPageContext extends NextPageContext {
  query: {
    id: string;
  };
}

export async function getServerSideProps({ query }: UserNextPageContext) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${query.id}`
  );
  const user: IUser = await res.json();
  return { props: { user } };
}

// Post.getInitialProps = async ({ query, req }: any) => {
//   if (!req) {
//     return {
//       user: null,
//     };
//   }
//   const res = await fetch(
//     `https://jsonplaceholder.typicode.com/users/${query.id}`
//   );
//   const user = await res.json();
//   return { user };
// };
