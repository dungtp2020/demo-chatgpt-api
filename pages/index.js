import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [numberImage, setNumberImage] = useState("");
  const [result, setResult] = useState();
  const [waiting, setWaiting] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setResult();
      setWaiting('Waiting to create pictures...');
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          animal: animalInput ,
          numberImage: numberImage 
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setWaiting('');
      setResult(data.result);
      //setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Enter the content of the image you want to create</h3>
        <form onSubmit={onSubmit}>
          <textarea value={animalInput} onChange={(e) => setAnimalInput(e.target.value)} rows="15" cols="100"></textarea>
          {/* <input
            type="text"
            name="animal"
            placeholder="content"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          /> */}
          <input
            style={{ marginTop: '10px', width: '120px' }}
            type="text"
            name="number_image"
            placeholder="number image"
            value={numberImage}
            onChange={(e) => setNumberImage(e.target.value)}
          />
          <input type="submit" className="loader" value="Generate image" />
        </form>
        {/* <div className={styles.result}>{result}</div> */}
        <div style={{ marginTop: '5px' }}>{ waiting }</div>
        {/* {
          result ? 
          <img style={{ marginTop: '5px' }} src={result} alt="Girl in a jacket" width="500" height="600" />
          : <></>
        } */}
        {result?.map((item, index) => (
          <>
            <span>{index + 1}</span>
            <img style={{ marginTop: '5px' }} src={item.url} alt="Girl in a jacket" width="500" height="600" />
          </>
        ))}
        
      </main>
    </div>
  );
}
