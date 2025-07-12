import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { Post } from '../../types/post'

const postsFilePath = path.join(process.cwd(), 'data', 'posts.json')

export default function handler(req: NextApiRequest, res: NextApiResponse<Post[] | Post | { message: string }>) {
  if (req.method === 'GET') {
    try {
      const postsData = fs.readFileSync(postsFilePath, 'utf-8')
      const posts: Post[] = JSON.parse(postsData)
      res.status(200).json(posts)
    } catch (error) {
      res.status(500).json({ message: 'Failed to read posts.' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content } = req.body
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' })
      }

      const postsData = fs.readFileSync(postsFilePath, 'utf-8')
      const posts: Post[] = JSON.parse(postsData)

      const newPost: Post = {
        id: Date.now().toString(), // Simple unique ID
        title,
        content,
        createdAt: new Date().toISOString(),
      }

      posts.push(newPost)
      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2))

      res.status(201).json(newPost)
    } catch (error) {
      res.status(500).json({ message: 'Failed to create post.' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
