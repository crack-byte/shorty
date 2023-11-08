'use client'
import React, {useState} from "react";
import axios from "axios";

const isURI = (text: string) => {
    const regex = /^(http|https|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1,3})(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return !regex.test(text);
};
const InputWithIcon = ({...props}) => {


    return (
        <div className="relative">
            <input {...props} readOnly
                   className="w-full border rounded-md p-2 appearance-none block bg-gray-200 text-gray-700  border-gray-200  py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
            <span className="absolute top-0 right-0 flex items-center justify-center h-full w-10 cursor-pointer"
                  onClick={props.onCopy}>
                <svg className="hover:stroke-black hover:stroke-1 active:stroke-blue-500" width="800px" height="800px"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z"
                    />
                </svg>
            </span>
        </div>
    );
};
export default function Form() {
    const [originalUrl, setOriginalUrl] = React.useState('');
    const [shortUrl, setShortUrl] = React.useState('');
    const [error, setError] = React.useState('');
    const baseDomain = process.env.baseDomain
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/shorten', {originalUrl});
            const shortenedUrl = response.data.value;
            setShortUrl(shortenedUrl);
        } catch (error) {
            setError('An error occurred while shortening the URL.');
        }
    };
    const [isCopied, setIsCopied] = useState(false);
    const copy = () => {

        navigator.clipboard.writeText(shortUrl);
        console.log(shortUrl)
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 10000);
    };
    let onTextChange = (event: any) => {
        setOriginalUrl(event.target.value)
        if (isURI(originalUrl)) {
            setError('Please fill out this field.')
        } else {
            setError('')
        }
    };
    return (
        <>
            <form className="w-5/12 ">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-first-name">
                            Paste your URL
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name" type="text" placeholder="http://xyz.com/abc/...." value={originalUrl}
                            onChange={onTextChange}/>
                        {error && <p className="text-red-500 text-xs italic">Please fill out this field.</p>}
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="flex items-center justify-between px-3">
                        <button
                            className="bg-gray-300 hover:bg-blue-500 text-blue-600 hover:text-gray-50 active:bg-violet-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button" onClick={handleSubmit} disabled={error !== ''}>
                            Generate Short Url
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-3/6 pr-1 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-last-name">
                            Domain
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-not-allowed"
                            id="grid-last-name" type="text" value={baseDomain} disabled/>
                    </div>
                    <div className="w-0 mb-0 mt-8">
                        /
                    </div>
                    <div className="w-3/6 pl-3 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-last-name">
                            Path
                        </label>
                        <InputWithIcon type="text" value={shortUrl}
                                       onCopy={copy}/>
                        {isCopied && <label className="absolute right-0 text-red-500">copied!</label>}
                    </div>


                </div>
            </form>
        </>
    )
}
