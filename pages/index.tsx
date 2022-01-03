import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1 className="title">
          <Link href="/home">
            <a>Home</a>
          </Link>
        </h1>
      </main>

      <footer>footer</footer>
    </>
  )
}

export default Home
