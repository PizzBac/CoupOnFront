import React, { useState, useEffect } from 'react';
import NewPost from './WritePost';
import OnePost from './OnePost';
import AllPosts from './AllPosts';

function Board(props) {

    const url = 'http://localhost:5000';
    const [boardScreen, setBoardScreen] = useState("board"); // 현재 화면 지정 state
    const [allPosts, setAllPosts] = useState([]); // 전체 게시물 내용 저장 state
    const [selectedPost, setSelectedPost] = useState(null); // 개별 글 내용 저장 state

    const [pageNum, setPageNum] = useState(1); // 현재 페이지 번호 state
    const numPerPage = 5; // 한 페이지에 보이는 글의 개수

    useEffect(() => {
        if (boardScreen === "board") {
            seeAllPosts();
        }
    }, [boardScreen]); // 처음 화면 뜰 때 전체 글 목록 출력

    function writeNewPost(title, content, writer) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                content: content,
                writer: writer
            })
        };

        fetch(`${url}/board`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                seeOnePost(data.index);
            })
            .catch(error => console.error(error));
    }

    function seeAllPosts() {
        fetch(`${url}/board`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setAllPosts(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function seeOnePost(index) {
        fetch(`${url}/board/${index}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSelectedPost(data);
                setBoardScreen("onePost");
            })
            .catch(error => {
                console.error(error);
            });
    }

    function modifyPost(index, title, content) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                index: index,
                title: title,
                content: content
            })
        };

        fetch(`${url}/board`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSelectedPost(data);
            })
            .catch(error => console.error(error));
    }

    function deletePost(index) {
        const requestOptions = {
            method: 'DELETE'
        };

        fetch(`${url}/board/${index}`, requestOptions)
            .then(data => {
                console.log(data);
                seeAllPosts();
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            {boardScreen === "write" ? (
                <NewPost
                    writeNewPost={writeNewPost}
                    setBoardScreen={setBoardScreen}
                />
            ) : boardScreen === "onePost" ? (
                <OnePost
                    selectedPost={selectedPost}
                    setBoardScreen={setBoardScreen}
                    modifyPost={modifyPost}
                    deletePost={deletePost}
                />
            ) : boardScreen === "board" ? (
                <>
                    <p>테스트보드</p>
                    {/* <ul>
                        {allPosts.map(post => (
                            <li key={post.index}>
                                <button onClick={() => seeOnePost(post.index)}>
                                    {post.title}
                                </button>
                            </li>
                        ))}
                    </ul> */}
                    <AllPosts
                        allPosts={allPosts}
                        seeOnePost={seeOnePost}
                        pageNum={pageNum}
                        setPageNum={setPageNum}
                        numPerPage={numPerPage}
                    />
                    <div>
                        <button className="writeNewPost" onClick={() => setBoardScreen("write")}>새 글 쓰러가기</button>
                        <button className='seeAllPosts' onClick={seeAllPosts}>글 목록 새로고침</button>
                    </div>
                </>
            ) : (
                <>
                    불러올 값이 없습니다.
                    <button className='seeAllPosts' onClick={seeAllPosts}>새로고침하기</button>
                </>
            )}
        </>
    )
}

export default Board;