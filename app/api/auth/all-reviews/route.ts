// app/api/all-reviews/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET all reviews (public endpoint)
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
            // Removed createdAt as it doesn't exist in User model
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching all reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}