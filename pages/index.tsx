import Head from 'next/head'
import Link from 'next/link'
import { Post } from '../types/post'
import { GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <div>
      <Head>
        <title>Mini Blog</title>
        <meta name="description" content="A mini blog application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mt-5">
        <h1 className="text-center mb-4">Welcome to Mini Blog!</h1>
        <p className="text-center">This is your personal mini blog. Start writing!</p>

        <div className="d-flex justify-content-end mb-3">
          <Link href="/new-post">
            <a className="btn btn-primary">Create New Post</a>
          </Link>
        </div>

        <div className="row">
          {posts.length === 0 ? (
            <p className="text-center">No posts yet. Create one!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.content.substring(0, 100)}...</p>
                    <Link href={`/posts/${post.id}`}>
                      <a className="btn btn-sm btn-outline-primary">Read More</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')
  let posts: Post[] = []

  try {
    const postsData = fs.readFileSync(postsFilePath, 'utf-8')
    posts = JSON.parse(postsData)
  } catch (error) {
    console.error('Failed to read posts data:', error)
  }

  return {
    props: {
      posts,
    },
  }
}
