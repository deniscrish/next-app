import Head from "next/head";
import Image from "next/image";
import styles from "./Layout.module.scss";
import Link from "next/link";
import skolName from "../../public/images/Skoltech-name.png";

export default function Layout({
  children,
  title = "Home",
}: {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
}) {
  const titleText = `${title} | Next App`;
  return (
    <>
      <Head>
        <title>{titleText}</title>
        <link rel="icon" href="/images/sk2-logo.png" />
        <meta name="keywords" content="Map, nextjs, demo app, typescript" />
        <meta name="description" content="Demo app with Map" />
        <meta charSet="utf-8" />
      </Head>
      <nav className={styles.navigation}>
        <Image src={skolName} alt="Skoltech" height={50} />
        <div>
          <Link href={"/"} className={styles.link}>
            Home
          </Link>
          <Link href="/post" className={styles.link}>
            Post
          </Link>
          <Link href="/map" className={styles.link}>
            Map
          </Link>
          <Link
            href="https://www.skoltech.ru/"
            target="_blank"
            className={styles.link}
          >
            About
          </Link>
        </div>
      </nav>
      <main
        className={title === "Map" ? styles.containerMap : styles.container}
      >
        {children}
      </main>
    </>
  );
}
