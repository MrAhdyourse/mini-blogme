import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Post } from '../../types/post'

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }
  const res = await fetch(`http://localhost:3000/api/posts/${id}`)
  const post: Post = await res.json()

  return {
    props: {
      post,
    },
  }
}
