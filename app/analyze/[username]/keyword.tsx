"use client";
import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

function Keyword() {
    const [keyword, setKeyword] = React.useState('');

    return (
        <div>
            <Input onInput={(e) => setKeyword(e.currentTarget.value)} value={keyword} placeholder="Enter keyword for analysis" className="w-full"/>
            <Button onClick={()=>{

            }}/>
        </div>
    );
}

export default Keyword;