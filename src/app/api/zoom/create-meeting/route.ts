import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { zoomService } from "@/lib/zoom";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { sessionId, topic, duration, startTime } = body;

        if (!sessionId || !topic || !duration || !startTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify the session belongs to the instructor
        const classSession = await prisma.classSession.findUnique({
            where: { id: sessionId },
            include: { class: { include: { instructor: true } } }
        });

        if (!classSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (classSession.class.instructor.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Create Zoom meeting
        const meeting = await zoomService.createMeeting({
            topic,
            duration,
            startTime: new Date(startTime),
            agenda: `AviatorTutor Session: ${topic}`
        });

        // Update the session with Zoom details
        await prisma.classSession.update({
            where: { id: sessionId },
            data: {
                zoomMeetingId: meeting.meetingId,
                zoomJoinUrl: meeting.joinUrl,
                zoomStartUrl: meeting.hostUrl,
                zoomPassword: meeting.password
            }
        });

        return NextResponse.json({
            success: true,
            meeting: {
                meetingId: meeting.meetingId,
                joinUrl: meeting.joinUrl,
                hostUrl: meeting.hostUrl
            }
        });
    } catch (error) {
        console.error("[Zoom API] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
