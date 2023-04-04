import React, { useState, useEffect } from 'react';
import './AllPosts2.css'

function AllPosts({ allPosts, seeOnePost, pageNum, setPageNum, numPerPage, setBoardScreen, seeAllPosts, savedSearchFilterCondition, setSavedSearchFilterCondition, savedSearchFilterInput, setSavedSearchFilterInput }) {

    const [sortedPosts, setSortedPosts] = useState([]);

    const [searchFilterCondition, setSearchFilterCondition] = useState('title');
    const [searchFilterInput, setSearchFilterInput] = useState('');
    const [filteredPosts, setFilteredPosts] = useState(sortedPosts);

    const totalPosts = filteredPosts.length;
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

    // 글 검색

    const handleSearchFilterConditionChange = (event) => {
        setSearchFilterCondition(event.target.value);
        setSearchFilterInput('')
    };

    const handleSearchFilterInputChange = (event) => {
        setSearchFilterInput(event.target.value);
    };

    const handleSearchFilter = () => {
        const newFilteredPosts = sortedPosts.filter((post) => {
            return post[searchFilterCondition].toLowerCase().includes(searchFilterInput.toLowerCase());
        });
        setPageNum(1);
        setFilteredPosts(newFilteredPosts);
    };

    const handleRefreshPosts = () => {
        seeAllPosts();
        setSearchFilterCondition('title');
        setSearchFilterInput('');
        setPageNum(1);
    };

    const handleSeeOnePost = (index) => {
        setSavedSearchFilterCondition(searchFilterCondition);
        setSavedSearchFilterInput(searchFilterInput);
        seeOnePost(index);
    };

    const handleWriteNewPost = () => {
        setSavedSearchFilterCondition(searchFilterCondition);
        setSavedSearchFilterInput(searchFilterInput);
        setBoardScreen("write");
    };

    useEffect(() => {
        setSortedPosts(allPosts.slice().reverse()); // slice() - 원본 배열에 영향 안 주기 위해 사용
    }, [allPosts]);

    useEffect(() => {
        if (savedSearchFilterCondition !== '' && savedSearchFilterInput !== '') {
            setSearchFilterCondition(savedSearchFilterCondition);
            setSearchFilterInput(savedSearchFilterInput);
            setSavedSearchFilterCondition('');
            setSavedSearchFilterInput('');
        }
        handleSearchFilter();
    }, [sortedPosts]);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts
                        .slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
                        .map((post) => (
                            <tr key={post.index}>
                                <td>{post.index}</td>
                                <td>
                                    <button onClick={() => handleSeeOnePost(post.index)}>
                                        {post.title}
                                    </button>
                                </td>
                                <td>{post.writer}</td>
                                <td>{post.readCount}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className='underListDiv'>
                <div className='seeWriteDiv'>
                    <button className='seeAllPosts' onClick={handleRefreshPosts}>전체 글 보기</button>
                    <button className="writeNewPost" onClick={handleWriteNewPost}>새 글 쓰러가기</button>
                </div>
                <div className='pagingDiv'>
                    <button onClick={handleClickFirstPage}>◀◀</button>
                    <button onClick={handleClickPrevPage}>◀</button>
                    {[...Array(totalPageNum)].map((_, index) => (
                        <button key={index} onClick={() => handleClickPage(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={handleClickNextPage}>▶</button>
                    <button onClick={handleClickLastPage}>▶▶</button>
                </div>
                <div className='inputPageDiv'>
                    <form onSubmit={handleInputPageSubmit}>
                        <input
                            value={inputPage}
                            onChange={handleInputPage}
                            placeholder={`페이지로 이동`}
                        />
                        <button type="submit">이동</button>
                    </form>
                </div>
                <div className='filterDiv'>
                    <div className='filterConditon'>
                        <select id="searchFilterCondition" value={searchFilterCondition} onChange={handleSearchFilterConditionChange}>
                            <option value="title">제목</option>
                            <option value="writer">글쓴이</option>
                        </select>
                    </div>
                    <div className='filterInput'>
                        <input
                            type="text"
                            value={searchFilterInput}
                            onChange={handleSearchFilterInputChange}
                            placeholder="내용 입력"
                        />
                        <button onClick={handleSearchFilter}>검색하기</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllPosts;