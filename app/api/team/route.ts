import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teamMembers = await prisma.team.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: teamMembers
    });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    
    // Fallback to hardcoded team data if database fails
    const fallbackTeam = [
      {
        id: "1",
        name: "IRADUKUNDA Stiven",
        position: "Chief Executive Officer",
        image: "/images/worker1.jpg",
        email: "stiven@eduquality.rw",
        phone: "+250788676421",
        order: 1
      },
      {
        id: "2",
        name: "GUSENGA Benjamin",
        position: "Project Manager",
        image: "/images/worker2.jpg",
        email: "benjamin@eduquality.rw",
        phone: "+250788676422",
        order: 2
      },
      {
        id: "3",
        name: "AKIMANIMPAYE Rachel",
        position: "Secretary",
        image: "/images/worker3.jpg",
        email: "rachel@eduquality.rw",
        phone: "+250788676423",
        order: 3
      },
      {
        id: "4",
        name: "MASENGESHO Bertin",
        position: "Accountant",
        image: "/images/worker4.jpg",
        email: "bertin@eduquality.rw",
        phone: "+250788676424",
        order: 4
      },
      {
        id: "5",
        name: "NIRAGIRE Magnifique",
        position: "IT Specialist",
        image: "/images/worker5.jpg",
        email: "magnifique@eduquality.rw",
        phone: "+250788676425",
        order: 5
      },
      {
        id: "6",
        name: "Sostene BANANAYO",
        position: "Developer",
        image: "/images/profile.jpg",
        email: "sostene@eduquality.rw",
        phone: "+250788676426",
        order: 6
      }
    ];

    return NextResponse.json({
      success: true,
      data: fallbackTeam,
      fallback: true
    });
  }
}
