import React from "react";
import {nanoid} from "nanoid";
import {NextRequest, NextResponse} from "next/server";
import * as FirebaseService from "../../../lib/firebase/firebase";
type ResponseData = {
    message?: string,
    error?: string,
    value?: string
}

export async function POST(req: NextRequest): Promise<NextResponse<ResponseData>> {
    const { originalUrl }: any = await req.json();
    if (!originalUrl) {
        return NextResponse.json({error: 'Original URL is required.'}, {status: 400});
    }
    const shortUrl = nanoid(6);
    const promise = await FirebaseService.writeData({originalUrl, shortUrl});
    return NextResponse.json({value: promise}, {status: 200})
}
