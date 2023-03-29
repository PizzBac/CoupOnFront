import { useStompClient, useSubscription, StompSessionProvider } from "react-stomp-hooks";

function TestBoard(props) {
    const stompClient = useStompClient();

    if (stompClient) {
        console.log("board connect success");
    } else {
        console.log("board stompClient is null");
    }

    useSubscription("/board", (str) => {
        console.log("ㅇㅇㅇ" + str.body)
    });

    // function seeAllPosts() {
    //     stompClient.publish({
    //         destination: '/board',
    //     });
    // };

    function seeAllPosts() {
        fetch('http://localhost:5000/board')
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function seeOnePosts() {
        fetch('http://localhost:5000/board/1')
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            테스트보드
            <button className='seeAllPosts' onClick={seeAllPosts}>모든 글 보기</button>
            <button className='seeOnePosts' onClick={seeOnePosts}>1번 글 보기</button>
        </>
    )
}

export default TestBoard;