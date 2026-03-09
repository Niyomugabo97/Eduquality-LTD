import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        image: "/images/team/stiven.jpg",
        order: 1
      },
      {
        id: "2",
        name: "GUSENGA Benjamin",
        position: "Project Manager",
        image: "/images/team/benjamin.jpg",
        order: 2
      },
      {
        id: "3",
        name: "AKIMANIMPAYE Rachel",
        position: "Secretary",
        image: "/images/team/rachel.jpg",
        order: 3
      },
      {
        id: "4",
        name: "MASENGESHO Bertin",
        position: "Accountant",
        image: "/images/team/bertin.jpg",
        order: 4
      },
      {
        id: "5",
        name: "NIRAGIRE Magnifique",
        position: "IT Specialist",
        image: "/images/team/magnifique.jpg",
        order: 5
      },
      {
        id: "6",
        name: "Sostene BANANAYO",
        position: "Developer",
        image: "/images/team/sostene.jpg",
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
