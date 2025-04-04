import React, { useState } from 'react'


const index = () => {
  
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [fileContent, setFileContent] = useState("")
  const [fileContent2, setFileContent2] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    setInputText2(inputText);
    setFileContent("Loading...");
    e.preventDefault();
    if (inputText.trim() == "") {
      alert('Please enter a query');
      return;
    }
    
    handleOverwrite();
  };

const fetchRawFileContent = async () => {
  try {
      const response = await fetch('/api/overwrite-file');
      const data = await response.json();

      if (response.ok) {
          return data.content;
      } else {
          return data.error;
      }
  } catch (err) {
      return "Error fetching file.";
  }
};

const handleOverwrite = async () => {
  setInputText2(inputText);

  await fetch("/api/overwrite-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newContent: inputText }),
  });

  setInputText('');
  setFileContent("Loading...");

  let previousContent = fileContent;
  let newContent = fileContent;

  while (previousContent === newContent) {
      await new Promise(resolve => setTimeout(resolve, 200)); 
      newContent = await fetchRawFileContent();
  }

  setFileContent(newContent); // Update only when new content is different
};


  return (
    <>
    <div className='-mt-2 py-4 pl-4 text-[#ededed] h-20 font-extralight opacity-[0.60] border-b-[1px] border-[#ededed]/20'><img className='h-14' src='logo.png'/></div>
    <div className='w-[900px] flex ml-[330px] justify-end'><div className={`mt-8 text-[#ededed] font-extralight text-lg opacity-[0.80] rounded-full items-center max-w-[400px] py-1 px-6 break-words whitespace-normal ${inputText2.length > 0 ? 'bg-[#393939]' : 'bg-[#242424]'}`}>{inputText2}</div></div>
    <div className='mt-8 text-[#ededed] w-[900px] flex ml-[330px] font-extralight text-lg opacity-[0.80]'>{fileContent}</div>
    <form onSubmit={handleSubmit}  className='flex h-screen justify-center items-end pb-8 gap-2 fixed bottom-2 object-center w-full'>
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className='bg-[#393939] outline-0 px-5 text-[#ededed] rounded-full h-11 py-1 items-center w-[800px] flex justify-end text-sm border-0' placeholder='Ask me anything'/>
        <button type='submit' onClick={handleOverwrite} className='bg-[#393939] text-[#ededed] rounded-full h-10 w-24 flex justify-center font-extralight items-center text-md border-0'>Send</button>
    </form>
    </>
  )
}

export default index
