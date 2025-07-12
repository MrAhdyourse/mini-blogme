import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { Post } from '../../../types/post'

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')

export default function handler(req: NextApiRequest, res: NextApiResponse<Post | { message: string }>) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const postsData = fs.readFileSync(postsFilePath, 'utf-8')
      const posts: Post[] = JSON.parse(postsData)
      const post = posts.find(p => p.id === id)

      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'Post not found.' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to read post.' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
