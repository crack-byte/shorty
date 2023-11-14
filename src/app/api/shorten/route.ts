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
    const {originalUrl}: any = await req.json();
    if (!originalUrl) {
        return NextResponse.json({error: 'Original URL is required.'}, {status: 400});
    }
    const shortUrl = nanoid(6);
    const promise = await FirebaseService.writeData({originalUrl, shortUrl});
    return NextResponse.json({value: promise}, {status: 200})
}

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
    const params = await req.nextUrl.searchParams;
    const hash:any = params.get("hash");
    try {
        const doc = await FirebaseService.findMapping("shortUrl", hash);
        const parsedUrl = new URL(doc.data().originalUrl);
        console.log(parsedUrl)

        const nextResponse = NextResponse.redirect(parsedUrl);
        nextResponse.headers.set('Access-Control-Allow-Origin', '*')
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        return nextResponse;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
