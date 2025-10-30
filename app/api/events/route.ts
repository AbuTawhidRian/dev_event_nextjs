import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await c
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message:'Event creation failed ', error: err instanceof Error ? err.message: 'Unknown'
        })
        
    }
}