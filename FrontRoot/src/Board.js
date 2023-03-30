function Board(props) {

    function uploadNewPost() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'aa',
                content: 'bbbbbbb',
                writer: 'ccc'
            })
        };

        fetch('http://localhost:5000/board', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    function seeAllPosts() {
        fetch('http://localhost:5000/board')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function seeOnePosts() {
        fetch('http://localhost:5000/board/1')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function modifyPost() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                index: 1,
                title: 'aaaadd',
                content: 'bbbb'
            })
        };

        fetch('http://localhost:5000/board', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    function deletePost() {
        const requestOptions = {
            method: 'DELETE'
        };

        fetch('http://localhost:5000/board/1', requestOptions)
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    return (
        <>
            테스트보드
            <button className='uploadNewPosts' onClick={uploadNewPost}>새 글 등록</button>
            <button className='seeAllPosts' onClick={seeAllPosts}>모든 글 보기</button>
            <button className='seeOnePosts' onClick={seeOnePosts}>1번 글 보기</button>
            <button className='modifyPost' onClick={modifyPost}>1번 글 수정하기</button>
            <button className='deletePost' onClick={deletePost}>1번 글 삭제하기</button>
        </>
    )
}

export default Board;