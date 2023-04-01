import React, { useState } from 'react';
import './AllPosts.css';

function AllPosts({ allPosts, seeOnePost, pageNum, setPageNum, numPerPage }) {
    const sortedPosts = allPosts.slice().reverse(); // slice() - 원본 배열에 영향 안 주기 위해 사용
    const totalPosts = sortedPosts.length;
    const totalPageNum = Math.ceil(totalPosts / numPerPage); // ceil() - 올림 처리하여 마지막 페이지까지 생성

    const handleClickPrevPage = () => {
        if (pageNum > 1) {
            setPageNum(pageNum - 1);
        }
    };

    const handleClickNextPage = () => {
        if (pageNum < totalPageNum) {
            setPageNum(pageNum + 1);
        }
    };

    const handleClickFirstPage = () => {
        setPageNum(1);
    };

    const handleClickLastPage = () => {
        setPageNum(totalPageNum);
    };

    const handleClickPage = (page) => {
        setPageNum(page);
    };

    const [inputPage, setInputPage] = useState('');

    const handleInputPage = (event) => {
        const inputValue = event.target.value;
        if (isNaN(inputValue) || inputValue.includes(".")) {
            alert("숫자만 입력해주세요.");
        } else {
            setInputPage(inputValue);
        }
    };

    const handleInputPageSubmit = (event) => {
        event.preventDefault();
        const targetPage = parseInt(inputPage);
        if (targetPage >= 1 && targetPage <= totalPageNum) {
            setPageNum(targetPage);
        }
        setInputPage('');
    };

    return (
        <>
            <ul>
                <div>
                    {sortedPosts
                        .slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
                        .map((post) => (
                            <li key={post.index}>
                                <div className="postIndex">글 번호 : {post.index}</div>
                                <div className="postTitle">
                                    <button onClick={() => seeOnePost(post.index)}>
                                        {post.title}
                                    </button>
                                </div>
                                <div className="postReadCount">
                                    조회 수 : {post.readCount}
                                </div>
                            </li>
                        ))}
                </div>
            </ul>
            <div>
                <button onClick={handleClickFirstPage}>⏪</button>
                <button onClick={handleClickPrevPage}>◀</button>
                {[...Array(totalPageNum)].map((_, index) => (
                    <button key={index} onClick={() => handleClickPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={handleClickNextPage}>▶</button>
                <button onClick={handleClickLastPage}>⏩</button>
            </div>
            <div>
                <form onSubmit={handleInputPageSubmit}>
                    <input
                        value={inputPage}
                        onChange={handleInputPage}
                        placeholder={`페이지로 이동`}
                    />
                    <button type="submit">이동</button>
                </form>
            </div>
        </>
    );
}

export default AllPosts;