import styled from "styled-components";
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { CustomCard, CustomContainer } from '../components/Styles';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Context } from '../index';
import { useContext } from 'react';

const Row = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
`;

// let data = [
//   {no:1, title:'1번', content:'1번입니다', writer: '둘리'},
//   {no:2, title:'2번', content:'2번입니다', writer: '또치'},
//   {no:3, title:'3번', content:'3번입니다', writer: '도우너'},
// ];

function BoardList(){

  const token = useSelector((state) => state.member.token);

  const navigate = useNavigate();

  // 컨텍스트에서 host 데이터 가져오기
  const { host } = useContext(Context);

  const [list, setList] = useState([]);

  // await는 async 함수 안에서만 사용할 수 있음
  // axios는 비동기 함수로 응답을 받기 위해서 await를 써야함
  const apicall = async () => {
    // const response = await axios.get('http://localhost:8080/board/list', {
    // const response = await axios.get('http://3.35.231.182:8080/board/list', {
    const response = await axios.get(`${host}/board/list`, {
      headers: {
        Authorization: token
      }
    });
    if (response.status !== 200) {
      throw new Error(`api error: ${response.status} ${response.statusText}`);
    }
    setList(response.data);
  };

  // api를 직접 호출하면 api가 무한으로 호출됨
  // api호출 -> 상태 업데이트 -> 컴포넌트 다시 호출 -> 다시 api 호출 ...
  // apicall(); 

  // 해결방법: useEffect 사용
  // useEffect를 사용하면 컴포넌트가 처음 렌더링될때 한번만 실행됨
  // 두번째 인자로 빈배열을 주면, 해당 코드가 한번만 실행됨
  useEffect(() => {
    apicall(); 
  }, []);

  return (
        <CustomCard>
            <CustomContainer>
                <Row>
                    <h3>게시물 목록</h3>
                    <Button variant="primary" onClick={()=>{
                        navigate('/board/register');
                    }}>게시물 등록</Button>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>제목</th>
                            <th>작성자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list&& list.map((board)=>{
                                return <tr>
                                    <td><Link to={'/board/read/'+board.no}>{board.no}</Link></td>
                                    <td>{board.title}</td>
                                    <td>{board.writer}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </CustomContainer>
        </CustomCard>
    );
}

export default BoardList;