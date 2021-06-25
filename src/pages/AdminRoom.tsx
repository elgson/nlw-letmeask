import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import deleteImg from "../assets/images/delete.svg";

import "../styles/room.scss";
import { Fragment } from "react";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { quesntions, title } = useRoom(roomId);

  async function handleEndRoom() {
    if (window.confirm("Tem certeza que voçe deseja excluir esta pergunta")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
      history.push("/");
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que voçe deseja excluir esta pergunta")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {quesntions.length > 0 && <span>{quesntions.length} perguta(s)</span>}
        </div>
        <div className="question-list">
          {quesntions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <Fragment>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pregunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </Fragment>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
