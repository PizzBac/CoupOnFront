import React from 'react';
import './HallOfFame.css';

function HallOfFame(props) {
    const { data } = props;

    return (
        <div className="hallofFame">
            <h2>명예의 전당</h2>
            <table>
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>닉네임</th>
                        <th>승리 횟수</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((member, index) => (
                        <tr key={member.id}>
                            <td>{index + 1}</td>
                            <td>{member.id}</td>
                            <td>{member.wincount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HallOfFame;
