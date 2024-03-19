import Link from "next/link";
import Layout from "../components/Layout/Layout";
import styles from "../styles/error.module.scss";

export default function ErrorPage() {
  return (
    <Layout>
      <h1 className={styles.error}>Error 404</h1>
      <p>
        Please <Link href="/">go back</Link> to safety
      </p>
    </Layout>
  );
}
