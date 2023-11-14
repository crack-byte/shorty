"use client"
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function Hash({params}: { params: { hash: string } }) {
    const router = useRouter();
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (redirect) {
             getUrl(params.hash);
        }
    }, [redirect])
    setTimeout(() => {
        setRedirect(true)
    }, 1000)

    return (
        <>
            <p>Redirecting......</p>
        </>
    )
}
const getUrl = (value: string) => {
    try {
        const params = {
            hash: value,
        };
        axios.get('/api/shorten', {params})
    } catch (error) {
        return '';
    }
};