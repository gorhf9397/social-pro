import Nweet from "components/Nweet";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  //console.log(userObj); //ID값 조회
  const [nweet, setNweet] = useState(""); // 글작성 tweet을 가지는 useState 작성
  const [nweets, setNweets] = useState([]);
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id, //id값을 할당해주고 그걸 함수에 담아준다.
  //     };
  //     //console.log(nweetObject);
  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };
  useEffect(() => {
    // firebase v9로 작성 v8로 작성하면 typeerror
    //getNweets();
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
      //console.log(nweetArr);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event; // 'event로 부터' 라는 의미 즉 e안에있는 target 안에있는 value 를 달라고하는es6의 작성법
    setNweet(value);
  };
  // console.log(nweet);
  // console.log(nweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="코멘트 작성"
          maxLength={120}
        />
        <input type="submit" value="글작성" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
