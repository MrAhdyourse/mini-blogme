import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Post } from '../../types/post'
import fs from 'fs'
import path from 'path'

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  if (!post) {
    return <p className="text-center mt-5">Post not found.</p>;
  }

  return (
    <div>
      <Head>
        <title>{post.title} - Mini Blog</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Head>

      <main className="container mt-5">
        <h1 className="mb-4">{post.title}</h1>
        <p className="text-muted">Published: {new Date(post.createdAt).toLocaleDateString()}</p>
        <hr />
        <p>{post.content}</p>
        <Link href="/">
          <a className="btn btn-secondary mt-4">Back to Home</a>
        </Link>
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')
  let posts: Post[] = []

  try {
    const postsData = fs.readFileSync(postsFilePath, 'utf-8')
    posts = JSON.parse(postsData)
  } catch (error) {
    console.error('Failed to read posts data for static paths:', error)
  }

  const paths = posts.map(post => ({
    params: { id: post.id },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<PostDetailProps> = async (context) => {
  const { id } = context.params as { id: string }
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')
  let posts: Post[] = []

  try {
    const postsData = fs.readFileSync(postsFilePath, 'utf-8')
    posts = JSON.parse(postsData)
  } catch (error) {
    console.error('Failed to read posts data for static props:', error)
  }

  const post = posts.find(p => p.id === id)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}