import Head from 'next/head'
import Image from 'next/future/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Outdoor.sy</title>
        <meta name="description" content="outdoorsy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.invite}>
        <a title="Request access to outdoor.sy" href="#">
          request access
        </a>
      </main>
    </div>
  )
}
